
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

// Prevent long presses from opening links on mobile
var hasTouchStartEvent = 'ontouchstart' in document.createElement( 'div' ),
    pressTimer;

if (hasTouchStartEvent) {
  window.pressDisabled = false;
  delegateEvent('touchend', "a, [js-pop--toggle]", function (e) {
    clearTimeout(pressTimer);
  });

  delegateEvent("click", "a, [js-pop--toggle]", function (e) {
    if (window.pressDisabled) {
      e.stopPropagation();  
      e.preventDefault();
      
      setTimeout(function () {
        window.pressDisabled = false;
      }, 50);
    }
  });

  delegateEvent('touchstart', "a, [js-pop--toggle]", function (e, link) {
    pressTimer = window.setTimeout(function () {
      window.pressDisabled = true;
    }, 500);
  });
}

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

    var href = button.href;
    if (href) {
      setTimeout(function () {
        window.location = href;
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

