import Swiper, {
  Navigation,
  Pagination,
  Parallax,
  Keyboard,
  Mousewheel,
  Autoplay,
  A11y
} from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/parallax'

Swiper.use([
  Navigation,
  Pagination,
  Parallax,
  Keyboard,
  Mousewheel,
  Autoplay,
  A11y
])

let autoplayConfig = {
  delay: 5000
}

if (
  typeof disableFeaturedSliderAutoplay !== 'undefined' && disableFeaturedSliderAutoplay
) {
  autoplayConfig = false
}

const adaptSliderControlsAppearance = (swiperInstance) => {
  const currentSlide = document.querySelector(`.js-slider .swiper-slide:nth-child(${swiperInstance.activeIndex + 1}) .g-home-slide`)

  if (!currentSlide) {
    return
  }

  const sliderControls = document.querySelectorAll('.js-slider-control')

  if (currentSlide.classList.contains('with-image')) {
    sliderControls.forEach((control) => {
      control.classList.add('with-image')
    })
  } else {
    sliderControls.forEach((control) => {
      control.classList.remove('with-image')
    })
  }
}

const swiper = new Swiper('.js-slider', {
  grabCursor: true,
  longSwipesRatio: 0.1,
  pagination: {
    el: '.swiper-pagination',
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  mousewheel: {
    forceToAxis: true,
    thresholdDelta: 50
  },
  parallax: true,
  speed: 500,
  keyboard: true,
  autoplay: autoplayConfig,
  a11y: true,
  on: {
    init: function() {
      adaptSliderControlsAppearance(this)
    },
    slideChange: function() {
      adaptSliderControlsAppearance(this)
    }
  }
})
