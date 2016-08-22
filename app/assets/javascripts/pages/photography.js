
var documentInitialized = false;
document.addEventListener('DOMContentLoaded', function(){
  // quit if this function has already been called
  if (documentInitialized) return;
  documentInitialized = true;

  PositionImages.init();
});


PositionImages = {
  // An array of basic metadata for each image.
  imageMetadata: [],

  // An array of info for each image.
  images: [],

  seedImages: function() {
    var length = imageMetadata.length;

    for (var i = 0; i <= length; i++) {
      this.images.push(false);
    }
  },

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
  addImageData: function(imageData, index) {
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
    this.totalHeight += newHeight + this.spacing;

    document.getElementById("photos").style.height = this.totalHeight + "px";
  },

  // Spacing between images (pixels)
  spacing: 5,

  // Information on the window size, and the container
  // for the images.
  windowInfo: null,

  // Get and store integral window sizing info.
  updateWindowInfo: function() {
    this.windowInfo = this.getWindowInfo();
  },

  // Initializes the resizing, and positioning of all images.
  init: function() {
    this.updateWindowInfo();

    // Gets basic image metadata from the DOM and adds it to
    // the this.imageMetadata array.
    this.getImageMetadata();

    // Creates a matrix used for image positioning.
    this.generatePositionMatrix();

    this.renderImages();

    window.onresize = function() {
      this.updateWindowInfo();
      this.resetTotalHeight();

      this.images.forEach(function(image, index) {
        if (image.el) {
          image.el = this.setImagePosition(image, image.el, index);
          this.setTitlePosition(image.el.children[0], index);
        }

        if (this.windowInfo.width > 768) {
          var size = this.getImageSize(image, index);
          this.updateTotalHeight(size.height);
        }
      }.bind(this));
    }.bind(this);
  },


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
      // Default to an open position array if there is
      // no previous image. E.g. if it's the first image.
      var lastPosition = this.positionMatrix.length ? this.positionMatrix[i - 1] : [false, false, false, false, false, false];

      // Get size group.
      var sizeGroup = this.getSizeGroup(lastPosition, i);

      // Update history and size array
      this.sizes.push(sizeGroup);
      this.sizeHistory.unshift(sizeGroup);
      if (this.sizeHistory.length > 5) {
        this.sizeHistory.pop();
      }

      // Generate position array.
      var positionArray = this.generatePositionArray(lastPosition, sizeGroup);
      this.positionMatrix.push(positionArray);
    }
  },


  // Returns an array for positioning an image.
  // Assumes sizeGroup is valid for available slots.
  generatePositionArray: function(lastPosition, sizeGroup) {
    var slotReq            = this.getSlotReq(sizeGroup),
        prevSelected       = this.getSelected(lastPosition),
        potentialPositions = [];

    // If there is a previously selected position...
    if (prevSelected.length) {
      var firstSelectedIndex = prevSelected[0],
          lastSelectedIndex  = prevSelected[prevSelected.length - 1];

      // If there is not a valid position in the first possible slot...
      if (lastPosition[0]) {
        var firstValidIndex   = prevSelected[prevSelected.length - 1] + 1,
            lastValidIndex    = firstValidIndex + slotReq - 1,
            potentialPosition = [];

        for (var i = 0; i <= 5; i++) {
          if (i >= firstValidIndex && i <= lastValidIndex) {
            potentialPosition.push(true);

          } else {
            potentialPosition.push(false);
          }
        }
        potentialPositions.push(potentialPosition);

      // If there is a valid position in the first possible slot...
      } else {
        // If there is a valid position before the previous selected slot...
        if (firstSelectedIndex - 1 >= slotReq - 1  && !lastPosition[firstSelectedIndex - slotReq - 1]) {
          var firstValidIndex   = firstSelectedIndex - slotReq,
              lastValidIndex    = firstSelectedIndex - 1,
              potentialPosition = [];

          for (var i = 0; i <= 5; i++) {
            if (i >= firstValidIndex && i <= lastValidIndex) {
              potentialPosition.push(true);

            } else {
              potentialPosition.push(false);
            }
          }

          potentialPositions.push(potentialPosition);
        }

        // If there is a valid position after the previous selected slot...
        if (lastSelectedIndex + slotReq <= 5) {
          var firstValidIndex   = prevSelected[prevSelected.length - 1] + 1,
              lastValidIndex    = firstValidIndex + slotReq - 1,
              potentialPosition = [];

          for (var i = 0; i <= 5; i++) {
            if (i >= firstValidIndex && i <= lastValidIndex) {
              potentialPosition.push(true);

            } else {
              potentialPosition.push(false);
            }
          }

          potentialPositions.push(potentialPosition);
        }
      }

    // If there is not a previously selected position.
    } else {
      for (var i = 0; i <= 5; i++) {
        if (i + slotReq - 1 <= 5) {
          var potentialPosition = [];
          for (var i2 = 0; i2 <= 5; i2++) {
            if (i2 >= i && i2 <= i + slotReq - 1) {
              potentialPosition.push(true);

            } else {
              potentialPosition.push(false);
            }
          }

          potentialPositions.push(potentialPosition);
        }
      }
    }

    var positionArray;
    // If there are more than one potential positions for an image.
    if (potentialPositions.length > 1) {
      var selectedSlot = potentialPositions[Math.floor(Math.random() * potentialPositions.length)];

      positionArray = selectedSlot;

    // If there is only one potential position for an image;
    } else {
      positionArray = potentialPositions[0];
    }

    return positionArray;
  },


  // Gets the size group of the image based on the last calculated image,
  // biased towards more attractive layouts.
  getSizeGroup: function(lastSlots, index) {
    var lastSize = this.sizeHistory.length ? this.sizeHistory[0] : "default",
        orientation = this.imageMetadata[index].orientation;

    var small = {
      modifier: 6,
      validated: true,
      historyCount: 0,
      sequentialCount: 0
    };

    var medium = {
      modifier: 4,
      validated: this.isValidSize("medium", lastSlots),
      historyCount: 0,
      sequentialCount: 0
    };

    var large = {
      modifier: 2,
      validated: this.isValidSize("large", lastSlots),
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
      if (large.sequentialCount === 1 || large.historyCount === 1 || orientation === "vertical") {
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

    console.log(orientation, group);

    return group;
  },


  // Returns boolean representing
  isValidSize: function(sizeGroup, lastSlots) {
    var slotReq = this.getSlotReq(sizeGroup),
        valid = false;

    lastSlots.forEach(function(slot, index) {
      var slotPotentiallyValid = !slot && index + slotReq <= lastSlots.length;

      if (slotPotentiallyValid) {
        var group = [],
            lastIndex = index + slotReq;

        for (i = index; i <= lastIndex; i++) {
          if (!lastSlots[i]) {
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
    this.imageMetadata.forEach(function(image, index) {
      this.setImageInfo(image, index);
    }.bind(this));

    window.addEventListener("imagesChanged", function() {
      var index = this.images.length - 1,
          newImage = this.images[index];

      this.renderImage(newImage, index);
    }.bind(this));
  },


  setImageInfo: function(img, index) {
    var protoImage = new Image();
    protoImage.src = img.url;
    protoImage.onload = function() {
      img.width = protoImage.width;
      img.height = protoImage.height;
      this.addImageData(img, index);
    }.bind(this);
  },


  getImageSize: function(image, index) {
    var aspectRatio = this.calcAspectRatio(image.width, image.height);

    if (this.windowInfo.width < 768) {
      var imageWidth = this.windowInfo.container - this.spacing * 2;

      return {
        width: imageWidth,
        height: (aspectRatio.height / aspectRatio.width) * imageWidth
      };

    } else {
      var slotReq   = this.getSlotReq(this.sizes[index]),
          spacingFactor = this.spacing * 6 / 5,
          imageWidth = (this.windowInfo.container / 6) * slotReq - spacingFactor;

      return {
        width: imageWidth,
        height: (aspectRatio.height / aspectRatio.width) * imageWidth
      };
    }
  },


  renderImage: function(image, index) {
    var size = this.getImageSize(image, index)
        container = document.getElementById("photos");

    image.el = this.createImageElement(image, index);
    this.images[index] = image;

    this.updateTotalHeight(size.height);

    container.appendChild(image.el);
  },


  setImagePosition: function(image, el, index) {
    // Mobile size
    if (this.windowInfo.width <= 768) {
      var size = this.getImageSize(image, index);

      el.style.width = size.width + "px";
      el.style.height = size.height + "px";
      el.style.top = "";
      el.style.left = "";

      return el;

    } else {
      var size = this.getImageSize(image, index),
          padding = (this.windowInfo.width - this.windowInfo.container) / 2,
          emptySlotsLeft = this.getEmptySlots(this.positionMatrix[index]).left,
          spacingLeft = emptySlotsLeft.length ? this.spacing * 6 / 5 / 2 : 0;

          leftPosition =
            padding +
            emptySlotsLeft.length *
            this.windowInfo.container / 6 +
            spacingLeft +
            "px";

      el.style.width  = size.width + "px";
      el.style.height = size.height + "px";
      el.style.top    = this.totalHeight + "px";
      el.style.left   = leftPosition;

      return el;
    }
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

    el.style.width = this.windowInfo.container / 6 * slotCount + "px";

    return el;
  },


  createImageElement: function(image, index) {
    var el = document.createElement("a");
    el.style.backgroundImage  = "url(" + image.url + ")";
    el.setAttribute("class", "photo");
    el.setAttribute("href", "/photography/" + image.identifier);
    el = this.setImagePosition(image, el, index);

    var title = this.setTitlePosition(document.createElement("div"), index),
        text = document.createTextNode(image.title);

    title.appendChild(text);
    el.appendChild(title);

    return el;
  },


  getEmptySlots: function(positionArray) {
    var emptySlots = {
      left: [],
      right: []
    };

    var preceding = true;
    for (var i = 0; i <= positionArray.length - 1; i++) {
      if (!positionArray[i] && preceding) {
        emptySlots.left.push(true);

      } else if (!positionArray[i] && !preceding) {
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
    var width     = window.innerWidth,
        container = null;

    if (width > 1170) {
      container = 1148;

    } else if (width > 992) {
      container = 970;

    } else if (width > 768) {
      container = 750;

    } else {
      container = width;
      // TODO: Default to CSS vertical layout;
    }

    return {
      width: width,
      container: container
    };
  },
};
