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

  function sidebarLinkTarget(link) {
    const href = link.getAttribute('href');
    if (!href || href.charAt(0) !== '#' || href === '#') {
      return null;
    }

    try {
      return document.getElementById(decodeURIComponent(href.slice(1)));
    } catch (error) {
      return document.getElementById(href.slice(1));
    }
  }

  function enhanceSidebarScrollspy(sidebar) {
    const items = Array.prototype.slice.call(sidebar.querySelectorAll('nav a[href^="#"]'))
      .map(function (link) {
        return {
          link: link,
          target: sidebarLinkTarget(link)
        };
      })
      .filter(function (item) {
        return item.target;
      });

    if (items.length < 2) {
      return;
    }

    let activeItem = null;
    let ticking = false;

    function setActive(item) {
      if (activeItem === item) {
        return;
      }

      activeItem = item;
      items.forEach(function (entry) {
        if (entry === item) {
          entry.link.setAttribute('aria-current', 'page');
        } else if (entry.link.getAttribute('aria-current') === 'page') {
          entry.link.removeAttribute('aria-current');
        }
      });
    }

    function findActiveItem() {
      const documentElement = document.documentElement;
      const atPageEnd = window.scrollY + window.innerHeight >= documentElement.scrollHeight - 2;
      const offset = Math.min(220, Math.max(96, window.innerHeight * 0.24));
      let current = items[0];

      if (atPageEnd) {
        return items[items.length - 1];
      }

      items.forEach(function (item) {
        if (item.target.getBoundingClientRect().top <= offset) {
          current = item;
        }
      });

      return current;
    }

    function updateActiveItem() {
      ticking = false;
      setActive(findActiveItem());
    }

    function requestUpdate() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateActiveItem);
    }

    sidebar.addEventListener('click', function (event) {
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      const item = link ? items.find(function (entry) { return entry.link === link; }) : null;
      if (item) {
        setActive(item);
      }
    });

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    updateActiveItem();
  }

  function escapeCode(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function highlightHtmlTag(tag) {
    if (tag.indexOf('<!--') === 0) {
      return '<span class="token-comment">' + escapeCode(tag) + '</span>';
    }

    const match = tag.match(/^(<\/?)([A-Za-z][\w:-]*)([\s\S]*?)(\/?>)$/);
    if (!match) {
      return escapeCode(tag);
    }

    const attributes = match[3];
    let output = '<span class="token-tag">' + escapeCode(match[1] + match[2]) + '</span>';
    let lastIndex = 0;
    const attributePattern = /(\s+)([^\s=/>]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g;
    let attributeMatch = attributePattern.exec(attributes);

    while (attributeMatch) {
      output += escapeCode(attributes.slice(lastIndex, attributeMatch.index));
      output += escapeCode(attributeMatch[1]);
      output += '<span class="token-attr">' + escapeCode(attributeMatch[2]) + '</span>';
      if (attributeMatch[3]) {
        output += '=<span class="token-string">' + escapeCode(attributeMatch[3]) + '</span>';
      }
      lastIndex = attributeMatch.index + attributeMatch[0].length;
      attributeMatch = attributePattern.exec(attributes);
    }

    output += escapeCode(attributes.slice(lastIndex));
    output += '<span class="token-tag">' + escapeCode(match[4]) + '</span>';
    return output;
  }

  function highlightHtml(source) {
    let output = '';
    let lastIndex = 0;
    const tagPattern = /<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>/g;
    let match = tagPattern.exec(source);

    while (match) {
      output += escapeCode(source.slice(lastIndex, match.index));
      output += highlightHtmlTag(match[0]);
      lastIndex = match.index + match[0].length;
      match = tagPattern.exec(source);
    }

    return output + escapeCode(source.slice(lastIndex));
  }

  function highlightCode(source) {
    let output = '';
    let lastIndex = 0;
    const tokenPattern = /\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|if|else|true|false|null|document|window|class|new)\b|(?:--)?[A-Za-z_-][\w-]*(?=\s*:)|[#.]?[A-Za-z_-][\w-]*(?=\s*\{)|\b\d+(?:\.\d+)?(?:rem|em|px|ch|vw|vh|%)?\b/g;
    let match = tokenPattern.exec(source);

    while (match) {
      const token = match[0];
      const rest = source.slice(match.index + token.length);
      let tokenClass = '';

      output += escapeCode(source.slice(lastIndex, match.index));

      if (token.indexOf('/*') === 0 || token.indexOf('//') === 0) {
        tokenClass = 'token-comment';
      } else if (/^["'`]/.test(token)) {
        tokenClass = 'token-string';
      } else if (/^(const|let|var|function|return|if|else|true|false|null|document|window|class|new)$/.test(token)) {
        tokenClass = 'token-keyword';
      } else if (/^\d/.test(token)) {
        tokenClass = 'token-number';
      } else if (/^\s*:/.test(rest)) {
        tokenClass = 'token-property';
      } else if (/^\s*\{/.test(rest)) {
        tokenClass = 'token-selector';
      }

      output += tokenClass
        ? '<span class="' + tokenClass + '">' + escapeCode(token) + '</span>'
        : escapeCode(token);
      lastIndex = match.index + token.length;
      match = tokenPattern.exec(source);
    }

    return output + escapeCode(source.slice(lastIndex));
  }

  function enhanceCodeHighlighting(code) {
    const source = code.textContent;
    const trimmed = source.trim();

    if (!trimmed || code.dataset.classicHighlighted === 'true') {
      return;
    }

    code.dataset.classicHighlighted = 'true';
    code.innerHTML = trimmed.charAt(0) === '<' ? highlightHtml(source) : highlightCode(source);
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
  document.querySelectorAll('body.layout-sidebar > .sidebar').forEach(enhanceSidebarScrollspy);
  document.querySelectorAll('body.layout-sidebar main pre code').forEach(enhanceCodeHighlighting);
})();
