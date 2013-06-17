/* ==========================================================================
            
                jQuery responsive, carousel plugin
              https://github.com/emelineL/mCarousel

  ========================================================================== */

(function ($) {

  $.fn.mCarousel = function (options) {
    /* Support multiple elements */
    if (this.length > 1) {
      this.each(function () {
        $(this).myPlugin(options);
      });
      return this;
    }

    /* Handle options */
    var defaults = {
      prevControl: '',
      nextControl: '',
      enableHiddenControls: true,
      carouselWrapper: '.mCarousel-wrapper',
      itemWidth: 200,
      placeholder: false
    };

    options = $.extend(defaults, options);

    var hasPlaceholder = options.placeholder;
    var _minItems = options.minItems;
    var _itemWidth = options.itemWidth;

    var nbVisibleItems;
    var nbItems;

    var $prevControl = $(options.prevControl);
    var $nextControl = $(options.nextControl);
    var enableHiddenControls = options.enableHiddenControls;
    /* End options */

    var outerWidth = 0; // Visible width
    var innerWidth = 0; // Width of the entire list
    var currentPosition = 0;

    var $wrapper = $(this);
    var $carousel = $(this).find(options.carouselWrapper);    // Carousel DOM elt is here to enable responsivity
    var $innerList = $carousel.children('ul');

    var caroulib = {};

    // Pulic function
    this._init = function (options) {
      //console.log('Carousel succesfully init'); 
      caroulib._setWidth();
      $(window).resize(function () {
        caroulib._resize();
      });
      $wrapper.resize(function () {
        caroulib._resize();
      });

      // Set style
      $carousel.css({
        'visibility': 'visible',
        'position': 'relative',
        'z-index': 2,
        'left': 0,
        'overflow': 'hidden'
      });
      $innerList.css({
        'overflow': 'hidden',
        'margin': 0,
        'padding': 0,
        'position': 'relative',
        'list-style-type': 'none',
        'z-index': 1
      });
      caroulib._setBindings();
      return this;
    };

    caroulib._setWidth = function () {
      //console.log('Caroulib: setWidth');
      var nbSlots = 0;
      nbItems = $innerList.children('li').length;

      if (hasPlaceholder == true) {
          nbSlots = nbItems + 1;
      } else {
        nbSlots = nbItems;
      }

      if (typeof _minItems !== 'undefined' && nbSlots <= _minItems) {
        nbVisibleItems = nbSlots;
        if (hasPlaceholder == true) {
          outerWidth = _minItems * _itemWidth;
          innerWidth = outerWidth;
        } else {
          outerWidth = nbSlots * _itemWidth;
          innerWidth = outerWidth;
        }
      } else {
        var autoWidth = $wrapper.width() - $prevControl.outerWidth() - $nextControl.outerWidth();
        nbVisibleItems = Math.floor(autoWidth/_itemWidth);
        if (nbVisibleItems <= nbSlots) {
          //console.log('more items than visible items');
          outerWidth = nbVisibleItems * _itemWidth;
          innerWidth = nbSlots * _itemWidth;
          currentPosition = - (nbSlots - nbVisibleItems) * _itemWidth;

          if ($innerList.css('left') == 'auto') {
            $innerList.css('left', currentPosition);
          } else {
            $innerList.animate({'left': currentPosition});
          }      
          // test if controls are needed
          if (enableHiddenControls === true) {
            caroulib._checkControls(nbVisibleItems, nbSlots);
          }
        }
        else {
          //console.log('less items than visible items');
          nbVisibleItems = nbSlots;
          outerWidth = nbSlots *_itemWidth;
          innerWidth = outerWidth;
          $carousel.width(outerWidth);
        } 
      }
      $innerList.width(innerWidth);
      $carousel.width(outerWidth);
    };

    caroulib._resize = function () {
      //console.log('Caroulib._resize');
      var nbSlots = 0;

      if (hasPlaceholder == true) {
          nbSlots = nbItems+1;
      } else {
        nbSlots = nbItems;
      }

      if (typeof _minItems == 'undefined' || nbSlots > _minItems) {
        var isLeft = false;
        var endPosition = (- (nbSlots - nbVisibleItems) * _itemWidth);
        if ( parseInt(currentPosition) == endPosition) {
          isLeft = true;
        }

        var autoWidth = $wrapper.width()- $prevControl.outerWidth() - $nextControl.outerWidth();;
        var prevVisibleItems = nbVisibleItems;
                  
        nbVisibleItems = Math.floor(autoWidth/_itemWidth);
        outerWidth = nbVisibleItems * _itemWidth;
        // test if controls are needed
        if (enableHiddenControls === true) {
          caroulib._checkControls(nbVisibleItems, nbSlots);       
        }

        if (nbVisibleItems <= nbSlots) {
          //More items than visible items
          $carousel.width(outerWidth);
          if (prevVisibleItems < nbVisibleItems) {
            if (isLeft) {
              currentPosition += _itemWidth;
              $innerList.css({'left': currentPosition});
            }
          }
        }
        else {
          // Less items than visible items
          nbVisibleItems = prevVisibleItems;
          outerWidth = nbSlots *_itemWidth;
          $carousel.width(outerWidth);
        }
      }
    };

    caroulib._checkControls = function (nbVisibleItems, nbSlots) {
      /* Test if controls are needed or
      of there are enough available place */
      if (nbVisibleItems < nbSlots) {
        caroulib._showControls();
        if (currentPosition == 0) {
          //console.log('hide prev');
          $prevControl.css('visibility', 'hidden');
        } else {
          //console.log('show prev');
          $prevControl.css('visibility', 'visible');
        }
        if ((nbVisibleItems * _itemWidth) - currentPosition == innerWidth) {
          $nextControl.css('visibility', 'hidden');
        } else {
          $nextControl.css('visibility', 'visible');
        }
      } else {
        caroulib._hideControls();
      }
    };

    caroulib._hideControls = function () {
      $prevControl.css('visibility', 'hidden');
      $nextControl.css('visibility', 'hidden');
    };
    caroulib._showControls = function () {
      $prevControl.css('visibility', 'visible');
      $nextControl.css('visibility', 'visible');
    };

    caroulib._setBindings = function () {
      //console.log('set bindings');
      if (enableHiddenControls === true) {
        if (currentPosition == 0) {
          $prevControl.css('visibility', 'hidden');
        }
        if ((nbVisibleItems * _itemWidth) - currentPosition == innerWidth) {
          $nextControl.css('visibility', 'hidden');
        }
      }
      
      $prevControl.unbind();
      $prevControl.click(function () {
        if (currentPosition < 0) {
          currentPosition += _itemWidth;
          $innerList.animate({'left': currentPosition },function(){
            if (enableHiddenControls === true) {
              if (currentPosition == 0) {
                $prevControl.css('visibility', 'hidden');
              }
              if ( (nbVisibleItems * _itemWidth) - currentPosition < innerWidth) {
                $nextControl.css('visibility', 'visible');
              }
            }
          });
        }
      });
      
      $nextControl.unbind();
      $nextControl.click(function() {
        if ( (nbVisibleItems * _itemWidth) - currentPosition < innerWidth) {
          currentPosition -= _itemWidth;
          $innerList.animate({'left': currentPosition}, function () {
            if (enableHiddenControls === true) {
              if (currentPosition < 0) {
                $prevControl.css('visibility', 'visible');
              }
              if ((nbVisibleItems * _itemWidth) - currentPosition == innerWidth) {
                $nextControl.css('visibility', 'hidden');
              }
            }
          });
        }
      });
    };

    // Handle add/remove element from carousel
    this.resize = function () {
      caroulib._resize();
    };
    this.updateItemList = function () {
      caroulib._setWidth();
    };

    return this._init();
  };

})( jQuery );