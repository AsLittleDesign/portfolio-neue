
ready(function () {
  PositionImages.init();
});

PositionImages = {
  // An array of basic metadata for each image.
  imageMetadata: [],

  // An array of info for each image.
  images: [],

  imagesReady: function() {
    var ready = true;

    if (this.imageMetadata.length !== this.images.length) {
      ready = false;
    }

    this.images.forEach(function(image) {
      if (!image) {
        ready = false;
      }
    });

    return ready;
  },


  // Event when the images array changes triggered by this.setImageData().
  imagesChangedEvent: new Event("imagesChanged"),

  // Sets data for this.images[imageData] if provided an index,
  // Or sets data for this.images if not provided an index.
  addImageData: function(imageData) {
    if (imageData && typeof imageData == "object") {
      this.images.push(imageData);
      window.dispatchEvent(this.imagesChangedEvent);

    } else {
      console.error("setImageData() must be given an object to add an image. Please check your use of this.setImageData.");
    }
  },


  // An array of sizes.
  sizes: [],

  // Matrix of image positions.
  positionMatrix: [],

  // Records the size groups of the last 4 images.
  sizeHistory: [],

  // Total height of all elements.
  totalHeight: 0,

  resetTotalHeight: function() {
    this.totalHeight = 0;
  },

  updateTotalHeight: function(newHeight) {
    this.totalHeight += newHeight + this.getSpacing() / 2;

    document.getElementById("photos").style.height = this.totalHeight + "px";
  },

  // Spacing == 1rem
  getSpacing: function() {
    if (isMobile() || (this.windowInfo && this.windowInfo.width < 768) || window.innerWidth < 768) {
      return 0;
    }
    
    return parseFloat(getComputedStyle($("body")[0]).fontSize) / 2;
  },

  // Information on the window size, and the container
  // for the images.
  windowInfo: null,

  // Get and store integral window sizing info.
  updateWindowInfo: function() {
    this.windowInfo = this.getWindowInfo();
  },


  defaultPosition: [false, false, false, false, false, false],

  init: function() {
    this.updateWindowInfo();
    this.getImageMetadata();
    this.generatePositionMatrix();
    this.renderImages();

    window.onresize = this.handleResize.bind(this);
  },


  handleResize: function() {
    this.updateWindowInfo();
    this.resetTotalHeight();

    this.images.forEach(function(img, index) {
      if (img.el) {
        img.el = this.setImagePosition(img, img.el, index);
        this.setTitlePosition(img.el.children[0], index);
        img.calculatedSize = this.getImageSize(img, index);
      }

      if (this.windowInfo.width > 768) {
        var newHeight = isMobile() ? img.calculatedSize.height + 2 : img.calculatedSize.height;
        this.updateTotalHeight(newHeight);
      }

      this.images[index] = img;
    }.bind(this));
  },


  // Gets basic image metadata from the DOM and adds it to
  // the this.imageMetadata array.
  getImageMetadata: function() {
    var infoElement = $("[js-photo-info]")[0];
    var imageElements = Array.prototype.slice.call(infoElement.children);

    imageElements.forEach(function(element) {
      var metadata = {};
      var elements = Array.prototype.slice.call(element.children);

      elements.forEach(function(element){
        var dataType = element.getAttribute("js-info");
        metadata[dataType] = element.textContent;
      });

      this.imageMetadata.push(metadata);
    }.bind(this));
  },


  // Creates a matrix of positions for images to
  // be placed in.
  generatePositionMatrix: function() {
    for (var i = 0; i <= this.imageMetadata.length - 1; i++) {
      // Get size group.
      var sizeGroup = this.getSizeGroup(i);

      // Update history and size array
      this.sizes.push(sizeGroup);
      this.sizeHistory.unshift(sizeGroup);
      if (this.sizeHistory.length > 5) {
        this.sizeHistory.pop();
      }

      // Generate position array.
      this.positionMatrix.push(this.calcPosition(i));
    }
  },


  // Returns an array for positioning an image.
  // Assumes sizeGroup is valid for available slots.
  calcPosition: function(index) {
    var lastPosition = this.positionMatrix.length ? this.positionMatrix[index - 1] : this.defaultPosition,
        slotReq      = this.getSlotReq(this.sizes[index]),
        prevSelected = this.getSelected(lastPosition),
        positions    = [];

    // If there is a previously selected position...
    if (prevSelected.length) {
      var firstSelectedIndex = prevSelected[0],
          lastSelectedIndex  = prevSelected[prevSelected.length - 1];

      // If there is not a valid position in the first possible slot...
      if (lastPosition[0]) {
        var firstIndex = lastSelectedIndex + 1,
            position   = [];

        for (var i = 0; i <= 5; i++) {
          if (i >= firstIndex && i <= firstIndex + slotReq - 1) {
            position.push(true);

          } else {
            position.push(false);
          }
        }
        positions.push(position);

      // If there is a valid position in the first possible slot...
      } else {
        // If there is a valid position before the previous selected slot...
        if (firstSelectedIndex - 1 >= slotReq - 1  && !lastPosition[firstSelectedIndex - slotReq - 1]) {
          var firstIndex = firstSelectedIndex - slotReq,
              position   = [];

          for (var i = 0; i <= 5; i++) {
            if (i >= firstIndex && i <= firstSelectedIndex - 1) {
              position.push(true);

            } else {
              position.push(false);
            }
          }

          positions.push(position);
        }

        // If there is a valid position after the previous selected slot...
        if (lastSelectedIndex + slotReq <= 5) {
          var firstIndex = lastSelectedIndex + 1,
              position   = [];

          for (var i = 0; i <= 5; i++) {
            if (i >= firstIndex && i <= firstIndex + slotReq - 1) {
              position.push(true);

            } else {
              position.push(false);
            }
          }

          positions.push(position);
        }
      }

    // If there is not a previously selected position.
    } else {
      for (var i = 0; i <= 5; i++) {
        if (i + slotReq - 1 <= 5) {
          var position = [];
          for (var i2 = 0; i2 <= 5; i2++) {
            if (i2 >= i && i2 <= i + slotReq - 1) {
              position.push(true);

            } else {
              position.push(false);
            }
          }

          positions.push(position);
        }
      }
    }

    if (positions.length === 1) {
      return positions[0];

    } else {
      return positions[Math.floor(Math.random() * positions.length)];
    }
  },


  // Gets the size group of the image based on the last calculated image,
  // biased towards more attractive layouts.
  getSizeGroup: function(index) {
    var lastPosition = this.positionMatrix.length ? this.positionMatrix[index - 1] : this.defaultPosition,
        lastSize = this.sizeHistory.length ? this.sizeHistory[0] : "default";

    var small = {
      modifier: 6,
      validated: true,
      historyCount: 0,
      sequentialCount: 0
    };

    var medium = {
      modifier: 4,
      validated: this.isValidSize("medium", lastPosition),
      historyCount: 0,
      sequentialCount: 0
    };

    var large = {
      modifier: 2,
      validated: this.isValidSize("large", lastPosition),
      historyCount: 0,
      sequentialCount: 0
    };

    // Return small if there is no other option.
    // Since large cannot be valid unless medium is,
    // we can simply check to see if medium is valid.
    if (!medium.validated) {
      return "small";
    }

    // Retrieve data on the past 5 sizes,
    // and store them into the size objects.
    var sequential = true;
    if (this.sizeHistory.length) {
      this.sizeHistory.forEach(function(size) {
        var isSequential = size === lastSize && sequential;

        if (size === "small") {
          small.historyCount += 1;
          if (isSequential) {
            small.sequentialCount++;
          } else { sequential = false; }

        } else if (size === "medium") {
          medium.historyCount += 1;
          if (isSequential) {
            medium.sequentialCount++;
          } else { sequential = false; }

        } else if (size === "large") {
          large.historyCount += 1;
          if (isSequential) {
            large.sequentialCount++;
          } else { sequential = false; }
        }
      });
    }

    // Probability for each size to be selected based on the
    // last selected size and the size history.
    var smallProbability = function() {
      var historyCountModifier = small.historyCount - small.sequentialCount;
      if (small.sequentialCount >= 3) {
        return 0;

      } else {
        return small.modifier - historyCountModifier * 2 + small.sequentialCount;
      }
    };

    var mediumProbability = function() {
      var historyCountModifier = medium.historyCount - medium.sequentialCount;
      if (medium.sequentialCount === 1 || medium.historyCount > 1) {
        return 0;

      } else {
        return medium.modifier - historyCountModifier / 2 - medium.sequentialCount;
      }
    };

    var largeProbability = function() {
      var historyCountModifier = large.historyCount - large.sequentialCount;
      if (large.sequentialCount === 1 || large.historyCount === 1) {
        return 0;

      } else {
        return large.modifier - historyCountModifier * 4 - large.sequentialCount + 4;
      }
    };

    // Randomize chances for each size, modified for probability.
    var group,
        large  = large.validated ? largeProbability() * Math.random() : 0,
        medium = medium.validated ? mediumProbability() * Math.random() : 0,
        small  = small.validated ? smallProbability() * Math.random() : 0;

    if (small >= medium && small >= large) {
      group = "small";

    } else if (medium >= small && medium >= large) {
      group = "medium";

    } else if (large >= small && large >= medium) {
      group = "large";

    } else {
      group = "none";
    }

    return group;
  },


  // Returns boolean representing
  isValidSize: function(sizeGroup, lastPosition) {
    var slotReq = this.getSlotReq(sizeGroup),
        valid = false;

    lastPosition.forEach(function(slot, index) {
      if (!slot && index + slotReq <= lastPosition.length) {
        var group = [],
            lastIndex = index + slotReq;

        for (i = index; i <= lastIndex; i++) {
          if (!lastPosition[i]) {
            group.push(i);

            if (group.length >= slotReq) {
              valid = true;
            }

          } else {
            break;
          }
        }
      }
    });

    return valid;
  },


  getSelected: function(slots) {
    if (!slots) {
      console.error("'slots' is not defined. Please check your use of this.getSelected()");
    }

    var selected = [];
    slots.forEach(function(slot, i) {
      if (slot) {
        selected.push(i);
      }
    });

    return selected;
  },


  getSlotReq: function(sizeGroup) {
    if (sizeGroup === "small") {
      return 1;

    } else if (sizeGroup === "medium") {
      return 2;

    } else if (sizeGroup === "large") {
      return 4;

    } else {
      console.error("No sizeGroup specified: ", sizeGroup, " Check where you are calling the getSlotReq() method.");
    }
  },


  renderImages: function() {
    this.imageMetadata.forEach(function(img, index) {
      var protoImage = new Image();
      protoImage.src = img.url;
      protoImage.onload = function() {
        img.width = protoImage.width;
        img.height = protoImage.height;
        img.calculatedSize = this.getImageSize(img, index);
        this.addImageData(img);
      }.bind(this);
    }.bind(this));

    window.addEventListener("imagesChanged", function() {
      var index = this.images.length - 1;

      this.renderImage(this.images[index], index);
    }.bind(this));
  },


  getImageSize: function(img, index) {
    var aspectRatio = this.calcAspectRatio(img.width, img.height);

    if (this.windowInfo.width < 768) {
      var imgWidth = this.windowInfo.container;

      return {
        width: imgWidth,
        height: (aspectRatio.height / aspectRatio.width) * imgWidth
      };

    } else {
      var imgWidth = this.calculatePositionWidth(this.positionMatrix[index]) - this.getSpacing();

      return {
        width: imgWidth,
        height: (aspectRatio.height / aspectRatio.width) * imgWidth
      };
    }
  },


  calculatePositionWidth: function(position) {
    var takenSlots = [];
    position.forEach(function(slot) {
      if (slot) {
        takenSlots.push(true);
      }
    });

    var right = position[position.length - 1],
        slotWidth = this.getSlotWidth();

    return takenSlots.length * (slotWidth + this.getSpacing());
  },


  renderImage: function(img, index) {
    var size = this.getImageSize(img, index),
        container = document.getElementById("photos");

    img.el = this.createImageElement(index);
    this.images[index] = img;

    var newHeight = isMobile() ? size.height + 2 : size.height;
    this.updateTotalHeight(newHeight);

    container.appendChild(img.el);
  },


  setImagePosition: function(img, el, index) {
    var size = this.getImageSize(img, index);

    // Mobile size
    if (this.windowInfo.width <= 768) {
      el.style.width = size.width + "px";
      el.style.height = size.height + "px";
      el.style.top = "";
      el.style.left = "";

      return el;

    } else {
      var emptyLeftPosition = this.getEmptySlots(this.positionMatrix[index]).left;

      for (i = emptyLeftPosition.length - 1; i <= 4; i++) {
        emptyLeftPosition.push(false);
      }

      var leftPosition =
            (this.windowInfo.width - this.windowInfo.container) / 2 +
            this.calculatePositionWidth(emptyLeftPosition) +
            "px";

      el.style.width  = size.width + "px";
      el.style.height = size.height + "px";
      el.style.top    = this.totalHeight + "px";
      el.style.left   = leftPosition;

      return el;
    }
  },


  getSlotWidth: function() {
    return this.windowInfo.container / 6 - this.getSpacing() * 5 / 6;
  },


  // Determines whether to position an image
  // title to the left or right of an image.
  setTitlePosition: function(el, index) {
    var currentEmptySlots = this.getEmptySlots(this.positionMatrix[index]),
        position;

    if (this.windowInfo.width < 768) {
      position = "bottom";

    } else {
      var currentLeft  = currentEmptySlots.left.length,
          currentRight = currentEmptySlots.right.length;

      if (currentLeft && !currentRight) {
        position = "left";

      } else if (!currentLeft && currentRight) {
        position = "right";

      } else if (currentLeft && currentRight) {
        var nextEmptySlots = this.positionMatrix[index + 1] ? this.getEmptySlots(this.positionMatrix[index + 1]) : false,
            nextLeft = nextEmptySlots.left ? nextEmptySlots.left.length : false,
            nextRight = nextEmptySlots.right ? nextEmptySlots.right.length : false;

        if (nextEmptySlots) {
          if (nextLeft && !nextRight) {
            position = "left";

          } else if (!nextLeft && nextRight) {
            position = "right";

          } else if (nextLeft && nextRight) {
            if (nextLeft > nextRight) {
              position = "left";

            } else if (nextLeft < nextRight) {
              position = "right";

            } else {
              var random = Math.random();

              if (random >= 0.5) {
                position = "left";

              } else {
                position = "right";
              }
            }
          }

        } else {
          position = "right";
        }
      }
    }

    var slotCount;

    if (position === "left") {
      el.setAttribute("class", "title m-left");
      slotCount = currentEmptySlots.left.length;

    } else if (position === "right") {
      el.setAttribute("class", "title m-right");
      slotCount = currentEmptySlots.right.length;

    } else if (position === "bottom") {
      el.setAttribute("class", "title m-bottom");
      slotCount = 6;
    }

    el.style.maxWidth = this.windowInfo.container / 6 * slotCount + "px";

    return el;
  },


  createImageElement: function(index) {
    var img = this.images[index],
        el = document.createElement("a"),
        hoverEl = document.createElement("div");
    el.style.backgroundImage  = "url(" + img.url + ")";
    el.setAttribute("class", "photo");
    el.setAttribute("href", "/photography/" + img.identifier.split("_").join("-"));
    el = this.setImagePosition(img, el, index);

    hoverEl.setAttribute("class", "photo--hover")

    var title = this.setTitlePosition(document.createElement("div"), index),
        text = document.createTextNode(img.title);

    title.appendChild(text);
    el.appendChild(hoverEl);
    el.appendChild(title);

    return el;
  },


  getEmptySlots: function(position) {
    var emptySlots = {
      left: [],
      right: []
    };

    var preceding = true;
    for (var i = 0; i <= position.length - 1; i++) {
      if (!position[i] && preceding) {
        emptySlots.left.push(true);

      } else if (!position[i] && !preceding) {
        emptySlots.right.push(true);

      } else {
        preceding = false;
      }
    }

    return emptySlots;
  },


  // Returns the aspect ratio given a width and height.
  calcAspectRatio: function(w, h) {
    var gcd = this.gcd(w, h);

    return {
      width:  w / gcd,
      height: h / gcd
    };
  },


  // Returns the greatest common diviser given two numbers.
  gcd: function(a, b) {
    if ( !b ) {
      return a;
    }

    return this.gcd(b, a % b);
  },


  // Gets the width of the window, and calculates container width
  // based on the window width.
  getWindowInfo: function() {
    var width     = parseInt(window.getComputedStyle($("body")[0], null).getPropertyValue("width")),
        container = null;

    if (width > 1170) {
      container = 1170 - this.getSpacing() * 2;

    } else if (width > 992) {
      container = 992 - this.getSpacing() * 2;

    } else if (width > 768) {
      container = 768 - this.getSpacing() * 2;

    } else {
      container = width - this.getSpacing() * 2;
    }

    return {
      width: width,
      container: container
    };
  },
};
