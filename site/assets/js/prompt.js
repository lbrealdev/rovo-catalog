(function () {
  const RECENT_KEY = "rovo-catalog-recent";
  const FAVORITES_KEY = "rovo-catalog-favorites";
  const RECENT_MAX = 10;

  function readRecent() {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter(function (item) {
        return item && typeof item.id === "string";
      });
    } catch {
      return [];
    }
  }

  function writeRecent(list) {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function trackRecent(detail) {
    if (!detail || !detail.id) return;
    const list = readRecent().filter(function (item) {
      return item.id !== detail.id;
    });
    list.unshift({
      id: detail.id,
      title: detail.title || detail.id,
      category: detail.category || "",
      timestamp: Date.now(),
    });
    writeRecent(list.slice(0, RECENT_MAX));
  }

  function readFavorites() {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter(function (id) {
        return typeof id === "string";
      });
    } catch {
      return [];
    }
  }

  function writeFavorites(ids) {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    } catch (e) {}
  }

  function isFavorite(id) {
    return readFavorites().indexOf(id) !== -1;
  }

  function setFavoriteIcon(btn, on) {
    btn.textContent = on ? "★" : "☆";
    btn.classList.toggle("is-favorited", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.setAttribute("aria-label", on ? "Remove favorite" : "Add favorite");
  }

  function syncFavoriteButtons(id) {
    const on = isFavorite(id);
    const btns = Array.prototype.slice.call(
      document.querySelectorAll('.favorite-toggle[data-favorite-id="' + id + '"]')
    );
    btns.forEach(function (btn) {
      setFavoriteIcon(btn, on);
    });
  }

  function toggleFavorite(id) {
    if (!id) return;
    let ids = readFavorites();
    const idx = ids.indexOf(id);
    if (idx === -1) ids.push(id);
    else ids.splice(idx, 1);
    writeFavorites(ids);
    syncFavoriteButtons(id);
  }

  function initFavorites() {
    const btns = Array.prototype.slice.call(
      document.querySelectorAll(".favorite-toggle[data-favorite-id]")
    );
    btns.forEach(function (btn) {
      const id = btn.getAttribute("data-favorite-id") || "";
      setFavoriteIcon(btn, isFavorite(id));
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        toggleFavorite(id);
      });
    });

    window.addEventListener("storage", function (ev) {
      if (ev.key !== FAVORITES_KEY) return;
      btns.forEach(function (btn) {
        const id = btn.getAttribute("data-favorite-id") || "";
        setFavoriteIcon(btn, isFavorite(id));
      });
    });
  }

  function initRecent() {
    const article = document.querySelector(".prompt-detail[data-prompt-id]");
    if (!article) return;
    const id = article.getAttribute("data-prompt-id") || "";
    if (!id) return;
    trackRecent({
      id: id,
      title: article.getAttribute("data-prompt-title") || id,
      category: article.getAttribute("data-prompt-category") || "",
    });
  }

  function init() {
    const form = document.getElementById("placeholder-form");
    const rawEl = document.getElementById("prompt-body-raw");
    const preview = document.getElementById("prompt-preview");
    const copyBtn = document.getElementById("copy-btn");
    const copyStatus = document.getElementById("copy-status");
    if (!rawEl || !preview) return;

    initRecent();
    initFavorites();

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
