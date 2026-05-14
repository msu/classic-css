(function () {
  'use strict';

  var HOTKEY = 'k';
  var palette = null;
  var input = null;
  var list = null;
  var commands = [];
  var visible = [];
  var activeIndex = 0;

  function isTypingContext(el) {
    return el && (el.matches('input, textarea, select') || el.isContentEditable);
  }

  function ensureId(el, prefix) {
    if (!el.id) {
      el.id = prefix + '-' + Math.random().toString(36).slice(2, 9);
    }
    return el.id;
  }

  function focusTarget(target) {
    var focusable = target.matches('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ? target
      : target.querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (focusable) {
      focusable.focus({ preventScroll: true });
      return;
    }

    var hadTabIndex = target.hasAttribute('tabindex');
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
    if (!target) return;
    commands.push({
      name: name,
      aliases: aliases,
      target: target,
      description: description,
      run: function () {
        focusTarget(target);
      }
    });
  }

  function collectCommands() {
    commands = [];

    addCommand('top', ['home', 'start'], document.body, 'Jump to top of page');
    addCommand('nav', ['navbar', 'menu'], document.querySelector('nav'), 'Jump to navigation');
    addCommand('main', ['content'], document.querySelector('main'), 'Jump to main content');
    addCommand('search', ['find'], document.querySelector('input[type="search"]'), 'Jump to search input');
    addCommand('forms', ['form'], document.querySelector('form'), 'Jump to first form');
    addCommand('footer', ['end'], document.querySelector('footer'), 'Jump to footer');

    document.querySelectorAll('h1[id], h2[id], h3[id]').forEach(function (heading) {
      var key = heading.textContent.trim().toLowerCase();
      if (!key) return;
      addCommand(key, [heading.id.toLowerCase()], heading, 'Jump to section heading');
    });

    document.querySelectorAll('[data-classic-jump]').forEach(function (el) {
      var raw = (el.getAttribute('data-classic-jump') || '').trim().toLowerCase();
      if (!raw) return;
      var tokens = raw.split(/\s+/).filter(Boolean);
      addCommand(tokens[0], tokens.slice(1), el, 'Custom jump target');
    });
  }

  function renderList(items) {
    list.innerHTML = '';
    if (!items.length) {
      var emptyItem = document.createElement('li');
      emptyItem.className = 'classic-command-empty';
      emptyItem.innerHTML = '<strong>No matching commands</strong><small class="muted">Try: nav, main, forms, footer, top</small>';
      list.appendChild(emptyItem);
      return;
    }

    items.forEach(function (cmd, idx) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'secondary classic-command-item';
      btn.style.width = '100%';
      btn.setAttribute('aria-selected', String(idx === activeIndex));
      btn.innerHTML = '<span>' + cmd.name + '</span><small class="muted">' + cmd.description + '</small>';
      btn.addEventListener('click', function () {
        closePalette();
        cmd.run();
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function updateFilter() {
    var q = input.value.trim().toLowerCase();
    visible = commands.filter(function (cmd) {
      if (!q) return true;
      if (cmd.name.indexOf(q) !== -1) return true;
      return cmd.aliases.some(function (a) { return a.indexOf(q) !== -1; });
    });
    activeIndex = 0;
    renderList(visible.slice(0, 12));
  }

  function openPalette() {
    collectCommands();
    input.value = '';
    updateFilter();
    palette.showModal();
    input.focus();
  }

  function closePalette() {
    if (palette.open) palette.close();
  }

  function runActive() {
    if (!visible.length) return;
    var cmd = visible[Math.max(0, Math.min(activeIndex, visible.length - 1))];
    closePalette();
    cmd.run();
  }

  function moveActive(delta) {
    if (!visible.length) return;
    activeIndex = (activeIndex + delta + visible.length) % visible.length;
    renderList(visible.slice(0, 12));
  }

  function buildPalette() {
    palette = document.createElement('dialog');
    palette.className = 'window classic-command-palette';
    palette.setAttribute('aria-label', 'Command palette');
    ensureId(palette, 'classic-command-palette');

    var title = document.createElement('div');
    title.className = 'window-titlebar';
    title.innerHTML = '<span>Command Palette</span><small class="muted">Esc to close</small>';

    var pane = document.createElement('div');
    pane.className = 'window-pane stack stack-sm';

    input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type a command (e.g. nav, main, forms, footer)';
    input.setAttribute('aria-label', 'Command input');

    list = document.createElement('ul');
    list.className = 'menu';
    list.setAttribute('role', 'listbox');

    var footer = document.createElement('div');
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
  }

  document.addEventListener('keydown', function (event) {
    var openHotkey = (event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey && event.key.toLowerCase() === HOTKEY;
    if (openHotkey && !isTypingContext(document.activeElement)) {
      event.preventDefault();
      if (!palette) buildPalette();
      if (palette.open) {
        closePalette();
      } else {
        openPalette();
      }
      return;
    }

    if (event.key === 'Escape' && palette && palette.open) {
      event.preventDefault();
      closePalette();
    }
  });
})();
