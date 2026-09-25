(function () {
  var pages = document.querySelectorAll(".page");
  var tabLinks = document.querySelectorAll("[data-tab]");
  var defaultTab = "about";

  function showTab(id) {
    if (!document.getElementById(id)) id = defaultTab;

    pages.forEach(function (page) {
      page.hidden = page.id !== id;
    });

    tabLinks.forEach(function (link) {
      var isActive = link.dataset.tab === id;
      link.classList.toggle("active", isActive && link.classList.contains("tab-link"));
    });

    window.scrollTo(0, 0);
  }

  tabLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var id = link.dataset.tab;
      history.replaceState(null, "", "#" + id);
      showTab(id);
    });
  });

  var initial = (window.location.hash || "#" + defaultTab).slice(1);
  showTab(initial);

  // --- inline text editing ---
  var EDIT_KEY = "portfolio-edits-v5";
  var editableEls = Array.prototype.slice.call(document.querySelectorAll("[data-editable]"));
  var editToggle = document.getElementById("edit-toggle");
  var editSave = document.getElementById("edit-save");
  var editHint = document.getElementById("edit-hint");
  var editing = false;

  function loadEdits() {
    var saved;
    try {
      saved = JSON.parse(localStorage.getItem(EDIT_KEY) || "{}");
    } catch (e) {
      saved = {};
    }
    editableEls.forEach(function (el, i) {
      if (saved[i] != null) el.innerHTML = saved[i];
    });
  }

  function persistEdits() {
    var data = {};
    editableEls.forEach(function (el, i) {
      data[i] = el.innerHTML;
    });
    try {
      localStorage.setItem(EDIT_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  var autoSaveTimer = null;
  function scheduleAutoSave() {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(persistEdits, 400);
  }

  function setEditing(on) {
    editing = on;
    editableEls.forEach(function (el) {
      el.contentEditable = on ? "true" : "false";
    });
    document.body.classList.toggle("edit-mode", on);
    editToggle.textContent = on ? "Done editing" : "Edit text";
    editSave.hidden = !on;
    editHint.hidden = !on;
    if (!on) persistEdits();
  }

  editableEls.forEach(function (el) {
    el.addEventListener("input", function () {
      if (editing) scheduleAutoSave();
    });
  });

  window.addEventListener("beforeunload", function () {
    if (editing) persistEdits();
  });

  function downloadCurrentPage() {
    var doc = document.documentElement.cloneNode(true);
    doc.querySelectorAll("[data-editable]").forEach(function (el) {
      el.removeAttribute("contenteditable");
    });
    var toolbar = doc.querySelector(".edit-toolbar");
    if (toolbar) toolbar.remove();

    var html = "<!DOCTYPE html>\n" + doc.outerHTML;
    var blob = new Blob([html], { type: "text/html" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (editToggle) {
    editToggle.addEventListener("click", function () {
      setEditing(!editing);
    });
  }
  if (editSave) {
    editSave.addEventListener("click", function () {
      persistEdits();
      downloadCurrentPage();
    });
  }

  loadEdits();
})();
