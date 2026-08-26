(function () {
  const STORAGE_KEY = "rovo-catalog-profile";
  const PROFILE_FIELDS = ["PROJECT", "YOUR-USER", "CONFLUENCE-PAGE-URL"];

  function emptyProfile() {
    return {
      PROJECT: "",
      "YOUR-USER": "",
      "CONFLUENCE-PAGE-URL": "",
    };
  }

  function readProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyProfile();
      const data = JSON.parse(raw);
      return {
        PROJECT: typeof data.PROJECT === "string" ? data.PROJECT : "",
        "YOUR-USER":
          typeof data["YOUR-USER"] === "string" ? data["YOUR-USER"] : "",
        "CONFLUENCE-PAGE-URL":
          typeof data["CONFLUENCE-PAGE-URL"] === "string"
            ? data["CONFLUENCE-PAGE-URL"]
            : "",
      };
    } catch {
      return emptyProfile();
    }
  }

  function writeProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {}
  }

  function clearProfile() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function fillForm(profile) {
    PROFILE_FIELDS.forEach(function (name) {
      const el = document.getElementById("profile-" + name);
      if (el) el.value = profile[name] || "";
    });
  }

  function setStatus(msg) {
    const el = document.getElementById("profile-status");
    if (el) el.textContent = msg || "";
  }

  function isProfileReady(profile) {
    const p = profile || readProfile();
    return !!(p.PROJECT && p["YOUR-USER"]);
  }

  function updateHint() {
    const hint = document.getElementById("profile-hint");
    if (!hint) return;
    if (isProfileReady()) hint.setAttribute("hidden", "");
    else hint.removeAttribute("hidden");
  }

  function initPanel() {
    const toggle = document.getElementById("profile-toggle");
    const panel = document.getElementById("profile-panel");
    const form = document.getElementById("profile-form");
    const clearBtn = document.getElementById("profile-clear");
    const hintOpen = document.getElementById("profile-hint-open");
    if (!toggle || !panel || !form) return;

    function closePanel() {
      panel.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    }

    function openPanel() {
      setStatus("");
      panel.removeAttribute("hidden");
      toggle.setAttribute("aria-expanded", "true");
      const project = document.getElementById("profile-PROJECT");
      if (project) project.focus();
    }

    fillForm(readProfile());
    updateHint();

    toggle.addEventListener("click", function () {
      if (panel.hasAttribute("hidden")) openPanel();
      else closePanel();
    });

    if (hintOpen) {
      hintOpen.addEventListener("click", function () {
        openPanel();
      });
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const project = (
        (document.getElementById("profile-PROJECT") || {}).value || ""
      ).trim();
      const user = (
        (document.getElementById("profile-YOUR-USER") || {}).value || ""
      ).trim();
      const confluence = (
        (document.getElementById("profile-CONFLUENCE-PAGE-URL") || {}).value ||
        ""
      ).trim();
      if (!project || !user) {
        setStatus("Project and username are required");
        return;
      }
      const profile = {
        PROJECT: project,
        "YOUR-USER": user,
        "CONFLUENCE-PAGE-URL": confluence,
      };
      writeProfile(profile);
      document.dispatchEvent(
        new CustomEvent("rovo-profile-updated", { detail: profile })
      );
      updateHint();
      closePanel();
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        clearProfile();
        fillForm(emptyProfile());
        setStatus("Cleared");
        document.dispatchEvent(
          new CustomEvent("rovo-profile-updated", {
            detail: emptyProfile(),
          })
        );
        updateHint();
      });
    }
  }

  window.RovoProfile = {
    read: readProfile,
    write: writeProfile,
    clear: clearProfile,
    fields: PROFILE_FIELDS,
    isReady: isProfileReady,
    updateHint: updateHint,
  };

  document.addEventListener("DOMContentLoaded", initPanel);
})();
