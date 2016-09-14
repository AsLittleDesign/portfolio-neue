
var menus = [
  { id: "connect",
    format: "context",
    options: [
      { id: "facebook",
        text: "Like on Facebook",
        href: "https://www.facebook.com/aslittledesign/",
        symbol: "facebook"
      },

      { id: "twitter",
        text: "Follow on Twitter",
        href: "https://twitter.com/AsLittleDesign",
        symbol: "twitter"
      },

      { id: "linkedin",
        text: "Connect on LinkedIn",
        href: "https://www.linkedin.com/in/davesmccarthy",
        symbol: "linkedin"
      }
    ]
  },

  { id: "share",
    format: "context",
    options: [
      { id: "facebook",
        text: "Share on Facebook",
        action: function () {
          alert("follow:facebook");
        },
        symbol: "facebook"
      },

      { id: "twitter",
        text: "Share on Twitter",
        action: function () {
          alert("follow:twitter");
        },
        symbol: "twitter"
      },

      { id: "linkedin",
        text: "Share on LinkedIn",
        action: function () {
          alert("follow:linkedin");
        },
        symbol: "linkedin"
      }
    ]
  }
];


// el: element to associate the handler with.
// type: Event type (e.g. click, scroll).
// handler: Function to call, passed the event
function delegateEvent (type, selector, handler) {
  document.addEventListener(type, function (e) {
    e = e || window.event;

    var target   = e.target || e.srcElement,
        nodeList = $(selector);

    for (var i = 0; i < nodeList.length; i++) {
      var node = nodeList[i];
      if (target == node) {
        handler(e);
      }
    }
  });
}


function startActionMenu () {
  menus.forEach(function (menu) {
    var toggle = $("[js-menu=" + menu.id +"]");
  });
}

// ActionMenu Constructor
function ActionMenu (data) {
  this.data = data;
}

