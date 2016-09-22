
var menus = [
  { id: "follow",
    options: [
      { id: "facebook",
        text: "Like on Facebook",
        href: "https://www.facebook.com/aslittledesign/",
        symbol: "facebook"
      },

      { id: "twitter",
        text: "Follow on Twitter",
        href: "https://twitter.com/intent/follow?user_id=1605103807",
        symbol: "twitter"
      },

      { id: "instagram",
        text: "Follow on Instagram",
        href: "https://www.instagram.com/aslittledesign",
        symbol: "instagram"
      },

      { id: "linkedin",
        text: "Connect on LinkedIn",
        href: "https://www.linkedin.com/in/davesmccarthy",
        symbol: "linkedin"
      }
    ]
  },

  { id: "share",
    options: [
      { id: "facebook",
        text: "Share on Facebook",
        action: function () {
          FB.ui({
            method: 'share',
            href: window.location.href,
            hashtag: "#AsLittleDesign"
          }, function(response){});
        },
        symbol: "facebook"
      },

      { id: "twitter",
        text: "Share on Twitter",
        href: "https://twitter.com/intent/tweet?url=" + URLEncode(window.location.href)  + "&via=AsLittleDesign",
        symbol: "twitter"
      },

      { id: "linkedin",
        text: "Share on LinkedIn",
        action: function () {
          window.open("https://www.linkedin.com/shareArticle?url=" + URLEncode(window.location.href)  + "&source=" + URLEncode("http://davesmccarthy.com/"), "newwindow", "width=520, height=570");
        },
        symbol: "linkedin"
      }
    ]
  },

  { id: "contact",
    options: [
      { id: "facebook",
        text: "Facebook Messenger",
        href: "http://m.me/aslittledesign",
        symbol: "facebook"
      },

      { id: "email",
        text: "Email",
        href: "mailto:dave@aslittledesign.com",
        symbol: "mail"
      }
    ]
  }
];


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
      this.toggleMenu(e);
    }.bind(this));
  },


  toggleMenu: function (e) {
    var menu = $("[js-pop--menu='" + this.data.id + "']")[0],
        active;
    
    // Toggle page-wide changes for modal behavior.
    toggleScroll();
    toggleBlur();

    toggleClass($("[js-pop--background]")[0], "s-active");

    menu.style.display = "";

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
      // Set background to toggle menu
      $("[js-pop--background]")[0].setAttribute("js-pop--toggle", this.data.id);

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

      if (originX === "right") {
        toggleClass(menu, "m-right", true);
      }

      // Set into motion the animation
      toggleClass(menu, "s-active");
      if (originY === "top") {
        menu.style.transform = "translateY(" + (togglePos.height + 10) + "px) scale(1)";
      } else {
        menu.style.transform = "translateY(" + -(togglePos.height - 10) + "px) scale(1)";
      }

    // Remove cloned toggle if the menu is currently active
    } else {
      // Remove background toggling the menu
      $("[js-pop--background]")[0].removeAttribute("js-pop--toggle");

      menu.style.transform = "";
      setTimeout(function () {
        toggleClass(menu, "s-active");
        toggleClass(this.clone, "s-active");
        toggleClass(menu, "m-right", false);

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
      }.bind(this), 100);
    }

    this.active = !active;
  },


  createMenu: function () {
    // Create options HTML
    var options = [];
    this.data.options.forEach(function(option) {
      var attributes,
          elType = "a";
      
      if (option.href) {
        attributes = "href='" + option.href + "' target='_blank'";
      }

      // debugger
      var optionEl = [
        "<" + elType +" class='menu--option' js-pop--option='" + this.data.id + "-" + option.id + "' " + attributes + ">",
          "<span class='menu--symbol icon--" + option.symbol + "'></span>",
          "<span class='menu--option-text'>" + option.text + "</span>",
        "</" + elType + ">"
      ].join("\n");

      options.push(optionEl);
    }.bind(this));

    // Create menu HTML
    var element = [
      "<div class='menu' style='display: none;' js-pop--menu='" + this.data.id + "'>",
        options,
        "<div class='menu--close' js-pop--toggle='" + this.data.id + "'>Cancel</div>",
      "</div>"
    ];

    // Flatten array
    element = [].concat.apply([], element).join("\n");
    this.html = element;

    this.data.options.forEach(function (option) {
      if (option.action) {
        delegateEvent("click", "[js-pop--option='" + this.data.id + "-" + option.id + "']", option.action);
      }
    }.bind(this));
  },


  appendMenu: function () {
    if (this.html) {
      $("[js-pop--wrapper]")[0].insertAdjacentHTML('beforeend', this.html);

    } else {
      console.error("this.html is undefined. Be sure to call this.createMenu() before calling this.appendMenu().");
    }
  }
};
