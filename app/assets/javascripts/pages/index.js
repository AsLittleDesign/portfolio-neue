
ready(function () {
  mousemoveHandler();

  $("[js-scroll-down]")[0].addEventListener("click", function () {
    var windowHeight = isIOS() ? (window.innerHeight + 10) : window.innerHeight,
        timing = windowHeight - window.scrollY;

    scrollToY(windowHeight, timing, "easeInOutSine");
  });

  if (!isMobile()) {
    slider();
  }
});


function slider() {
  // Initialize a new plugin instance for element or array of elements.
  var focusSlider = $("[js-slider='focus']")[0],
      exposureSlider = $("[js-slider='exposure']")[0];

  rangeSlider.create(exposureSlider, {
    orientation: "vertical",
    steps: 16,
    rangeClass: "rangeSlider viewfinder--exposure-input",
    onSlide: function (position, value) {
      $("[js-viewfinder-exposure]")[0].style.opacity = value;
    }
  });

  // Create focus slider
  rangeSlider.create(focusSlider, {
    orientation: "horizontal",
    rangeClass: "rangeSlider viewfinder--focus-input",
    onSlide: function (position, value) {
      $("[js-parallax]").each(function (image, i) {
        var blurAmount = Math.abs(value - 0.8),
            focusDepth = value - 0.8 >= 0 ? "far" : "near",
            distanceMod;

        switch (i) {
          case 0:
            distanceMod = focusDepth == "far" ? 10 : 30;
            break;
          case 1:
            distanceMod = 12;
            break;
          case 2:
            distanceMod = focusDepth == "far" ? 30 : 10;
            break;
        }
        
        var blur = blurAmount * distanceMod;

        image.style.filter = "blur(" + blur + "px)";
        image.style.webkitFilter = "blur(" + blur + "px)";
      });
    }
  });
}


function mousemoveHandler() {
  var baseFringeElement = $("[js-fringe='base']")[0],
      fringe = {
        styles: {
          red: $("[js-fringe='red']")[0].style,
          blue: $("[js-fringe='blue']")[0].style
        },
        position: getPosition(baseFringeElement)
      };

  var parallaxBaseElement = $("[js-parallax='background']")[0],
      parallax = {
        styles: {
          back: parallaxBaseElement.style,
          mid: $("[js-parallax='midground']")[0].style,
          front: $("[js-parallax='foreground']")[0].style
        },
        position: getPosition(parallaxBaseElement)
      };

  window.addEventListener("resize", function () {
    calculatePosition();
  }, true);

  window.addEventListener("scroll", throttle(function () {
    calculatePosition();
  }, 150), true);

  window.addEventListener("mousemove", function (e) {
    updateEvent(e);
    textFringing(e, fringe);
    photographyParallax(e, parallax);
  });

  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function (e) {
      textFringing(e, fringe);
      photographyParallax(e, parallax);
    }, true);
  }

  var calculatePosition = debounce(function() {
      fringe.position = getPosition(baseFringeElement);
      parallax.position = getPosition(parallaxBaseElement);
  }, 200);
}


function textFringing(event, props) {
  var distanceX, distanceY;

  if (event.type == "deviceorientation") {
    if (window.innerWidth > window.innerHeight) {
      distanceX = -event.beta / 15,
      distanceY = -event.gamma / 15;

    } else {
      distanceX = -event.gamma / 10,
      distanceY = -(event.beta - 90) / 10;
    }

  } else {
    var pageX = event.pageX,
        pageY = event.pageY;

    distanceX = Math.min(pageX - props.position.right / 2, pageX - (props.position.right - props.position.width / 2) ) / 150,
    distanceY = Math.min(pageY - props.position.bottom / 2, pageY - (props.position.bottom - props.position.height / 2) ) / 150;
  }

  props.styles.red.transform = "translate3d(" + distanceX + "px, " + distanceY + "px, 0)";
  props.styles.blue.transform = "translate3d(" + -distanceX + "px, " + -distanceY + "px, 0)";
}


function photographyParallax(event, props) {
  var distanceX, distanceY;

  if (event.type == "deviceorientation") {
    if (window.innerWidth > window.innerHeight) {
      distanceX = event.beta / 10,
      distanceY = -event.gamma / 10;

    } else {
      distanceX = -event.gamma / 20,
      distanceY = -event.beta / 20;
    }

  } else {
    var pageX = event.pageX,
        pageY = event.pageY,
        positionBottom = props.position.bottom,
        positionRight = props.position.right;

    distanceX = Math.min(pageX - positionRight / 2, pageX - (positionRight - props.position.width / 2) ) / 100,
    distanceY = Math.min(pageY - positionBottom / 2, pageY - (positionBottom - props.position.height / 2) ) / 100;
  }

  props.styles.front.transform = "translate3d(" + -distanceX * 4 + "px, " + -distanceY * 3 + "px, 0)";

  props.styles.mid.transform = "matrix3d(" + ((distanceY / 10000) + 1) + ", 0, 1, 0, " + (-distanceX / 200) + ", " + ((-distanceY / 200) + 1) + ", 1, 0, 1, " + (distanceX / 1000) + ", " + ((-distanceX / 100) + 1) + ", 0, 0, 0, 100, 1) translate3d(" + -distanceX / 6 + "px, " + -distanceY / 2 + "px, 0)";

  props.styles.back.transform = "translate3d(" + distanceX / 5 + "px, " + distanceY / 4 + "px, 0)";
}


function updateEvent(event, data) {
  switch(event.type) {
    case "scroll":
      // Add direction, the current, and the last scroll top
      // to event object
      event.data = {};
      event.data.lastScrollY = data.last || 0;
      event.data.currentScrollY = data.current || getScrollOffsets().y;

      if (data.current > data.last) {
        event.data.direction = "down";
      } else if (data.current < data.last) {
        event.data.direction = "up";
      } else {
        event.data.direction = "none";
      }
      break;

    case "mousemove":
      // Add pageX, and pageY properties to event object
      if (event.pageX == null && event.clientX != null) {
        var doc = document.documentElement,
            body = document.body;
        event.pageX = event.calientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
      }
      break;
  }
}

// first add raf shim
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         function(callback) {
           window.setTimeout(callback, 1000 / 60);
         };
})();


function scrollToY (scrollTargetY, speed, easing) {
  var scrollY = window.scrollY,
      scrollTargetY = scrollTargetY || 0,
      speed = speed || 2000,
      easing = easing || 'easeOutSine',
      currentTime = 0;

  // Min time .1, max time .8 seconds
  var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

  // Easing equations from https://github.com/danro/easing-js/blob/master/easing.js
  var PI_D2 = Math.PI / 2,
    easingEquations = {
      easeOutSine: function (pos) {
        return Math.sin(pos * (Math.PI / 2));
      },

      easeInOutSine: function (pos) {
        return (-0.5 * (Math.cos(Math.PI * pos) - 1));
      },

      easeInOutQuint: function (pos) {
        if ((pos /= 0.5) < 1) {
          return 0.5 * Math.pow(pos, 5);
        }
        return 0.5 * (Math.pow((pos - 2), 5) + 2);
      }
    };

  // Add animation loop
  function tick () {
    currentTime += 1 / 60;

    var p = currentTime / time;
    var t = easingEquations[easing](p);

    if (p < 1) {
      requestAnimFrame(tick);
      window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));

    } else {
      window.scrollTo(0, scrollTargetY);
    }
  }

  // Call it once to get started
  tick();
}
