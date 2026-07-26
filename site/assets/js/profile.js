(function () {
  const STORAGE_KEY = "rovo-catalog-profile";
  const PROFILE_FIELDS = ["PROJECT", "YOUR-USER"];

  function readProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { PROJECT: "", "YOUR-USER": "" };
      const data = JSON.parse(raw);
      return {
        PROJECT: typeof data.PROJECT === "string" ? data.PROJECT : "",
        "YOUR-USER":
          typeof data["YOUR-USER"] === "string" ? data["YOUR-USER"] : "",
      };
    } catch {
      return { PROJECT: "", "YOUR-USER": "" };
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

  function initPanel() {
    const toggle = document.getElementById("profile-toggle");
    const panel = document.getElementById("profile-panel");
    const form = document.getElementById("profile-form");
    const clearBtn = document.getElementById("profile-clear");
    if (!toggle || !panel || !form) return;

    function closePanel() {
      panel.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    }

    function openPanel() {
      setStatus("");
      panel.removeAttribute("hidden");
      toggle.setAttribute("aria-expanded", "true");
    }

    fillForm(readProfile());

    toggle.addEventListener("click", function () {
      if (panel.hasAttribute("hidden")) openPanel();
      else closePanel();
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const profile = {
        PROJECT: (document.getElementById("profile-PROJECT") || {}).value || "",
        "YOUR-USER":
          (document.getElementById("profile-YOUR-USER") || {}).value || "",
      };
      writeProfile(profile);
      document.dispatchEvent(
        new CustomEvent("rovo-profile-updated", { detail: profile })
      );
      closePanel();
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        clearProfile();
        fillForm({ PROJECT: "", "YOUR-USER": "" });
        setStatus("Cleared");
        document.dispatchEvent(
          new CustomEvent("rovo-profile-updated", {
            detail: { PROJECT: "", "YOUR-USER": "" },
          })
        );
      });
    }
  }

  window.RovoProfile = {
    read: readProfile,
    write: writeProfile,
    clear: clearProfile,
    fields: PROFILE_FIELDS,
  };

  document.addEventListener("DOMContentLoaded", initPanel);
})();
