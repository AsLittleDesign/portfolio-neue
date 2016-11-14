
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


function Button (el) {
  this.el = el;
  this.$el = $(el);
}


Button.prototype = {
  state: {
    hover: false
  },


  setState: function (state) {
    var propsChanged = [];

    for (var key in state) {
      this.state[key] = state[key];
      propsChanged.push(key);
    }

    propsChanged.length === 1 ? propsChanged = propsChanged[0] : null;
    
    this.stateChange.propsChanged = propsChanged;
    this.el.dispatchEvent(this.stateChange);
  },


  handleStateChange: function (e) {
    var propsChanged = e.propsChanged;

    var processChange = function (prop) {
      if (prop === "hover") {
        this.onHover();
      }
    }.bind(this);

    if (typeof propsChanged === "string") {
      processChange(propsChanged);

    } else {
      for (var prop in propsChanged) {
        processChange(propsChanged[prop]);
      }
    }
  },


  init: function () {
    this.el.addEventListener("click", this.onClick.bind(this));

    if (!isMobile()) {
      this.prepare();
      
      // State changes
      if (isIE()) {
        this.stateChange = document.createEvent("stateChange");
        this.stateChange.initCustomEvent("stateChange", false, false);
      
      } else {
        this.stateChange = new CustomEvent("stateChange");
      }

      this.el.addEventListener("stateChange", this.handleStateChange.bind(this));
      this.el.addEventListener("mouseover", this.onMouseover.bind(this));
      this.el.addEventListener("mouseleave", this.onMouseleave.bind(this));

      // Prepare ghost again in canse position has changed.
      var timing = window.location.pathname === "/photography" ? 5000 : 500
      setTimeout(function () {
        this.prepare()
      }.bind(this), timing);
    }
  },


  prepare: function () {
    var position = this.$el.getPosition(),
        size = this.$el.size();

    this.ghost = this.ghost || $("<div class='button--ghost'></div>");
    this.ghost.css({
      "top": position.top + "px",
      "left": position.left + "px",
      "width": size.width + "px",
      "height": size.height + "px",
      "background-color": $(this.el).css("background-color")
    });

    if (size.width > 300) {
      this.ghost.addClass("m-wide");
    }

    this.$el.before(this.ghost);
  },


  onHover: function () {
    if (this.state.hover) {
      this.ghost.addClass("s-hover");

    } else {
      this.ghost.removeClass("s-hover");
    }
  },


  onClick: function (e) {
    e.preventDefault();

    var inkSize = 300,
        css = "\
          left: " + (e.offsetX - inkSize / 2) + "px;\
          top: " + (e.offsetY - inkSize / 2) + "px;"

    var ink = [
      "<div class='button--ink-container' style='" + css + "'>",
        "<div class='button--ink'></div>",
      "</div>"
    ].join("\n");

    this.el.insertAdjacentHTML('beforeend', ink);

    setTimeout(function () {
      $(".button--ink-container").remove();
    }, 500);

    var href = this.el.href,
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
  },


  onMouseover: function () {
    this.setState({ hover: true });
  },


  onMouseleave: function (e) {
    this.setState({ hover: false });
  }
}


ready(function () {
  // Removes 300ms delay on mobile whe clicking
  new FastClick(document.body);

  menuData.forEach(function (data) {
    new ActionMenu(data).init();
  });

  $(".button").each(function (node) {
    var button = new Button(node);
    button.init();
  });
});

