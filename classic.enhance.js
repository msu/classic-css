(function () {
  "use strict";

  var controlSelector = 'input:not([type="hidden"],[type="submit"],[type="reset"],[type="button"],[type="checkbox"],[type="radio"]), select, textarea';
  var autoIdPrefix = 'classic-auto-field-';
  var autoIdCount = 0;

  function nextControl(nodes, startIndex) {
    for (var i = startIndex + 1; i < nodes.length; i += 1) {
      var node = nodes[i];
      if (node.nodeType === Node.ELEMENT_NODE && node.matches(controlSelector)) {
        return node;
      }
      if (node.nodeType === Node.ELEMENT_NODE && node.matches('button, [role="button"], .button, hr, fieldset, .field, .toolbar')) {
        return null;
      }
    }
    return null;
  }

  function ensureId(control) {
    if (!control.id) {
      autoIdCount += 1;
      control.id = autoIdPrefix + autoIdCount;
    }
    return control.id;
  }

  function upgradeBareTextLabels(form) {
    var nodes = Array.prototype.slice.call(form.childNodes);

    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      if (node.nodeType !== Node.TEXT_NODE) {
        continue;
      }

      var text = node.textContent.replace(/\s+/g, ' ').trim();
      if (!text) {
        continue;
      }

      var control = nextControl(nodes, i);
      if (!control) {
        continue;
      }

      var label = document.createElement('label');
      label.textContent = text;
      label.htmlFor = ensureId(control);
      node.parentNode.replaceChild(label, node);
    }
  }

  document.querySelectorAll('form:not([data-classic-no-autolabels])').forEach(upgradeBareTextLabels);
})();
