
ready(function () {
  delegateEvent("click", "[js-toggle-comparison]", function (e, toggle) {    
    forEachNode($("[js-toggle-comparison]"), function (node) {
      removeClass(node, "s-active");
    });

    forEachNode($("[js-comparison]"), function (node) {
      removeClass(node, "s-active");
    });

    addClass(toggle, "s-active");

    var toggleName = toggle.getAttribute("js-toggle-comparison");
    addClass($("[js-comparison=" + toggleName + "]")[0], "s-active");
  });
});
