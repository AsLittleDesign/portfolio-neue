
//= require turbolinks
//= require helpers/utils
//= require helpers/dom
//= require helpers/pop
//= require ./webfont


WebFont.load({
  custom: {
    families: ["Museo Sans"]
  },
  google: {
    families: ['Lora:400,700']
  }
});


ready(function() {
  // shareHandler();
  buttonHandler();
  modalHandler();

  ready(function () {
    menus.forEach(function (data) {
      var actionMenu = new ActionMenu(data);
      actionMenu.init();
    });
  });
});


function buttonHandler() {
  var buttons = $(".button");
  if (!buttons.length) {
    return false;
  }

  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    var inkSize = 300;

    button.addEventListener("click", function(e){
      e.preventDefault();

      var inkContainer = document.createElement("div");
      inkContainer.className += " button--ink-container";
      inkContainer.style.left = e.offsetX - inkSize / 2 + "px";
      inkContainer.style.top = e.offsetY - inkSize / 2 + "px";

      var ink = document.createElement("div");
      ink.className += " button--ink";

      inkContainer.appendChild(ink);
      button.appendChild(inkContainer, button.firstChild);

      if (button.href) {
        setTimeout(function() {
          window.location = button.href;
        }, 600);
      }
    });
  };
}


function modalHandler() {
  var modalToggles = $("[js-modal-toggle]"),
      modals = $("[js-modal]");

  if (!modalToggles) {
    return false;
  }

  for (var i = 0; i < modalToggles.length; i++) {
    var toggle = modalToggles[i];

    // prevent propagation of click events from elements
    // within a toggle element.
    if (toggle.children.length) {
      for (var i = 0; i <= toggle.children.length - 1; i++) {
        toggle.children[i].addEventListener("click", function(e) {
          e.stopPropagation();
        });
      }
    }

    toggle.addEventListener("click", function(e){
      e.stopPropagation();
      var modalId = toggle.getAttribute("js-modal-toggle"),
          modal = $("[js-modal=" + modalId + "]")[0];

      modal.classList.toggle("s-active");
    });
  };
}


function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}


function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}
