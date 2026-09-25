(function () {
  var pages = document.querySelectorAll(".page");
  var tabLinks = document.querySelectorAll("[data-tab]");
  var defaultTab = "home";

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
})();
