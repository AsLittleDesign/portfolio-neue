
//= require fastclick
//= require helpers/global
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
  this.el = $(el);
}


Button.prototype = {
  init: function () {
    this.el.click(this.onClick.bind(this));

    if (!global.isMobile()) {
      this.prepare();
  
      this.el.hover({
        start: this.hoverStart.bind(this),
        end: this.hoverEnd.bind(this)
      });

      window.addEventListener("resize", this.prepare.bind(this));

      // Prepare ghost again in canse position has changed.
      var timing = window.location.pathname === "/photography" ? 5000 : 500
      setTimeout(function () {
        this.prepare()
      }.bind(this), timing);
    }
  },


  prepare: function () {
    var position = this.el.getPosition(),
        size = this.el.size();

    this.ghost = this.ghost || $("<div class='button--ghost'></div>");
    this.ghost.css({
      "top": position.top + "px",
      "left": position.left + "px",
      "width": size.width + "px",
      "height": size.height + "px",
      "background-color": this.el.css("background-color")
    });

    if (size.width > 300) {
      this.ghost.addClass("m-wide");
    }

    this.el.before(this.ghost);
  },


  hoverStart: function () {
    this.ghost.addClass("s-hover");
  },


  hoverEnd: function () {
    this.ghost.removeClass("s-hover");
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

    this.el.append($(ink));

    setTimeout(function () {
      $(".button--ink-container").remove();
    }, 500);

    var href = this.el.attr("href"),
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
}


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


global.ready(function () {
  // Removes 300ms delay on mobile whe clicking
  new FastClick(document.body);

  $(".button").each(function (node) {
    var button = new Button(node).init();
  });

  menuData.forEach(function (data) {
    var toggles = $("[data-menu-toggle=" + data.id + "]");
    if (toggles) {
      toggles.each(function (toggle) {
        new ActionMenu(data, toggle).init();
      });
    }
  });

  $("p a").each(function (node) {
    var text = $(node).text(),
        textNode = $("<span class='link--content'>" + text + "</span>");

    $(node).text("").append(textNode);
  });
});

