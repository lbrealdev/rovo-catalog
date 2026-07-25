(function () {
  function init() {
    const form = document.getElementById("placeholder-form");
    const rawEl = document.getElementById("prompt-body-raw");
    const preview = document.getElementById("prompt-preview");
    const copyBtn = document.getElementById("copy-btn");
    const copyStatus = document.getElementById("copy-status");
    if (!rawEl || !preview) return;

    const template = rawEl.textContent;
    const inputs = form
      ? Array.prototype.slice.call(
          form.querySelectorAll("input[data-placeholder]")
        )
      : [];

    function applyProfile(profile) {
      if (!window.RovoProfile) return;
      const p = profile || window.RovoProfile.read();
      inputs.forEach(function (input) {
        const name = input.getAttribute("data-placeholder");
        if (
          input.hasAttribute("data-profile-field") &&
          p[name] &&
          !input.dataset.touched
        ) {
          input.value = p[name];
        }
      });
      render();
    }

    function values() {
      const map = {};
      inputs.forEach(function (input) {
        map[input.getAttribute("data-placeholder")] = input.value || "";
      });
      return map;
    }

    function render() {
      let out = template;
      const map = values();
      Object.keys(map).forEach(function (name) {
        const token = "<" + name + ">";
        out = out.split(token).join(map[name] || token);
      });
      rawEl.textContent = out;
    }

    inputs.forEach(function (input) {
      input.addEventListener("input", function () {
        input.dataset.touched = "1";
        render();
      });
    });

    document.addEventListener("rovo-profile-updated", function (ev) {
      inputs.forEach(function (input) {
        if (input.hasAttribute("data-profile-field")) {
          delete input.dataset.touched;
        }
      });
      applyProfile(ev.detail);
    });

    if (copyBtn) {
      copyBtn.addEventListener("click", async function () {
        const text = rawEl.textContent;
        try {
          await navigator.clipboard.writeText(text);
          if (copyStatus) copyStatus.textContent = "Copied";
        } catch {
          const range = document.createRange();
          range.selectNodeContents(rawEl);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          try {
            document.execCommand("copy");
            if (copyStatus) copyStatus.textContent = "Copied";
          } catch {
            if (copyStatus) copyStatus.textContent = "Copy failed — select manually";
          }
        }
        setTimeout(function () {
          if (copyStatus) copyStatus.textContent = "";
        }, 1600);
      });
    }

    applyProfile();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
