
// el: element to associate the handler with.
// type: Event type (e.g. click, scroll).
// handler: Function to call, passed the event
function delegateEvent (eventType, selector, handler) {
  document.addEventListener(eventType, function (e) {
    e = e || window.event;

    var target   = e.target || e.srcElement;

    $(selector).each(function (node) {
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


// ======
// ======
// String methods

String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}


function camelize(str) {
  // Remove preceding hyphen if one exists
  if (str.charAt(0) === "-") {
    str = str.replace(/-/, "");
  }

  // Remove hyphens and spaces
  str = str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  }).replace(/-/g,"");

  return str; 
}


function decamelize (string) {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}


// ======
// ======
// DomJS (IntentJS?)


// Instantiates new DomJS nodelist with string, selector, or node
function $ (selector) {
  if (typeof selector == "string") {
    // HTML string
    if (selector.charAt(0) === "<") {
      var temp = document.createElement("div");
      temp.innerHTML = selector;

      if (temp.childNodes[0]) {
        return new DomJS(temp.childNodes);
      }

    // Selector
    } else {
      var nodeList = document.querySelectorAll(selector);

      if (nodeList[0]) {
        return new DomJS(nodeList);
      }
    }
  
  // DomJS instance
  } else if (selector instanceof DomJS) {
    if (selector[0]) {
      return selector;
    }
  
  // Node
  } else {
    if (selector) {
      return new DomJS(selector);
    }
  }
}


function DomJS (nodeList) {
  if (nodeList.length) {
    this.length = nodeList.length;

    for (var i = 0; i < this.length; i++) {
      this[i] = nodeList[i];
    }
  
  } else {
    this.length = 1;
    this[0] = nodeList;
  }
}


DomJS.prototype = {
  // each( callback(node, i) )
  each: function (callback) {
    if (!callback) {
      console.error("Callback missing. each() takes an anonymous function as an argument.")
    }

    for (var i = 0; i < this.length; i++) {
      callback(this[i], i);
    }
  },


  children: function () {
    var children = [];

    this.each(function (node) {
      var nodeChildren = Array.prototype.slice.call(node.children);
      nodeChildren.forEach(function (node) {
        children.push(node);  
      });
    });

    return $(children);
  },


  // hasClass( className )
  // returns boolean
  hasClass: function (name) {
    var containsClass = false;

    this.each(function (node) {
      if (node.classList && node.classList.contains(name)) {
        containsClass = true;

      } else if (!!node.className.match(new RegExp('(\\s|^)' + name + '(\\s|$)'))) {
        containsClass = true;
      }
    });

    return containsClass;
  },


  // addClass( className )
  // returns context
  addClass: function (name) {
    this.each(function (node) {
      if (node.classList) {
        node.classList.add(name);
      
      } else if (!this.hasClass(name)) {
        node.className += " " + name;
      }
    });

    return this;
  },


  // removeClass( className )
  // returns context
  removeClass: function (name) {
    this.each(function (node) {
      if (node.classList) {
        node.classList.remove(name);
      
      } else if (this.hasClass(name)) {
        var reg = new RegExp('(\\s|^)' + name + '(\\s|$)');
        node.className = node.className.replace(reg, ' ');
      }
    });

    return this;
  },


  // toggleClass( className )
  // returns context
  toggleClass: function (name) {
    if (this.hasClass(name)) {
      this.removeClass(name);
    
    } else {
      this.addClass(name);
    }

    return this;
  },


  // text( textValue )
  // returns context || value
  text: function (value) {
    if (value) {
      this.each(function (node) {
        node.textContent = value;
      });

      return this;
    
    } else {
      return this[0].textContent;
    }
  },


  // css( (obj || string), value )
  // returns context || value
  css: function (arg1, arg2) {
    if (arg1 && arg2 == null) {
      // arg1 is a property name
      if (typeof arg1 === "string") {
        return window.getComputedStyle(this[0], null).getPropertyValue(decamelize(arg1));
      
      // arg1 is object with CSS properties
      } else if (typeof arg1 === "object" && !arg1.length) {
        this.each(function (node) {
          var style = node.style;

          for (var property in arg1) {
            style[camelize(property)] = arg1[property];
          }

        });

        return this;
        
      } else {
        console.error("The argument provided to css() is invalid.")
      }
    
    } else if (arg1 && arg2 != null) {
      this.each(function (node) {
        node.style[camelize(arg1)] = arg2;
      });

      return this;

    } else {
      return window.getComputedStyle(this[0], null);
    }
    
  },


  // attr( attributeName, value )
  // returns context || value
  attr: function (name, value) {
    if (value || value === "") {
      this.each(function (node) {
        node.setAttribute(name, value);
      });

      return this;
    
    } else {
      return this[0].getAttribute(name);
    }
  },

  
  // toggleAttr( attributeName )
  // returns context
  toggleAttr: function (name) {
    var value = this.attr(name);

    if (value == "true") {
      this.attr(name, "false");
    
    } else if (value == "false") {
      this.attr(name, "true");

    } else {
      console.error("toggleAttr() only works with boolean attribute values. Use attr() for a more flexible way to change an attribute.")
    }

    return this;
  },


  // append( node )
  // returns context
  append: function (selector) {
    selector = $(selector);

    this.each(function (node) {
      node.appendChild(selector[0]);
    });

    return this;
  },


  // prepend( node )
  // returns context
  prepend: function (selector) {
    selector = $(selector);

    this.each(function (node) {
      node.insertBefore(selector[0], node.firstChild);
    });

    return this;
  },


  // before( node )
  // returns context
  before: function (selector) {
    selector = $(selector);

    this.each(function (node) {
      var parent = node.parentElement;
      parent.insertBefore(selector[0], parent.firstChild);
    });

    return this;
  },


  // after( node )
  // returns context
  after: function (selector) {
    selector = $(selector);

    this.each(function (node) {
      var parent = node.parentElement;
      parent.insertBefore(selector[0], node.nextSibling);
    });

    return this;
  },


  getPosition: function () {
    var scrollOffset = global.getScrollOffsets(),
        element = this[0],
        left = 0,
        top = 0,
        props;
    
    if (element.getBoundingClientRect) {
      props = element.getBoundingClientRect();
      left = Math.round(props.left) + Math.round(scrollOffset.x);
      top = Math.round(props.top) + Math.round(scrollOffset.y);

    } else { // for older browsers
      do {
        left += element.offsetLeft;
        top += element.offsetTop;
      } while ( (el = el.offsetParent) );
    }

    return {
      top: top,
      bottom: top + this.height(),
      left: left,
      right: left + this.width()
    };
  },


  size: function () {
    return {
      width: this.width(),
      height: this.height()
    }
  },


  width: function () {
    return this[0].offsetWidth;
  },


  height: function () {
    return this[0].offsetHeight;
  },


  // Accepts callback or object
  // obj = {clickStart: function(e, node), clickEnd: function(e, node)}
  click: function (arg) {
    // If object was passed to click()
    if (typeof arg === "object") {
      var pointerPrefix = 'onmspointerdown' in window ? 'ms' : '';

      // If object contains handler for clickStart
      if (arg.clickStart) {
        // Handle all input methods
        if ("on" + pointerPrefix + "pointerdown" in window) {
          this.each(function (node) {
            node.addEventListener(pointerPrefix + "pointerdown", function (e) {
              arg.clickStart(e, node);
            });
          });

        } else {
          this.each(function (node) {
            node.addEventListener("mousedown", function (e) {
              arg.clickStart(e, node);
            });
          });

          if ('ontouchstart' in window) {
            this.each(function (node) {
              node.addEventListener("touchstart", function (e) {
                arg.clickStart(e, node);
              });
            });
          }
        }
      }

      if (arg.clickEnd) {
        // Handle all input methods
        if ("on" + pointerPrefix + "pointerdown" in window) {
          this.each(function (node) {
            node.addEventListener(pointerPrefix + "pointerup", function (e) {
              arg.clickEnd(e, node);
            });
          });

        } else {
          this.each(function (node) {
            node.addEventListener("mouseup", function (e) {
              arg.clickEnd(e, node);
            });
          });

          if ('ontouchstart' in window) {
            this.each(function (node) {
              node.addEventListener("touchend", function (e) {
                arg.clickEnd(e, node);
              });
            });
          }
        }
      }

    } else {
      this.each(function (node) {
        var event = node.addEventListener("click", function (e) {
          arg(e, node);
        });
      });
    }

    return this;
  },


  // Binds event listeners
  on: function (eventType, callback) {
    this.each(function (node) {
      node.addEventListener(eventType, function (e) {
        callback(e, node);
      });
    });
  },

  
  // Accepts callback or object
  // obj = start: function (e, node), end: function (e, node)
  hover: function (arg) {
    if (!global.isMobile()) {
      this.each(function (node) {
        if (arg.start) {
          node.addEventListener("mouseover", function (e) {
            arg.start(e, node);
          });

          if (arg.end) {
            node.addEventListener("mouseout", function (e) {
              arg.end(e, node);
            });
          }

        } else {
          node.addEventListener("mouseover", function (e) {
            arg(e, node);
          });
        }
      });
    }

    return this;
  },


  // remove()
  remove: function () {
    this.each(function (node) {
      node.parentNode.removeChild(node);
    });
  }
}
