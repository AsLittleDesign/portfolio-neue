
global.ready(function () {
  delegateEvent("click", "[js-toggle-comparison]", function (e, toggle) {
    $("[js-toggle-comparison]").each(function (node) {
      $(node).removeClass("s-active");
    });
    
    $("[js-comparison]").each(function (node) {
      $(node).removeClass("s-active");
    });

    $(toggle).addClass("s-active");
    
    var toggleName = $(toggle).attr("js-toggle-comparison");
    $("[js-comparison=" + toggleName + "]").addClass("s-active");
  });
});