ActionMenu.prototype = {
  // Initialize the menu;
  init: function () {
    this.createMenu();
    this.appendMenu();

    var selector = "[js-pop--toggle=" + this.data.id +"]";
    delegateEvent("click", selector, function (e) {
      this.activateMenu(e);
    }.bind(this));
  },


  // Toggles page scrolling on and off
  toggleScrolling: function (state) {
    var body = $("body")[0];

    if (state) {
      body.style.overflowY = state;
    
    } else {
      body.style.overflowY = body.style.overflowY == "hidden" ? "scroll" : "hidden";
    }
  },


  toggleBlur: function () {
    toggleClass($("[js-pop--background]")[0], "s-active");
    toggleAttr($("[js-blur]")[0], "js-blur");
  },


  activateMenu: function (e) {
    var menu = $("[js-pop--menu='" + this.data.id + "']")[0],
        active;
    
    // Toggle page-wide changes for modal behavior.
    this.toggleScrolling();
    this.toggleBlur();

    // Determine if menu is active.
    if (this.active != undefined) {
      active = this.active;

    } else {
      active = menu.classList.contains("s-active") ? true : false;
    }

    // Get information on the element, position, and size of the toggle
    var toggle = $("[js-pop--toggle='" + this.data.id + "']")[0],
        togglePos = {
          top: getOffsetTop(toggle),
          bottom: getOffsetTop(toggle) + toggle.offsetHeight,
          left: getOffsetLeft(toggle),
          right: getOffsetLeft(toggle) + toggle.offsetWidth,
          width: toggle.offsetWidth,
          height: toggle.offsetHeight
        };

    var menuWidth = parseFloat(window.getComputedStyle(menu).getPropertyValue("width"), 10);
    var menuHeight = parseFloat(window.getComputedStyle(menu).getPropertyValue("height"), 10);

    if (!active) {
      // Clone the toggle, and set specific style information
      var clone      = toggle.cloneNode(true),
          cloneStyle = "\
            left: " + togglePos.left + "px;\
            top: " + togglePos.top + "px;\
            height: " + togglePos.height + "px;\
            width: " + togglePos.width + "px;\
            position: absolute;\
            z-index: 2;";

      clone.setAttribute("style", cloneStyle);

      // Add classes to the clone.
      // NOTE: Must be separate due to the toggle-clone
      // class having a transition property set on it.
      toggleClass(clone, "toggle-clone");
      toggleClass(clone, "s-active");

      // Finish up with the clone by appending it to the 
      // DOM and adding  it as a property on this prototype.
      $("[js-pop--wrapper]")[0].appendChild(clone);
      this.clone = clone;

      // Hide original toggle
      toggle.style.opacity    = "0";
      toggle.style.visibility = "hidden";

      // Get positioning, and origin points for the menu.
      var originX = "right",
          originY = "top",
          posLeft = (togglePos.right - menuWidth),
          posTop  = togglePos.top;

      if (togglePos.bottom + menuHeight - window.scrollY + 10 >= window.innerHeight) {
        originY = "bottom";
        posTop  = togglePos.top - menuHeight - 20 + togglePos.height;
      }

      if (togglePos.right <= menuWidth + 10) {
        originX = "left";
        posLeft = togglePos.left;
      }

      // Set menu styles to position and set origin points
      // for the animation.
      var menuStyle = "\
        left: " + posLeft + "px;\
        top: " + posTop + "px;\
        transform-origin: " + originX + " " + originY + ";\
        -ms-transform-origin: " + originX + " " + originY + ";\
        -webkit-transform-origin: " + originX + " " + originY + ";\
        -moz-transform-origin: " + originX + " " + originY + ";\
        " + menu.getAttribute("style");

      menu.setAttribute("style", menuStyle);

      // Set into motion the animation
      toggleClass(menu, "s-active");
      if (originY == "top") {
        menu.style.transform = "translateY(" + (togglePos.height + 10) + "px) scale(1)";
      } else {
        menu.style.transform = "translateY(" + -(togglePos.height - 10) + "px) scale(1)";
      }

    // Remove cloned toggle if the menu is currently active
    } else {
      menu.style.transform = "";
      setTimeout(function () {
        toggleClass(menu, "s-active");
        toggleClass(this.clone, "s-active");

        // Show original toggle
        toggle.style.opacity    = "1";
        toggle.style.visibility = "visible";

        var menuStyle = "\
          left: null;\
          top: null;\
          transform-origin: null;\
          -ms-transform-origin: null;\
          -webkit-transform-origin: null;\
          -moz-transform-origin: null;\
          ";

        menu.setAttribute("style", menuStyle);

        setTimeout(function () {
          $("[js-pop--wrapper]")[0].removeChild(this.clone);
        }.bind(this), 150);
      }.bind(this), 150);
    }

    this.active = !active;
  },


  createMenu: function () {
    // Create options HTML
    var options = [];
    this.data.options.forEach(function(option) {
      var attributes,
          elType = "div";
      
      if (option.href) {
        attributes = "href='" + option.href + "' target='_blank'";
        elType = "a";
      }

      var optionEl = [
        "<" + elType +" class='menu--option' js-pop--option='" + option.id + "' " + attributes + ">",
          "<span class='menu--symbol icon--" + option.symbol + "'></span>",
          option.text,
        "</" + elType + ">"
      ].join("\n");

      options.push(optionEl);
    });

    // Create menu HTML
    var element = [
      "<div class='menu m-" + this.data.format + "' js-pop--menu='" + this.data.id + "'>",
        options,
        "<div class='menu--close' js-pop--toggle='" + this.data.id + "'>Cancel</div>",
      "</div>"
    ];

    // Flatten array
    element = [].concat.apply([], element).join("\n");
    this.html = element;

    // TODO: Set event listeners for all options.
  },


  appendMenu: function () {
    if (this.html) {
      $("[js-pop--wrapper]")[0].insertAdjacentHTML('beforeend', this.html);

    } else {
      console.error("this.html is undefined. Be sure to call this.createMenu() before calling this.appendMenu().");
    }
  }
};
