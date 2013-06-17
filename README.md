
#  mCarousel #


A new, responsive jQuery plugin.

## Features: ##

- Carousel
- Responsive: if the width of the carousel is setted in %, it will automatically update the number of displayed items.
- Optimized to use drag & drop
  -> need to add JQuery UI
  -> possibility to add a placholder slot through the placholder option
  -> a public function 'updateItemList' needs to be called after each item addition/deletion


Coming/ Cool stuff:
  - Display by increasing/decreasing order


## How to use ##

### Minimal Settings ###

HTML part
    
    <div class="mCarousel">
        <button class="prev btn">&lt;</button>

        <div class="mCarousel-wrapper">
            <ul>
              <li><img src="img/car1.png"/></li>
                <li><img src="img/car2.png"/></li>
                <li><img src="img/car3.png"/></li>
                <li><img src="img/car4.png"/></li>
                <li><img src="img/car5.png"/></li>
                <li><img src="img/car6.png"/></li>
            </ul>
        </div>

        <button class="next btn">&gt;</button>
    </div>  

JS

  $('.mCarousel).mCarousel();

CSS

  Include mCarousel.css

  -> set height to your mCarousel class


### Custom options: ###

  - innerWrapper
    default : '.mCarousel-wrapper'
  - prevControl: selector for previous control
    default: ''
  - nextControl: selector for next control
    default: ''
  - itemWidth: width of each item, needs also to be set in the CSS
    default: 200px
  - placeholder: 
    Enable to have one empty case, if the carousel is droppable
    defaults: false

### Public functions ###

  - $('.mCarousel).updateItemList() - when the number of items changes, this method needs to be called.
