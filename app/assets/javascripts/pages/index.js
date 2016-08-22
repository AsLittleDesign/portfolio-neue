
var documentInitialized = false;
document.addEventListener('DOMContentLoaded', function(){
  // quit if this function has already been called
  if (documentInitialized) return;
  documentInitialized = true;

  mousemoveHandler();

  // ScrollBias.init();
});


function mousemoveHandler() {
  var baseFringeElement = $("[js-fringe='base']")[0];
  var fringe = {
    styles: {
      red: $("[js-fringe='red']")[0].style,
      blue: $("[js-fringe='blue']")[0].style
    }
  };
  fringe.position = getPosition(baseFringeElement);

  var parallaxBaseElement = $("[js-parallax='background']")[0];

  var parallax = {
    styles: {
      back: parallaxBaseElement.style,
      mid: $("[js-parallax='midground']")[0].style,
      front: $("[js-parallax='foreground']")[0].style
    }
  };
  parallax.position = getPosition(parallaxBaseElement);

  window.addEventListener("resize", function() {
    calculatePosition();
  });

  window.addEventListener("scroll", function() {
    calculatePosition();
  });

  document.addEventListener("mousemove", function(event) {
    updateEvent(event);

    textFringing(event, fringe);
    photographyParallax(event, parallax);
  }, 100);

  var calculatePosition = debounce(function() {
      fringe.position = getPosition(baseFringeElement);
      parallax.position = getPosition(parallaxBaseElement);
  }, 200);
}


function textFringing(event, props) {
  var distance = {
    x: Math.min(event.pageX - props.position.right / 2,
      event.pageX - (props.position.right - props.position.width / 2) ) / 200,
    y: Math.min(event.pageY - props.position.bottom / 2,
      event.pageY - (props.position.bottom - props.position.height / 2) ) / 200
  };

  props.styles.red.transform = "translate3d(" + distance.x + "px, " + distance.y + "px, 0)";
  props.styles.blue.transform = "translate3d(" + -distance.x + "px, " + -distance.y + "px, 0)";
}


function photographyParallax(event, props) {
  var distance = {
    x: Math.min(event.pageX - props.position.right / 2,
      event.pageX - (props.position.right - props.position.width / 2) ) / 100,
    y: Math.min(event.pageY - props.position.bottom / 2,
      event.pageY - (props.position.bottom - props.position.height / 2) ) / 100
  };

  props.styles.front.transform = "translate3d(" + -distance.x * 5 + "px, " + -distance.y * 5 + "px, 0)";

  props.styles.mid.transform = "matrix3d(" + ((distance.y / 10000) + 1) + ", 0, 1, 0, " + (-distance.x / 200) + ", " + ((-distance.y / 200) + 1) + ", 1, 0, 1, " + (distance.x / 1000) + ", " + ((-distance.x / 100) + 1) + ", 0, 0, 0, 100, 1) translate3d(" + -distance.x / 6 + "px, " + -distance.y / 2 + "px, 0)";

  props.styles.back.transform = "translate3d(" + distance.x / 5 + "px, " + distance.y / 4 + "px, 0)";
}


var ScrollBias = {
  init: function() {
    this.record.current = getScrollTop();
    this.snapPoints = this.getSnapPoints();

    window.addEventListener("scroll", throttle(this.scrollHandler.bind(this), 100));
  },

  threshold : 150,
  snapPoints : [],
  record : {
    current: null,
    last: null
  },


  scrollHandler: function(event) {
    this.updateRecord();
    updateEvent(event, this.record);

    var velocity = this.calcVelocity();
    if (Math.abs(velocity) < 20) {
      this.snapPoints.forEach(function(point) {
        if (Math.abs(this.record.current - point) < this.threshold) {
          this.scrollTo($("body")[0], point, Math.abs(velocity));
        }
      }.bind(this));
    }
  },


  getSnapPoints: function() {
    var snapPoints = [];
    $("[snap-point]").forEach(function(el){
      var boundingRect = el.getBoundingClientRect();
      snapPoints.push(boundingRect.top + getScrollTop());
    });
    return snapPoints;
  },


  updateRecord: function() {
    var newRecord = {
      current: getScrollTop(),
      last: this.record.current
    };

    this.record = newRecord;
  },


  calcVelocity: function() {
    var timer, delta, delay = 5; // in "ms" (higher means lower fidelity )

    newPos = this.record.current;
    lastPos = this.record.last;

    if ( lastPos != null ) { // && newPos < maxScroll
      delta = newPos - lastPos;
    }
    lastPos = newPos;

    return delta;
  },


  scrollTo: function(element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    var animateScroll = function(){
        currentTime += increment;
        var val = easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
  }
};


function updateEvent(event, data) {
  switch(event.type) {
    case "scroll":
      // Add direction, the current, and the last scroll top
      // to event object
      event.data = {};
      event.data.lastScrollY = data.last || 0;
      event.data.currentScrollY = data.current || getScrollTop();

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
      if ( event.pageX == null && event.clientX != null ) {
        var doc = document.documentElement,
            body = document.body;
        event.pageX = event.calientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
      }
      break;
  }
}
