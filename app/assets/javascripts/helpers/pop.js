
// TODO:
// - Move to fixed position elements.

function ActionMenu (data, toggle) {
  this.data   = data;
  this.name   = data.id;
  this.toggle = $(toggle);
}


ActionMenu.prototype = {
  animationLength: 200,
  menuSpacing: 8,
  state: {
    active: false
  },


  // Initialize menus
  init: function () {
    this.createMenu();
    this.cloneToggle();
    this.createBackground();
    this.start();
  },


  // Create the menu element
  createMenu: function () {
    menu = $("<div class='menu'></div>");

    menu.append($("<div class='menu--close'>Cancel</div>").click(this.toggleMenu.bind(this)));
    options = this.createOptions();

    // Append options to menu.
    // Calling reverse() is due to insertBefore reversing the array.
    options.forEach(function (option) {
      menu.prepend(option);
    });

    this.menu = menu;
    $("[data-menu-wrapper]").append(this.menu);
  },


  createOptions: function () {
    options = [];
    this.data.options.forEach(function (data, index) {
      options.push(this.createOption(data));
    }.bind(this));

    return options;
  },


  createOption: function (data) {
    var attributes;
    
    if (data.id === "twitter") {
      attributes += " " + "rel='me'";
    }

    if (data.href) {
      attributes += " " + "href='" + data.href + "' target='_blank'"
    }

    var option = $("<a class='menu--option'" + attributes + ">\
                      <span class='menu--symbol icon--" + data.symbol + "'></span>\
                      <span class='menu--option-text'>" + data.text + "</span>\
                    </a>");
    
    // Add event listener if there is an action
    if (data.action) {
      option.click(data.action);
    }

    return option;
  },


  createBackground: function () {
    this.background = $("<div class='pop--background'></div>").click(this.toggleMenu.bind(this));
    $("[data-menu-wrapper]").prepend(this.background);
  },


  checkPosition: function () {
    var menuSize = this.menu.size(),
        togglePos = this.toggle.getPosition(),
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
  

  setStyle: function () {
    var togglePos = this.toggle.getPosition(),
        toggleSize = this.toggle.size(),
        menuPos = this.checkPosition(),
        originX, originY, top, left, translateDist;

    if (menuPos.x === "left") {
      originX = "right";
      left = togglePos.right - this.menu[0].offsetWidth;
    
    } else {
      originX = "left";
      left = togglePos.left;
    }

    if (menuPos.y === "bottom") {
      originY = "top";
      top = togglePos.top;
      translateDist = toggleSize.height + this.menuSpacing;

    } else {
      originY = "bottom";
      top = togglePos.bottom - this.menu[0].offsetHeight;
      translateDist = -this.menuSpacing - toggleSize.height;
    }

    this.menu.css({
      "top": top + "px",
      "left": left + "px",
      "opacity": 1,
      "pointer-events": "initial",
      "transform": "translate3d(0," + translateDist + "px, 0) scale(1)",
      "transform-origin": originX + " " + originY,
      "-ms-transform-origin": originX + " " + originY,
      "-webkit-transform-origin": originX + " " + originY,
      "-moz-transform-origin": originX + " " + originY,
      "z-index": 1
    });

    if (originX === "right") {
      this.menu.addClass("m-right");
    }
  },


  positionClone: function () {
    var togglePos = this.toggle.getPosition(),
        toggleSize = this.toggle.size();

    this.clone.css({
      "top": togglePos.top + "px",
      "left": togglePos.left + "px",
      "position": "absolute",
      "width": toggleSize.width + "px",
      "height": toggleSize.height + "px",
      "margin-left": 0,
      "z-index": 1
    })
  },


  cloneToggle: function () {
    this.clone = $(this.toggle[0].cloneNode(true));
    this.clone.addClass("menu-toggle-clone").click(this.toggleMenu.bind(this))

    var timing = window.location.pathname === "/photography" ? 5000 : 500;

    // Fix position after page render
    setTimeout(function () {
      this.positionClone();
    }.bind(this), timing);

    $("[data-menu-wrapper]").append(this.clone);
  },


  // Return menu to fully hidden state
  reset: function () {
    this.menu.attr("style", "").removeClass("m-right");
  },


  open: function () {
    this.reset();

    this.background.addClass("s-active");

    this.toggle.css("opacity", 0);
    this.clone.addClass("s-active");

    this.setStyle();
    global.toggleScrolling(false);
    global.toggleBlur(true);
  },


  close: function () {
    this.background.removeClass("s-active");

    global.toggleScrolling(true);
    global.toggleBlur(false);

    this.menu.css({
      "transform": "translate3d(0, 0, 0) scale(0.1)",
      "opacity": 0
    });

    setTimeout(function () {
      this.clone.removeClass("s-active");
      this.toggle.css("opacity", "");

      this.reset();
    }.bind(this), this.animationLength)
  },


  toggleMenu: function () {
    this.state.active = !this.state.active;

    if (this.state.active) {
      this.open();
    
    } else {
      this.close();
    }
  },


  start: function () {
    this.toggle.click(this.toggleMenu.bind(this));

    // Handle window resize
    window.addEventListener("resize", function () {
      this.positionClone();
    }.bind(this));
  }
}
