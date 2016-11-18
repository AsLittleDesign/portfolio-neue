
var global = {
  store: {
    userAgent: navigator.userAgent,
    isMobile: null,
    isAndroid: null,
    isIOS: null,
    isIE: null
  },

  ready: function (fn) {
    if (document.readyState != 'loading') {
      fn();

    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  },


  toggleScrolling: function (value) {
    var body = $("body");

    if (value === true) {
      body.css("overflow-y", "auto");
      document.ontouchmove = function (e) { return true; }

    } else if (value === false) {
      body.css("overflow-y", "hidden");
      document.ontouchmove = function (e) { e.preventDefault(); }

    } else {
      // If scrolling is enabled
      //   -> do stuff
      if (body.css("overflow-y") != "hidden") {
        body.css("overflow-y", "hidden");
        
        // Mobile Safari
        document.ontouchmove = function (e) { e.preventDefault(); }

      } else {
        body.css("overflow-y", "auto");

        // Mobile Safari
        document.ontouchmove = function (e) { return true; }
      }
    }
  },


  toggleBlur: function (value) {
    var el = $("[js-blur]");

    if (value != null) {
      el.attr("js-blur", String(value));

    } else {
      if (el.css("will-change")) {
        el.css("will-change", "");

      } else {
        el.css("will-change", "filter");
      }

      el.toggleAttr("js-blur");
    }
  },


  getScrollOffsets: function () {
    var doc = document, w = window;
    var x, y, docEl;

    if (typeof w.scrollY != undefined) {
      x = w.scrollX;
      y = w.scrollY;
    
    } else if ( typeof w.pageYOffset === 'number' ) {
      x = w.pageXOffset;
      y = w.pageYOffset;

    } else {
        docEl = (doc.compatMode && doc.compatMode === 'CSS1Compat')?
                doc.documentElement: doc.body;
        x = docEl.scrollLeft;
        y = docEl.scrollTop;
    }

    return {
      x: x,
      y: y
    };
  },
    

  isMobile: function () {
    if (this.store.isMobile != null) {
      return this.store.isMobile;
    }

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.store.userAgent)) {
      return true;
    }
    return false;
  },


  isAndroid: function () {
    if (this.store.isAndroid != null) {
      return this.store.isAndroid;
    }

    return this.store.userAgent.match('Android');
  },


  isIOS: function () {
    if (this.store.isIOS != null) {
      return this.store.isIOS;
    }

    if (/iPad|iPhone|iPod/i.test(this.store.userAgent)) {
      return true;
    }
    return false;
  },


  isIE: function () {
    if (this.store.isIE != null) {
      return this.store.isIE;
    }

    this.store.userAgent.indexOf("MSIE") != -1 ? true : false;
  }
};
