
function $(selector) {
  return document.querySelectorAll(selector);
}


function ready(fn) {
  if (document.readyState != 'loading') {
    fn();

  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}


function forEachNode(nodeList, callback) {
  var nodeListLength = nodeList.length;
  for (var i = 0; i < nodeListLength; i++) {
    callback(nodeList[i]);
  }
}


function attr(el, name, val) {
  if (val) {
    el.setAttribute(name, val);

  } else {
    return el.getAttribute(name);
  }
}


function toggleAttr (el, name) {
  attr(el, name, attr(el, name) === "false" ? "true" : "false");
}


function toggleClass (el, className, value) {
  if (value) {
    el.classList += " " + className;
    
  } else if (!value && value != null) {
    var regEx = new RegExp("/\b" + className + "\b/", "g");
    el.className = el.className.replace(regEx, '');
  
  } else {
    el.classList.toggle(className);
  }
}


function getPosition (el) {
  var xPos = 0,
      yPos = 0,
      height = el.offsetHeight,
      width = el.offsetWidth;

  while (el) {
    if (el.tagName === "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;

      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }

    el = el.offsetParent;
  }

  return {
    left: xPos,
    right: xPos + width,
    top: yPos,
    bottom: yPos + height,
    height: height,
    width: width
  };
}


function getOffsetLeft (elem) {
  var offsetLeft = 0;
  do {
    if (!isNaN(elem.offsetLeft)) {
      offsetLeft += elem.offsetLeft;
    }
  } while(elem = elem.offsetParent);

  return offsetLeft;
}


function getOffsetTop (el) {
  var offsetTop = 0;
  do {
    if (!isNaN(el.offsetTop)) {
      offsetTop += el.offsetTop;
    }
  } while (el = el.offsetParent);

  return offsetTop;
}



function getScrollTop() {
  if (typeof pageYOffset != 'undefined') {
    // Most browsers except IE before v9
    return pageYOffset;

  } else {
    var body = document.body, //IE 'quirks'
        doc  = document.documentElement; //IE with doctype

    doc = (doc.clientHeight) ? doc : b;
    return doc.scrollTop;
  }
}


// Toggles page scrolling on and off
function toggleScroll () {
  var body = $("body")[0];

  // If scrolling is enabled
  //   -> do stuff
  if (body.style.overflowY != "hidden") {
    body.style.overflowY = "hidden";
    
    // Mobile Safari
    document.ontouchmove = function (e) { e.preventDefault(); }

  } else {
    body.style.overflowY = "scroll";

    // Mobile Safari
    document.ontouchmove = function (e) { return true; }
  }
}


function toggleBlur () {
  toggleAttr($("[js-blur]")[0], "js-blur");
}


// el: element to associate the handler with.
// type: Event type (e.g. click, scroll).
// handler: Function to call, passed the event
function delegateEvent (eventType, selector, handler) {
  document.addEventListener(eventType, function (e) {
    e = e || window.event;

    var target   = e.target || e.srcElement,
        nodeList = $(selector);

    forEachNode (nodeList, function (node) {
      if (target === node) {
        handler(e, node);
      }
    });
  });
}


function debounce (func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;

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


function throttle (fn, threshhold, scope) {
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


function URLEncode (str) {
  return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}


function isMobile () {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
}

var isAndroid = function() {
  return navigator.userAgent.match('Android');
}

var isIOS = function() {
  if (/iPad|iPhone|iPod/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
}

