
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


function forEachNode(nodeList, callback, scope) {
  for (var i = 0; i < nodeList.length; i++) {
    callback.call(scope, i, nodeList[i]);
  }
}


function attr(el, attr, val) {
  if (val) {
    return el.setAttribute(attr, val);
  } else {
    return el.getAttribute(attr);
  }
}


function getPosition(el) {
  var xPos = 0;
  var yPos = 0;
  var height = el.offsetHeight;
  var width = el.offsetWidth;

  while (el) {
    if (el.tagName == "BODY") {
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


function getScrollTop() {
  if (typeof pageYOffset!= 'undefined') {
    //most browsers except IE before #9
    return pageYOffset;
  } else {
    var B = document.body; //IE 'quirks'
    var D = document.documentElement; //IE with doctype
    D = (D.clientHeight) ? D : B;
    return D.scrollTop;
  }
}
