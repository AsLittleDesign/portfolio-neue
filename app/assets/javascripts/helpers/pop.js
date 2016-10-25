
var menuData = [
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


function ActionMenu (data) {
  this.data = data;
  this.name = data.id;
}


ActionMenu.prototype = {
  animationLength: 200,
  menuSpacing: 8,
  state: {
    active: false
  },


  // Initialize menus
  init: function () {
    this.createOptions();
    this.createMenu();
    this.append();
    this.start();
  },


  // Create the menu element
  createMenu: function () {
    var menu = document.createElement("div");
    addClass(menu, "menu")
    menu.innerHTML = "<div class='menu--close' data-menu-toggle='" + this.name + "'>Cancel</div>";

    // Append options to menu.
    // Calling reverse() is due to insertBefore reversing the array.
    this.options.reverse().forEach(function (option) {
      menu.insertBefore(option, menu.firstChild);
    });

    this.menu = menu;
  },


  createOptions: function () {
    this.options = [];
    this.data.options.forEach(function (optionData, index) {
      var option = this.createOption(optionData);
      this.options.push(option);
    }.bind(this));
  },


  createOption: function (optionData) {
    // Create link element to be our option.
    var option = document.createElement('a');
    addClass(option, "menu--option");
    
    // Set rel if it's a Twitter button
    if (optionData.id === "twitter") {
      option.setAttribute("rel", "me")
    };

    // Set href and target if it's a link
    if (optionData.href) {
      option.setAttribute("href", optionData.href);
      option.setAttribute("target", "_blank");
    }

    // Append option content
    option.innerHTML = [
      "<span class='menu--symbol icon--" + optionData.symbol + "'></span>",
      "<span class='menu--option-text'>" + optionData.text + "</span>",
    ].join("\n");

    // Add event listener if there is an action
    if (optionData.action) {
      option.addEventListener("click", optionData.action);
    }

    return option;
  },


  append: function () {
    $("[data-menu-wrapper]")[0].appendChild(this.menu);
  },


  getScrollOffsets: function () {
    var doc = document, w = window;
    var x, y, docEl;
    
    if ( typeof w.pageYOffset === 'number' ) {
        x = w.pageXOffset;
        y = w.pageYOffset;
    } else {
        docEl = (doc.compatMode && doc.compatMode === 'CSS1Compat')?
                doc.documentElement: doc.body;
        x = docEl.scrollLeft;
        y = docEl.scrollTop;
    }
    return {x:x, y:y};
  },


  getPosition: function (element) {
    var scrollOffset = this.getScrollOffsets(),
        left = 0,
        top = 0,
        props;
    
    if (element.getBoundingClientRect) {
      props = element.getBoundingClientRect();
      left = props.left + scrollOffset.x;
      top = props.top + scrollOffset.y;

    } else { // for older browsers
      do {
        left += element.offsetLeft;
        top += element.offsetTop;
      } while ( (el = el.offsetParent) );
    }

    return {
      top: top,
      bottom: top + element.offsetHeight,
      left: left,
      right: left + element.offsetWidth,
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  },


  checkPosition: function (toggle) {
    var menuSize = {
          width: this.menu.offsetWidth,
          height: this.menu.offsetHeight
        },
        togglePos = this.getPosition(toggle),
        posX, posY;

    if (togglePos.right - menuSize.width - this.menuSpacing < 0) {
      posX = "right";
    
    } else {
      posX = "left";
    }

    if (togglePos.bottom + menuSize.height + this.menuSpacing > window.innerHeight + window.scrollY) {
      posY = "top";
    
    } else {
      posY = "bottom";
    }

    return {
      x: posX,
      y: posY
    };
  },
  

  setStyle: function (toggle) {
    var togglePos = this.getPosition(toggle),
        menuPos = this.checkPosition(toggle),
        originX, originY, top, left, translateDist;

    if (menuPos.x === "left") {
      originX = "right";
      left = togglePos.right - this.menu.offsetWidth;
    
    } else {
      originX = "left";
      left = togglePos.left;
    }

    if (menuPos.y === "bottom") {
      originY = "top";
      top = togglePos.top;
      translateDist = togglePos.height + this.menuSpacing;

    } else {
      originY = "bottom";
      top = togglePos.bottom - this.menu.offsetHeight; 
      translateDist = -this.menuSpacing - togglePos.height;
    }

    menuStyle = "\
      top: " + top + "px;\
      left: " + left + "px;\
      opacity: 1;\
      pointer-events: initial;\
      transform: translate3d(0," + translateDist + "px, 0) scale(1);\
      transform-origin: " + originX + " " + originY + ";\
      -ms-transform-origin: " + originX + " " + originY + ";\
      -webkit-transform-origin: " + originX + " " + originY + ";\
      -moz-transform-origin: " + originX + " " + originY + ";"

    this.menu.setAttribute("style", menuStyle);

    if (originX === "right") {
      addClass(this.menu, "m-right");
    }
  },


  cloneToggle: function (toggle) {
    this.clone = toggle.cloneNode(true);
    var togglePos = this.getPosition(toggle),
        cloneStyle = "\
        top: " + togglePos.top + "px;\
        left: " + togglePos.left + "px;\
        position: absolute;\
        width: " + togglePos.width + "px;\
        height: " + togglePos.height + "px;"

    this.clone.setAttribute("style", cloneStyle);
    $("[data-menu-wrapper]")[0].appendChild(this.clone);
    
    addClass(this.clone, "menu-toggle-clone");

    toggle.style.opacity = 0;
  },


  // Return menu to fully hidden state
  reset: function () {
    this.menu.setAttribute("style", "");
    removeClass(this.menu, "m-right")

    if (this.clone) {
      this.clone.remove();
    }
  },


  open: function (toggle) {
    this.reset();
    addClass($("[data-menu-background]")[0], "s-active");
    $("[data-menu-background]")[0].setAttribute("data-menu-toggle", this.name);

    this.toggle = toggle;
    this.cloneToggle(toggle);
    this.setStyle(toggle);
    toggleScroll(false);
    toggleBlur(true);
  },


  close: function () {
    removeClass($("[data-menu-background]")[0], "s-active");
    $("[data-menu-background]")[0].removeEventListener("click", this.backgroundClose);

    if (!this.state.active) {
      removeClass(this.clone, "menu-toggle-clone");
    }

    toggleScroll(true);
    toggleBlur(false);

    this.menu.style.transform = "translate3d(0, 0, 0) scale(0.1)";
    this.menu.style.opacity = 0;

    setTimeout(function () {
      this.toggle.style.opacity = ""
      this.toggle = null;

      this.clone.remove();
      this.clone = null;

      this.reset();
    }.bind(this), this.animationLength)
  },


  start: function () {
    delegateEvent("click", "[data-menu-toggle=" + this.name + "]", function (e, toggle) {
      this.state.active = !this.state.active;

      if (this.state.active) {
        this.open(toggle);
      
      } else {
        this.close();
      }
    }.bind(this));
  }
}
