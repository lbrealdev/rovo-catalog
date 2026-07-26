(function () {
  function init() {
    const catalog = document.getElementById("catalog");
    if (!catalog) return;
    const search = document.getElementById("catalog-search");
    const status = document.getElementById("filter-status");
    const hub = document.getElementById("category-browse");
    const pager = document.getElementById("pager");

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

    const state = {
      mode: "browse",
      category: "",
      tag: "",
      query: "",
      page: 1,
    };

    function matchesFilter(row) {
      const q = state.query;
      const hay = row.getAttribute("data-search") || "";
      if (q && hay.indexOf(q) === -1) return false;
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

    function categoryLabel(c) {
      const btn = hubBtns.filter(function (b) {
        return (b.getAttribute("data-category") || "") === c;
      })[0];
      if (btn) {
        const lbl = btn.querySelector(".cat-hub-label");
        if (lbl) return lbl.textContent || c;
      }
      return c;
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
        msg = matchCount + " in " + categoryLabel(state.category);
      } else if (state.mode === "filter") {
        msg =
          matchCount === rows.length
            ? ""
            : "Showing " + matchCount + " of " + rows.length;
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
      if (mode === "browse") state.category = "";
      if (mode === "category" && opts && opts.category) {
        state.category = opts.category;
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
      enterFilterOrReturn();
      render();
    }

    function setTag(tag) {
      state.tag = tag || "";
      tagFilterBtns.forEach(function (btn) {
        const t = btn.getAttribute("data-tag") || "";
        btn.classList.toggle("is-active", t === state.tag);
      });
      enterFilterOrReturn();
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

    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
