
//= require fastclick
//= require helpers/utils
//= require helpers/dom
//= require helpers/pop
//= require helpers/nouislider
//= require ./webfont

WebFont.load({
  custom: {
    families: ["Museo Sans"]
  },
  google: {
    families: ['Lora:400,700']
  }
});


// Button Handler
delegateEvent("click", ".button", function (e, button) {
  e.preventDefault();

  var inkSize = 500,
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

  menus.forEach(function (data) {
    new ActionMenu(data).init();
  });
});

