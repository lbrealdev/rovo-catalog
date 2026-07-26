(function () {
  const KEY = "rovo-catalog-theme";

  function current() {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (e) {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function syncButton(theme) {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const next = theme === "dark" ? "light" : "dark";
    btn.setAttribute("aria-label", "Switch to " + next + " theme");
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {}
    syncButton(theme);
  }

  function supportsViewTransitions() {
    return (
      typeof document !== "undefined" &&
      typeof document.startViewTransition === "function"
    );
  }

  function toggle(event) {
    const next = current() === "dark" ? "light" : "dark";
    if (!supportsViewTransitions()) {
      apply(next);
      return;
    }
    const x = event && event.clientX ? event.clientX : window.innerWidth / 2;
    const y = event && event.clientY ? event.clientY : 0;
    const end = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const transition = document.startViewTransition(function () {
      apply(next);
    });
    transition.ready.then(function () {
      const clip = [
        "circle(0px at " + x + "px " + y + "px)",
        "circle(" + end + "px at " + x + "px " + y + "px)",
      ];
      document.documentElement.animate(
        { clipPath: clip },
        {
          duration: 420,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  }

  function init() {
    syncButton(current());
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", toggle);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
