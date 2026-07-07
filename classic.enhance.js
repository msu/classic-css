(function () {
  "use strict";

  const controlSelector = 'input:not([type="hidden"],[type="submit"],[type="reset"],[type="button"],[type="checkbox"],[type="radio"]), select, textarea';
  const autoIdPrefix = 'classic-auto-field-';
  const mobileMenuQuery = window.matchMedia ? window.matchMedia('(max-width: 48rem)') : null;
  let autoIdCount = 0;

  function nextControl(nodes, startIndex) {
    for (let i = startIndex + 1; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (node.nodeType === Node.ELEMENT_NODE && node.matches(controlSelector)) {
        return node;
      }
      if (node.nodeType === Node.ELEMENT_NODE && node.matches('button, [role="button"], .button, hr, fieldset, .field, .toolbar')) {
        return null;
      }
    }
    return null;
  }

  function ensureId(control, prefix) {
    if (!control.id) {
      autoIdCount += 1;
      control.id = (prefix || autoIdPrefix) + autoIdCount;
    }
    return control.id;
  }

  function setMenuExpanded(nav, expanded) {
    const toggle = nav.querySelector(':scope > .classic-nav-toggle');
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', String(expanded));
  }

  function syncMenuToggleVisibility(nav) {
    const toggle = nav.querySelector(':scope > .classic-nav-toggle');
    if (!toggle || !mobileMenuQuery) return;
    toggle.hidden = !mobileMenuQuery.matches;
    if (!mobileMenuQuery.matches) {
      setMenuExpanded(nav, false);
    }
  }

  function enhanceHeaderMenu(nav) {
    const menu = nav.querySelector(':scope > ul, :scope > ol');
    if (!menu || nav.querySelector(':scope > .classic-nav-toggle')) {
      return;
    }

    const toggle = document.createElement('button');
    const label = document.createElement('span');

    nav.classList.add('classic-nav-enhanced');
    toggle.type = 'button';
    toggle.className = 'classic-nav-toggle';
    toggle.setAttribute('aria-controls', ensureId(menu, 'classic-nav-menu-'));
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Toggle navigation');

    label.className = 'visually-hidden';
    label.textContent = 'Menu';
    toggle.appendChild(label);
    nav.insertBefore(toggle, menu);
    syncMenuToggleVisibility(nav);

    toggle.addEventListener('click', function () {
      setMenuExpanded(nav, toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (event) {
      if (event.target instanceof Element && event.target.closest('a')) {
        setMenuExpanded(nav, false);
      }
    });

    nav.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        setMenuExpanded(nav, false);
        toggle.focus();
      }
    });

    if (mobileMenuQuery && typeof mobileMenuQuery.addEventListener === 'function') {
      mobileMenuQuery.addEventListener('change', function () {
        syncMenuToggleVisibility(nav);
      });
    } else if (mobileMenuQuery && typeof mobileMenuQuery.addListener === 'function') {
      mobileMenuQuery.addListener(function () {
        syncMenuToggleVisibility(nav);
      });
    }
  }

  function upgradeBareTextLabels(form) {
    const nodes = Array.prototype.slice.call(form.childNodes);

    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (node.nodeType !== Node.TEXT_NODE) {
        continue;
      }

      const text = node.textContent.replace(/\s+/g, ' ').trim();
      if (!text) {
        continue;
      }

      const control = nextControl(nodes, i);
      if (!control) {
        continue;
      }

      const label = document.createElement('label');
      label.textContent = text;
      label.htmlFor = ensureId(control);
      node.parentNode.replaceChild(label, node);
    }
  }

  document.querySelectorAll('form:not([data-classic-no-autolabels])').forEach(upgradeBareTextLabels);
  document.querySelectorAll('body.layout-topbar > header > nav, body.layout-sidebar > header > nav, body.layout-scroll > header > nav').forEach(enhanceHeaderMenu);
})();
