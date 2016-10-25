
//= require fastclick
//= require helpers/utils
//= require helpers/dom
//= require helpers/pop
//= require helpers/nouislider
//= require ./webfont

WebFont.load({
  custom: {
    families: ["Museo Sans"],
    urls: ["https://d2vez5w0ugqe83.cloudfront.net/fonts/museo_sans/500.ttf",
           "https://d2vez5w0ugqe83.cloudfront.net/fonts/museo_sans/900.ttf"]
  },
  google: {
    families: ['Lora:400,700']
  }
});

// Button Handler
delegateEvent("click", ".button", function (e, button) {
  if (!window.pressDisabled) {
    e.preventDefault();

    var inkSize = 300,
        css = "\
          left: " + (e.offsetX - inkSize / 2) + "px;\
          top: " + (e.offsetY - inkSize / 2) + "px;"

    var el = [
      "<div class='button--ink-container' style='" + css + "'>",
        "<div class='button--ink'></div>",
      "</div>"
    ].join("\n");

    button.insertAdjacentHTML('beforeend', el);

    setTimeout(function () {
      forEachNode($(".button--ink-container"), function (node) {
        node.parentNode.removeChild(node);
      });
    }, 500);

    var href = button.href,
        platform = navigator.platform,
        ctrlModifier = platform === "Mac68K" ||
                       platform === "MacPPC" ||
                       platform === "MacIntel" ? e.metaKey : e.ctrlKey;

    if (href) {
      setTimeout(function () {
        if (ctrlModifier) {
          window.open(href);
        } else {
          window.location = href;
        }
      }, 300);
    }
  }
});


// Modal Handler
delegateEvent("click", "[js-modal-toggle]", function (e, toggle) {
  e.stopPropagation();

  // Toggle page-wide changes for modal behavior.
  toggleScroll();
  toggleBlur();

  var modal = $("[js-modal='" + attr(toggle, "js-modal-toggle") + "']")[0];
  toggleClass($(".modal")[0], "s-active");
  toggleClass(modal, "s-active");
});


ready(function () {
  // Removes 300ms delay on mobile whe clicking
  new FastClick(document.body);

  menuData.forEach(function (data) {
    new ActionMenu(data).init();
  });
});

