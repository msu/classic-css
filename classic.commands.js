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
