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

    document.addEventListener('pointerdown', function (event) {
      if (!mobileMenuQuery || !mobileMenuQuery.matches || toggle.getAttribute('aria-expanded') !== 'true') {
        return;
      }
      if (event.target instanceof Node && !nav.contains(event.target)) {
        setMenuExpanded(nav, false);
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

  function setSidebarExpanded(sidebar, expanded) {
    const toggle = sidebar.querySelector(':scope > .classic-sidebar-toggle');
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', String(expanded));
  }

  function syncSidebarToggleVisibility(sidebar) {
    const toggle = sidebar.querySelector(':scope > .classic-sidebar-toggle');
    if (!toggle || !mobileMenuQuery) return;
    toggle.hidden = !mobileMenuQuery.matches;
    if (!mobileMenuQuery.matches) {
      setSidebarExpanded(sidebar, false);
    }
  }

  function enhanceSidebarDisclosure(sidebar) {
    const nav = sidebar.querySelector(':scope > nav');
    if (!nav || sidebar.querySelector(':scope > .classic-sidebar-toggle')) {
      return;
    }

    const toggle = document.createElement('button');
    const label = document.createElement('span');
    const current = document.createElement('span');

    sidebar.classList.add('classic-sidebar-enhanced');
    toggle.type = 'button';
    toggle.className = 'classic-sidebar-toggle';
    toggle.setAttribute('aria-controls', ensureId(nav, 'classic-sidebar-nav-'));
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Toggle section navigation');

    label.textContent = 'Sections';
    current.className = 'classic-sidebar-toggle-current';
    current.setAttribute('aria-hidden', 'true');
    toggle.appendChild(label);
    toggle.appendChild(current);
    sidebar.insertBefore(toggle, nav);
    syncSidebarToggleVisibility(sidebar);

    toggle.addEventListener('click', function () {
      setSidebarExpanded(sidebar, toggle.getAttribute('aria-expanded') !== 'true');
    });

    sidebar.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        setSidebarExpanded(sidebar, false);
        toggle.focus();
      }
    });

    document.addEventListener('pointerdown', function (event) {
      if (!mobileMenuQuery || !mobileMenuQuery.matches || toggle.getAttribute('aria-expanded') !== 'true') {
        return;
      }
      if (event.target instanceof Node && !sidebar.contains(event.target)) {
        setSidebarExpanded(sidebar, false);
      }
    });

    if (mobileMenuQuery && typeof mobileMenuQuery.addEventListener === 'function') {
      mobileMenuQuery.addEventListener('change', function () {
        syncSidebarToggleVisibility(sidebar);
      });
    } else if (mobileMenuQuery && typeof mobileMenuQuery.addListener === 'function') {
      mobileMenuQuery.addListener(function () {
        syncSidebarToggleVisibility(sidebar);
      });
    }
  }

  function enhanceSidebarScrollspy(sidebar) {
    enhanceSidebarDisclosure(sidebar);

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

      const current = sidebar.querySelector(':scope > .classic-sidebar-toggle .classic-sidebar-toggle-current');
      if (current) {
        current.textContent = item.link.textContent.trim();
      }
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
        if (!mobileMenuQuery || mobileMenuQuery.matches) {
          setSidebarExpanded(sidebar, false);
          const toggle = sidebar.querySelector(':scope > .classic-sidebar-toggle');
          if (toggle) {
            toggle.focus();
          }
        }
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

(function () {
  'use strict';

  const HOTKEY = 'k';
  let palette = null;
  let input = null;
  let list = null;
  let commands = [];
  let customCommands = [];
  let visible = [];
  let activeIndex = 0;
  let lastFocused = null;

  function isTypingContext(element) {
    return element && (element.matches('input, textarea, select') || element.isContentEditable);
  }

  function escapeHtml(value) {
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

  function ensureId(element, prefix) {
    if (!element.id) {
      element.id = prefix + '-' + Math.random().toString(36).slice(2, 9);
    }
    return element.id;
  }

  function focusTarget(target) {
    const focusable = target.matches('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
        ? target
        : target.querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (focusable) {
      focusable.focus({ preventScroll: true });
      return;
    }

    const hadTabIndex = target.hasAttribute('tabindex');
    if (!hadTabIndex) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
    if (!hadTabIndex) {
      target.addEventListener('blur', function cleanup() {
        target.removeAttribute('tabindex');
        target.removeEventListener('blur', cleanup);
      });
    }
  }

  function addCommand(name, aliases, target, description) {
    /*
      Add a destination to the control menu:
        - name is the title it will show up as
        - aliases are alternative search titles
        - target is the element that will be focussed
        - description will show up, right aligned, for additional context

     */
    if (!name || !target) return;
    commands.push({
      name: String(name),
      aliases: Array.isArray(aliases) ? aliases.map(String) : [],
      target: target,
      description: description || '',
      run: function () {
        focusTarget(target);
      }
    });
  }

  function restoreFocus() {
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus({ preventScroll: true });
    }
    lastFocused = null;
  }

  function getLabelledByText(element) {
    const labelledBy = element.getAttribute('aria-labelledby');
    if (!labelledBy) return '';
    return labelledBy
      .split(/\s+/)
      .map(function (id) {
        const label = document.getElementById(id);
        return label ? label.textContent.trim() : '';
      })
      .filter(Boolean)
      .join(' ');
  }

  function getJumpLabel(element) {
    return (
      element.getAttribute('data-jump-label') ||
      element.getAttribute('aria-label') ||
      getLabelledByText(element) ||
      element.id
    ).trim();
  }

  function collectJumpableTargets() {
    document.querySelectorAll('[data-jumpable]').forEach(function (el) {
      const label = getJumpLabel(el);
      const raw = (
        el.getAttribute('data-jumpable') ||
        el.getAttribute('data-jump-aliases') ||
        label
      ).trim().toLowerCase();

      const aliases = raw.split(/\s+/).filter(Boolean);
      const name = (el.getAttribute('data-jump-label') || aliases.shift() || label).trim();

      if (!name) return;
      addCommand(name, aliases, el, el.getAttribute('data-jump-description') || 'Jump target');
    });
  }

  function collectCustomCommands() {
    customCommands.forEach(function (command) {
      if (!command || !command.name || typeof command.run !== 'function') return;
      commands.push({
        name: String(command.name),
        aliases: Array.isArray(command.aliases) ? command.aliases.map(String) : [],
        description: command.description || 'Custom command',
        run: command.run
      });
    });
  }

  function collectCommands() {
    /*
      Adds general navigation commands plus explicit jump targets declared with
      data-jumpable.
     */
    commands = [];

    addCommand('top', ['home', 'start'], document.body, 'Jump to top of page');
    addCommand('nav', ['navbar', 'menu'], document.querySelector('nav'), 'Jump to navigation');
    addCommand('main', ['content'], document.querySelector('main'), 'Jump to main content');
    addCommand('search', ['find'], document.querySelector('input[type="search"]'), 'Jump to search input');
    addCommand('forms', ['form'], document.querySelector('form'), 'Jump to first form');
    addCommand('footer', ['end'], document.querySelector('footer'), 'Jump to footer');

    collectJumpableTargets();
    collectCustomCommands();
  }

  function renderList(items) {
    list.innerHTML = '';
    if (!items.length) {
      const emptyItem = document.createElement('li');
      emptyItem.className = 'classic-command-empty';
      emptyItem.setAttribute('role', 'option');
      emptyItem.setAttribute('aria-disabled', 'true');
      emptyItem.setAttribute('aria-selected', 'false');
      emptyItem.innerHTML = '<strong>No matching commands</strong><small class="muted">Try: nav, main, forms, footer, top</small>';
      list.appendChild(emptyItem);
      return;
    }

    items.forEach(function (command, index) {
      const li = document.createElement('li');
      li.id = 'classic-command-option-' + index;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(index === activeIndex));
      li.addEventListener('click', function () {
        closePalette();
        command.run();
      });

      const option = document.createElement('span');
      option.className = 'classic-command-item';
      option.innerHTML = '<span>' + escapeHtml(command.name) + '</span><small class="muted">' + escapeHtml(command.description) + '</small>';
      li.appendChild(option);
      list.appendChild(li);
    });
  }

  function updateFilter() {
    const query = input.value.trim().toLowerCase();
    visible = commands.filter(function (command) {
      if (!query) return true; // Empty query gets all commands
      if (command.name.indexOf(query) !== -1) return true; // Command name contains query
      return command.aliases.some(function (alias) { return alias.indexOf(query) !== -1; }); // Command Alias contains query
    });
    activeIndex = 0; // Reset selected element
    renderList(visible.slice(0, 12));
    updateActiveDescendant();
  }

  function openPalette() {
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    collectCommands();
    input.value = '';
    updateFilter();
    palette.showModal();
    input.setAttribute('aria-expanded', 'true');
    input.focus();
  }

  function closePalette() {
    if (palette.open) palette.close();
  }

  function runActive() {
    if (!visible.length) return;
    const command = visible[Math.max(0, Math.min(activeIndex, visible.length - 1))]; // Bounds active [0,commandSize]
    closePalette();
    command.run();
  }

  function moveActive(delta) {
    if (!visible.length) return;
    const renderedCount = Math.min(visible.length, 12);
    activeIndex = (activeIndex + delta + renderedCount) % renderedCount;
    renderList(visible.slice(0, 12));
    updateActiveDescendant();
  }

  function updateActiveDescendant() {
    if (!input) return;
    if (!visible.length) {
      input.removeAttribute('aria-activedescendant');
      return;
    }
    input.setAttribute('aria-activedescendant', 'classic-command-option-' + activeIndex);
  }

  function buildPalette() {
    palette = document.createElement('dialog');
    palette.className = 'window classic-command-palette';
    palette.setAttribute('aria-label', 'Command palette');
    ensureId(palette, 'classic-command-palette');

    const title = document.createElement('div');
    title.className = 'window-titlebar';
    title.innerHTML = '<span>Command Palette</span><small class="muted">Esc to close</small>';

    const pane = document.createElement('div');
    pane.className = 'window-pane stack';

    input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type a command (e.g. nav, main, forms, footer)';
    input.setAttribute('aria-label', 'Command input');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', 'classic-command-list');
    input.setAttribute('aria-autocomplete', 'list');

    list = document.createElement('ul');
    list.className = 'menu';
    list.setAttribute('role', 'listbox');
    list.id = 'classic-command-list';

    const footer = document.createElement('div');
    footer.className = 'window-statusbar';
    footer.textContent = 'Ctrl+K / Cmd+K to open, Enter to run';

    pane.appendChild(input);
    pane.appendChild(list);
    palette.appendChild(title);
    palette.appendChild(pane);
    palette.appendChild(footer);
    document.body.appendChild(palette);

    input.addEventListener('input', updateFilter);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveActive(1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveActive(-1);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        runActive();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closePalette();
      }
    });

    palette.addEventListener('close', function () {
      input.setAttribute('aria-expanded', 'false');
      restoreFocus();
    });
  }

  window.ClassicCommands = {
    register: function (command) {
      customCommands.push(command);
    }
  };

  document.addEventListener('keydown', function (event) {
    const openHotkey = (event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey && event.key.toLowerCase() === HOTKEY;
    if (openHotkey && !isTypingContext(document.activeElement)) {
      event.preventDefault();
      if (!palette) buildPalette();

      if (!palette.open) { // Toggle command menu on HOTKEY
        openPalette();
      } else {
        closePalette();
      }
      return;
    }

    if (event.key === 'Escape' && palette && palette.open) {
      event.preventDefault();
      closePalette();
    }
  });
})();
