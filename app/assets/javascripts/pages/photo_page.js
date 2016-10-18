
ready(function () {
  delegateEvent("click", "[js-toggle-comparison]", function (e, toggle) {
    var toggleName = toggle.getAttribute("js-toggle-comparison");
    
    forEachNode($("[js-toggle-comparison]"), function (node) {
      node.setAttribute("class", "button m-white toggle-comparison--toggle");
    });

    forEachNode($("[js-comparison]"), function (node) {
      var classes = node.getAttribute("class");
      node.setAttribute("class", classes.replace(/s-active/g, ""));
    });

    toggleClass(toggle, "s-active", true);
    $("[js-comparison=" + toggleName + "]")[0].classList += " s-active";
  });
});
