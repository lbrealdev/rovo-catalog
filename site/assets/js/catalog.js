(function () {
  function init() {
    const search = document.getElementById("catalog-search");
    const status = document.getElementById("filter-status");
    const rows = Array.prototype.slice.call(
      document.querySelectorAll(".prompt-row")
    );
    const tagButtons = Array.prototype.slice.call(
      document.querySelectorAll(".tag-filter")
    );
    const rowTags = Array.prototype.slice.call(
      document.querySelectorAll(".prompt-row .tag")
    );

    let activeTag = "";

    function apply() {
      const q = (search && search.value ? search.value : "")
        .trim()
        .toLowerCase();
      let visible = 0;

      rows.forEach(function (row) {
        const hay = row.getAttribute("data-search") || "";
        const tags = (row.getAttribute("data-tags") || "").split(",").filter(Boolean);
        const matchQ = !q || hay.indexOf(q) !== -1;
        const matchTag = !activeTag || tags.indexOf(activeTag) !== -1;
        const show = matchQ && matchTag;
        row.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });

      document.querySelectorAll(".category").forEach(function (section) {
        const any = section.querySelector(".prompt-row:not(.is-hidden)");
        section.classList.toggle("is-empty", !any);
      });

      if (status) {
        status.textContent =
          visible === rows.length
            ? ""
            : "Showing " + visible + " of " + rows.length;
      }
    }

    function setActiveTag(tag) {
      activeTag = tag || "";
      tagButtons.forEach(function (btn) {
        const t = btn.getAttribute("data-tag") || "";
        btn.classList.toggle("is-active", t === activeTag);
      });
      apply();
    }

    if (search) search.addEventListener("input", apply);

    tagButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setActiveTag(btn.getAttribute("data-tag") || "");
      });
    });

    rowTags.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setActiveTag(btn.getAttribute("data-tag") || "");
        if (search) search.focus();
      });
    });

    apply();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
