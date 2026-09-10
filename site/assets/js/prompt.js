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

  function fieldControls(form) {
    if (!form) return [];
    return Array.prototype.slice.call(
      form.querySelectorAll("input[data-placeholder], select[data-placeholder]")
    );
  }

  function substitute(template, map) {
    let out = template;
    Object.keys(map).forEach(function (name) {
      const token = "<" + name + ">";
      out = out.split(token).join(map[name] || token);
    });
    return out;
  }

  function profileProject() {
    if (!window.RovoProfile) return "";
    const p = window.RovoProfile.read() || {};
    return (p.PROJECT || "").trim();
  }

  var TICKET_KEY_RE = /^[A-Za-z][A-Za-z0-9_]*-\d+$/;

  function normalizeTicketKey(raw) {
    let token = String(raw || "").trim();
    if (!token) return { key: "", reason: "" };
    // Strip a trailing comma left by paste/typing.
    if (token.charAt(token.length - 1) === ",") {
      token = token.slice(0, -1).trim();
    }
    if (!token) return { key: "", reason: "" };
    if (/^\d+$/.test(token)) {
      const project = profileProject();
      if (!project) return { key: "", reason: "needs-project" };
      return { key: project + "-" + token, reason: "" };
    }
    if (TICKET_KEY_RE.test(token)) return { key: token, reason: "" };
    return { key: "", reason: "invalid" };
  }

  function splitTagTokens(text) {
    return String(text || "")
      .split(/[\s,]+/)
      .map(function (part) {
        return part.trim();
      })
      .filter(Boolean);
  }

  function initTagsInput(root, onChange) {
    const chipsEl = root.querySelector("[data-tags-chips]");
    const entry = root.querySelector(".tags-entry");
    const hidden = root.querySelector("input[data-placeholder]");
    const hintEl =
      (root.parentElement && root.parentElement.querySelector("[data-tags-hint]")) ||
      root.querySelector("[data-tags-hint]");
    if (!chipsEl || !entry || !hidden) return;

    const tags = [];

    function setHint(message) {
      if (!hintEl) return;
      if (message) {
        hintEl.textContent = message;
        hintEl.hidden = false;
      } else {
        hintEl.textContent = "";
        hintEl.hidden = true;
      }
    }

    function syncHidden() {
      hidden.value = tags.join(", ");
      hidden.dataset.touched = "1";
      if (typeof onChange === "function") onChange();
    }

    function renderChips() {
      chipsEl.innerHTML = "";
      tags.forEach(function (tag, idx) {
        const chip = document.createElement("span");
        chip.className = "tags-chip";
        chip.setAttribute("data-tag-index", String(idx));

        const label = document.createElement("span");
        label.className = "tags-chip-label";
        label.textContent = tag;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "tags-chip-remove";
        remove.setAttribute("aria-label", "Remove " + tag);
        remove.textContent = "×";
        remove.addEventListener("click", function (ev) {
          ev.preventDefault();
          tags.splice(idx, 1);
          renderChips();
          syncHidden();
          entry.focus();
        });

        chip.appendChild(label);
        chip.appendChild(remove);
        chipsEl.appendChild(chip);
      });
    }

    function addTokens(parts) {
      let added = false;
      let needsProject = false;
      let skippedInvalid = false;
      parts.forEach(function (part) {
        const result = normalizeTicketKey(part);
        if (result.reason === "needs-project") {
          needsProject = true;
          return;
        }
        if (result.reason === "invalid") {
          skippedInvalid = true;
          return;
        }
        const key = result.key;
        if (!key) return;
        const exists = tags.some(function (t) {
          return t.toLowerCase() === key.toLowerCase();
        });
        if (exists) return;
        tags.push(key);
        added = true;
      });
      if (added) {
        renderChips();
        syncHidden();
      }
      if (needsProject) {
        setHint("Set Profile PROJECT to expand bare IDs");
      } else if (skippedInvalid) {
        setHint("Skipped invalid key(s)");
      } else if (added) {
        setHint("");
      }
    }

    function commitEntry() {
      const parts = splitTagTokens(entry.value);
      if (!parts.length) return;
      entry.value = "";
      addTokens(parts);
    }

    entry.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === ",") {
        ev.preventDefault();
        commitEntry();
        return;
      }
      if (ev.key === "Backspace" && !entry.value && tags.length) {
        tags.pop();
        renderChips();
        syncHidden();
      }
    });

    entry.addEventListener("blur", function () {
      commitEntry();
    });

    entry.addEventListener("paste", function (ev) {
      const text =
        (ev.clipboardData && ev.clipboardData.getData("text")) || "";
      if (!text || splitTagTokens(text).length < 2) return;
      ev.preventDefault();
      addTokens(splitTagTokens(text));
      entry.value = "";
    });
  }

  function initTagsInputs(form, onChange) {
    if (!form) return;
    Array.prototype.slice
      .call(form.querySelectorAll(".tags-input[data-tags-for]"))
      .forEach(function (root) {
        initTagsInput(root, onChange);
      });
  }

  function bindFormInputs(inputs, onChange) {
    inputs.forEach(function (input) {
      if (input.type === "hidden") return;
      const evt = input.tagName === "SELECT" ? "change" : "input";
      input.addEventListener(evt, function () {
        input.dataset.touched = "1";
        onChange();
      });
      if (input.tagName === "SELECT") {
        input.addEventListener("input", function () {
          input.dataset.touched = "1";
          onChange();
        });
      }
    });
  }

  function applyProfileToInputs(inputs, profile) {
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
  }

  function valuesFrom(inputs) {
    const map = {};
    inputs.forEach(function (input) {
      map[input.getAttribute("data-placeholder")] = input.value || "";
    });
    return map;
  }

  /** Single-prompt page: one form drives one preview. */
  function initStepForm(form) {
    const scope = form.closest(".prompt-step, .prompt-detail");
    if (!scope) return null;
    const rawEl = scope.querySelector(".prompt-body-raw");
    if (!rawEl) return null;

    const template = rawEl.textContent;
    const inputs = fieldControls(form);

    function render() {
      rawEl.textContent = substitute(template, valuesFrom(inputs));
    }

    function applyProfile(profile) {
      applyProfileToInputs(inputs, profile);
      render();
    }

    initTagsInputs(form, render);
    bindFormInputs(inputs, render);

    return {
      render: render,
      applyProfile: applyProfile,
      inputs: inputs,
    };
  }

  /** Hub workflow: one shared form drives every step preview. */
  function initHubForm(form) {
    const article = form.closest(".prompt-detail");
    if (!article) return null;
    const rawEls = Array.prototype.slice.call(
      article.querySelectorAll(".prompt-body-raw")
    );
    if (!rawEls.length) return null;

    const templates = rawEls.map(function (el) {
      return el.textContent;
    });
    const inputs = fieldControls(form);

    function render() {
      const map = valuesFrom(inputs);
      rawEls.forEach(function (el, i) {
        el.textContent = substitute(templates[i], map);
      });
    }

    function applyProfile(profile) {
      applyProfileToInputs(inputs, profile);
      render();
    }

    initTagsInputs(form, render);
    bindFormInputs(inputs, render);

    return {
      render: render,
      applyProfile: applyProfile,
      inputs: inputs,
    };
  }

  function initCopyButtons() {
    const buttons = Array.prototype.slice.call(
      document.querySelectorAll(".copy-btn[data-copy-target]")
    );
    buttons.forEach(function (btn) {
      btn.addEventListener("click", async function () {
        const targetId = btn.getAttribute("data-copy-target") || "";
        const statusId = btn.getAttribute("data-copy-status") || "";
        const rawEl = document.getElementById(targetId);
        const statusEl = statusId ? document.getElementById(statusId) : null;
        if (!rawEl) return;
        const text = rawEl.textContent;
        try {
          await navigator.clipboard.writeText(text);
          if (statusEl) statusEl.textContent = "Copied";
        } catch {
          const range = document.createRange();
          range.selectNodeContents(rawEl);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          try {
            document.execCommand("copy");
            if (statusEl) statusEl.textContent = "Copied";
          } catch {
            if (statusEl) statusEl.textContent = "Copy failed — select manually";
          }
        }
        setTimeout(function () {
          if (statusEl) statusEl.textContent = "";
        }, 1600);
      });
    });
  }

  function init() {
    // Queries are out of scope for recent/favorites (Prompts catalog only).
    const isQuery = document.body.classList.contains("kind-query");
    if (!isQuery) {
      initRecent();
      initFavorites();
    }

    const controllers = [];
    const hubForm = document.querySelector("form[data-hub-form]");
    if (hubForm) {
      const hub = initHubForm(hubForm);
      if (hub) controllers.push(hub);
    } else {
      Array.prototype.slice
        .call(document.querySelectorAll("form[data-step-form]"))
        .forEach(function (form) {
          const c = initStepForm(form);
          if (c) controllers.push(c);
        });
    }

    document.addEventListener("rovo-profile-updated", function (ev) {
      controllers.forEach(function (c) {
        c.inputs.forEach(function (input) {
          if (input.hasAttribute("data-profile-field")) {
            delete input.dataset.touched;
          }
        });
        c.applyProfile(ev.detail);
      });
    });

    controllers.forEach(function (c) {
      c.applyProfile();
    });

    initCopyButtons();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
