(function () {
  const RECENT_KEY = "rovo-catalog-recent";
  const FAVORITES_KEY = "rovo-catalog-favorites";

  const CATEGORY_LABELS = {
    triage: "Triage",
    tickets: "Tickets",
    sla: "SLA",
    communication: "Communication",
    utilities: "Utilities",
  };

  const SHORTCUTS = [
    { label: "Monday Triage", category: "triage", tag: "morning" },
    { label: "SLA at Risk", category: "", tag: "sla" },
    { label: "Reopened", category: "tickets", tag: "reopened" },
    { label: "Proofreading", category: "communication", tag: "proofread" },
  ];

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

  function categoryLabel(key) {
    return CATEGORY_LABELS[key] || key || "";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function stripItemHtml(item) {
    const label = categoryLabel(item.category);
    return (
      '<a class="strip-item" href="prompts/' +
      encodeURIComponent(item.id) +
      '.html">' +
      '<span class="strip-item-title">' +
      escapeHtml(item.title || item.id) +
      "</span>" +
      (label
        ? '<span class="strip-item-cat">' + escapeHtml(label) + "</span>"
        : "") +
      "</a>"
    );
  }

  function init() {
    const catalog = document.getElementById("catalog");
    if (!catalog) return;
    const search = document.getElementById("catalog-search");
    const status = document.getElementById("filter-status");
    const hub = document.getElementById("category-browse");
    const pager = document.getElementById("pager");
    const recentStrip = document.getElementById("recent-strip");
    const recentItems = document.getElementById("recent-strip-items");
    const favoritesStrip = document.getElementById("favorites-strip");
    const favoritesItems = document.getElementById("favorites-strip-items");
    const shortcutsEl = document.getElementById("situation-shortcuts");

    const pagerEnabled = catalog.getAttribute("data-pager") !== "off";
    const PER_PAGE = 10;

    const rows = Array.prototype.slice.call(
      catalog.querySelectorAll(".prompt-row")
    );
    const sections = Array.prototype.slice.call(
      catalog.querySelectorAll(".category")
    );
    const tagFilterBtns = Array.prototype.slice.call(
      document.querySelectorAll(".tag-filter")
    );
    const rowTagBtns = Array.prototype.slice.call(
      catalog.querySelectorAll(".prompt-row .tag")
    );
    const hubBtns = hub
      ? Array.prototype.slice.call(hub.querySelectorAll(".cat-hub-btn"))
      : [];
    const favoriteBtns = Array.prototype.slice.call(
      catalog.querySelectorAll(".favorite-toggle[data-favorite-id]")
    );

    const state = {
      mode: "browse",
      category: "",
      tag: "",
      query: "",
      page: 1,
    };

    const rowById = {};
    rows.forEach(function (row) {
      const id = row.getAttribute("data-id") || "";
      if (id) rowById[id] = row;
    });

    function availableTags() {
      const set = {};
      rows.forEach(function (row) {
        (row.getAttribute("data-tags") || "")
          .split(",")
          .filter(Boolean)
          .forEach(function (t) {
            set[t] = true;
          });
      });
      return set;
    }

    function matchesFilter(row) {
      const q = state.query;
      const hay = row.getAttribute("data-search") || "";
      if (q && hay.indexOf(q) === -1) return false;
      if (state.category) {
        if (row.getAttribute("data-category") !== state.category) return false;
      }
      if (state.tag) {
        const tags = (row.getAttribute("data-tags") || "")
          .split(",")
          .filter(Boolean);
        if (tags.indexOf(state.tag) === -1) return false;
      }
      return true;
    }

    function visibleSet() {
      if (state.mode === "category") {
        return rows.filter(function (r) {
          return r.getAttribute("data-category") === state.category;
        });
      }
      if (state.mode === "filter") return rows.filter(matchesFilter);
      return rows;
    }

    function totalPages(count) {
      if (!pagerEnabled) return 1;
      return Math.max(1, Math.ceil(count / PER_PAGE));
    }

    function hubCategoryLabel(c) {
      const btn = hubBtns.filter(function (b) {
        return (b.getAttribute("data-category") || "") === c;
      })[0];
      if (btn) {
        const lbl = btn.querySelector(".cat-hub-label");
        if (lbl) return lbl.textContent || c;
      }
      return categoryLabel(c);
    }

    function pageList(cur, total) {
      const out = [];
      const w = 1;
      for (let n = 1; n <= total; n++) {
        if (n === 1 || n === total || (n >= cur - w && n <= cur + w)) {
          out.push(n);
        } else if (out[out.length - 1] !== "…") {
          out.push("…");
        }
      }
      return out;
    }

    function renderPager(pages) {
      if (!pager) return;
      if (!pagerEnabled || pages <= 1) {
        pager.setAttribute("hidden", "");
        pager.innerHTML = "";
        return;
      }
      pager.removeAttribute("hidden");
      const cur = state.page;
      let html = "";
      html +=
        '<button type="button" class="pager-arrow" data-page="' +
        (cur - 1) +
        '"' +
        (cur === 1 ? " disabled" : "") +
        ' aria-label="Previous page">←</button>';
      pageList(cur, pages).forEach(function (n) {
        if (n === "…") {
          html +=
            '<span class="pager-ellipsis" aria-hidden="true">…</span>';
        } else {
          html +=
            '<button type="button" class="pager-num' +
            (n === cur ? " is-active" : "") +
            '" data-page="' +
            n +
            '" aria-label="Page ' +
            n +
            '"' +
            (n === cur ? ' aria-current="page"' : "") +
            ">" +
            n +
            "</button>";
        }
      });
      html +=
        '<button type="button" class="pager-arrow" data-page="' +
        (cur + 1) +
        '"' +
        (cur === pages ? " disabled" : "") +
        ' aria-label="Next page">→</button>';
      pager.innerHTML = html;
    }

    function renderStatus(matchCount) {
      if (!status) return;
      let msg = "";
      if (state.mode === "category") {
        msg = matchCount + " in " + hubCategoryLabel(state.category);
      } else if (state.mode === "filter") {
        if (matchCount === rows.length) {
          msg = "";
        } else if (state.category) {
          msg =
            "Showing " +
            matchCount +
            " of " +
            rows.length +
            " in " +
            hubCategoryLabel(state.category);
        } else {
          msg = "Showing " + matchCount + " of " + rows.length;
        }
      }
      status.textContent = msg;
    }

    function renderHub() {
      if (!hub) return;
      if (state.mode === "filter") {
        hub.setAttribute("hidden", "");
        return;
      }
      hub.removeAttribute("hidden");
      hubBtns.forEach(function (btn) {
        const c = btn.getAttribute("data-category") || "";
        const active =
          (state.mode === "browse" && c === "") ||
          (state.mode === "category" && c === state.category);
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    function renderTagFilters() {
      tagFilterBtns.forEach(function (btn) {
        const t = btn.getAttribute("data-tag") || "";
        btn.classList.toggle("is-active", t === state.tag);
      });
    }

    function shortcutMatches(sc) {
      if (state.mode !== "filter") return false;
      if (state.query) return false;
      if (state.tag !== (sc.tag || "")) return false;
      return (state.category || "") === (sc.category || "");
    }

    function renderShortcuts() {
      if (!shortcutsEl) return;
      const btns = Array.prototype.slice.call(
        shortcutsEl.querySelectorAll(".shortcut-btn")
      );
      btns.forEach(function (btn) {
        const idx = parseInt(btn.getAttribute("data-shortcut"), 10);
        const sc = SHORTCUTS[idx];
        if (!sc) return;
        btn.classList.toggle("is-active", shortcutMatches(sc));
      });
    }

    function render() {
      const set = visibleSet();
      const pages = totalPages(set.length);
      if (state.page > pages) state.page = pages;
      if (state.page < 1) state.page = 1;

      const start = (state.page - 1) * PER_PAGE;
      const end = pagerEnabled ? start + PER_PAGE : set.length;
      const visibleIds = new Set();
      for (let i = start; i < end && i < set.length; i++) {
        visibleIds.add(set[i]);
      }

      rows.forEach(function (row) {
        row.classList.toggle("is-hidden", !visibleIds.has(row));
      });

      sections.forEach(function (section) {
        const any = section.querySelector(".prompt-row:not(.is-hidden)");
        section.classList.toggle("is-empty", !any);
      });

      renderPager(pages);
      renderStatus(set.length);
      renderHub();
      renderTagFilters();
      renderShortcuts();
      renderEmpty(set.length);
    }

    function renderEmpty(count) {
      let empty = document.getElementById("catalog-empty");
      if (count === 0) {
        if (!empty) {
          empty = document.createElement("p");
          empty.id = "catalog-empty";
          empty.className = "empty-state";
          empty.setAttribute("role", "status");
          empty.textContent = "No prompts match — try clearing the search or filters.";
          catalog.parentNode.insertBefore(empty, pager || catalog.nextSibling);
        }
      } else if (empty) {
        empty.parentNode.removeChild(empty);
      }
    }

    function setMode(mode, opts) {
      state.mode = mode;
      if (mode === "browse") {
        state.category = "";
        state.tag = "";
      }
      if (mode === "category" && opts && opts.category) {
        state.category = opts.category;
        state.tag = "";
      }
      state.page = 1;
      render();
    }

    function enterFilterOrReturn() {
      if (state.tag || state.query) state.mode = "filter";
      else state.mode = state.category ? "category" : "browse";
      state.page = 1;
    }

    function setSearch(value) {
      state.query = (value || "").trim().toLowerCase();
      // Manual search is global — do not keep a prior category scope.
      if (state.query) state.category = "";
      enterFilterOrReturn();
      render();
    }

    function setTag(tag) {
      state.tag = tag || "";
      // Manual tag filters are global — only shortcuts keep category+tag.
      if (state.tag) state.category = "";
      enterFilterOrReturn();
      render();
    }

    function applyShortcut(sc) {
      if (shortcutMatches(sc)) {
        state.category = "";
        state.tag = "";
        enterFilterOrReturn();
        render();
        return;
      }
      state.mode = "filter";
      state.category = sc.category || "";
      state.tag = sc.tag || "";
      state.query = "";
      if (search) search.value = "";
      state.page = 1;
      render();
    }

    function goToPage(n) {
      const set = visibleSet();
      const pages = totalPages(set.length);
      const next = Math.max(1, Math.min(n, pages));
      if (next === state.page) return;
      state.page = next;
      render();
      if (pager) {
        const active = pager.querySelector(".pager-num.is-active");
        if (active) active.focus();
      }
    }

    function renderRecentStrip() {
      if (!recentStrip || !recentItems) return;
      const list = readRecent();
      recentStrip.setAttribute("data-recent-count", String(list.length));
      if (!list.length) {
        recentStrip.setAttribute("hidden", "");
        recentItems.innerHTML = "";
        return;
      }
      recentStrip.removeAttribute("hidden");
      recentItems.innerHTML = list.map(stripItemHtml).join("");
    }

    function renderFavoritesStrip() {
      if (!favoritesStrip || !favoritesItems) return;
      const ids = readFavorites();
      const items = ids
        .map(function (id) {
          const row = rowById[id];
          if (!row) return null;
          const titleEl = row.querySelector(".prompt-title");
          return {
            id: id,
            title: titleEl ? titleEl.textContent : id,
            category: row.getAttribute("data-category") || "",
          };
        })
        .filter(Boolean)
        .sort(function (a, b) {
          return (a.title || "").localeCompare(b.title || "");
        });

      if (!items.length) {
        favoritesStrip.setAttribute("hidden", "");
        favoritesItems.innerHTML = "";
        return;
      }
      favoritesStrip.removeAttribute("hidden");
      favoritesItems.innerHTML = items.map(stripItemHtml).join("");
    }

    function syncAllFavoriteButtons() {
      favoriteBtns.forEach(function (btn) {
        const id = btn.getAttribute("data-favorite-id") || "";
        setFavoriteIcon(btn, isFavorite(id));
      });
    }

    function toggleFavorite(id) {
      if (!id) return;
      let ids = readFavorites();
      const idx = ids.indexOf(id);
      if (idx === -1) ids.push(id);
      else ids.splice(idx, 1);
      writeFavorites(ids);
      syncAllFavoriteButtons();
      renderFavoritesStrip();
    }

    function initShortcuts() {
      if (!shortcutsEl) return;
      const tags = availableTags();
      const html = SHORTCUTS.map(function (sc, i) {
        if (sc.tag && !tags[sc.tag]) return "";
        return (
          '<button type="button" class="shortcut-btn" data-shortcut="' +
          i +
          '">' +
          escapeHtml(sc.label) +
          "</button>"
        );
      }).join("");
      shortcutsEl.innerHTML = html;
      Array.prototype.slice
        .call(shortcutsEl.querySelectorAll(".shortcut-btn"))
        .forEach(function (btn) {
          btn.addEventListener("click", function () {
            const idx = parseInt(btn.getAttribute("data-shortcut"), 10);
            const sc = SHORTCUTS[idx];
            if (sc) applyShortcut(sc);
          });
        });
    }

    if (search)
      search.addEventListener("input", function () {
        setSearch(search.value);
      });

    tagFilterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTag(btn.getAttribute("data-tag") || "");
      });
    });

    rowTagBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTag(btn.getAttribute("data-tag") || "");
        if (search) search.focus();
      });
    });

    hubBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const c = btn.getAttribute("data-category") || "";
        if (!c) setMode("browse");
        else setMode("category", { category: c });
      });
    });

    favoriteBtns.forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        toggleFavorite(btn.getAttribute("data-favorite-id") || "");
      });
    });

    if (pager) {
      pager.addEventListener("click", function (ev) {
        const t = ev.target.closest("button[data-page]");
        if (!t || t.disabled) return;
        const n = parseInt(t.getAttribute("data-page"), 10);
        if (!isNaN(n)) goToPage(n);
      });
    }

    document.addEventListener("keydown", function (ev) {
      if (!pager || pager.hasAttribute("hidden")) return;
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      const tag = (document.activeElement || {}).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (ev.key === "ArrowLeft") {
        ev.preventDefault();
        goToPage(state.page - 1);
      } else if (ev.key === "ArrowRight") {
        ev.preventDefault();
        goToPage(state.page + 1);
      }
    });

    window.addEventListener("storage", function (ev) {
      if (ev.key === FAVORITES_KEY) {
        syncAllFavoriteButtons();
        renderFavoritesStrip();
      } else if (ev.key === RECENT_KEY) {
        renderRecentStrip();
      }
    });

    initShortcuts();
    syncAllFavoriteButtons();
    renderRecentStrip();
    renderFavoritesStrip();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
