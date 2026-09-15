import './styles.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { initChrome } from './shared.js'
import { news } from './news-data.js'

gsap.registerPlugin(ScrollTrigger)

initChrome()
renderNews()

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const loader = document.querySelector('.loader')

const finishLoader = () => {
  document.body.classList.add('is-ready')
  loader?.classList.add('is-done')
}

if (reduce) {
  finishLoader()
} else {
  window.setTimeout(finishLoader, 800)
}

if (!reduce) {
  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  const heroImg = document.querySelector('.hero-media img')
  const lines = document.querySelectorAll('[data-line]')

  gsap.set(heroImg, { scale: 1.18 })
  gsap.to(heroImg, {
    scale: 1,
    duration: 2.4,
    ease: 'power3.out',
    delay: 0.35,
  })

  gsap.from(lines, {
    yPercent: 120,
    duration: 1.15,
    stagger: 0.12,
    ease: 'power4.out',
    delay: 0.45,
  })

  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
      },
    })
  })

  gsap.utils.toArray('[data-parallax]').forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  })

  const pin = document.querySelector('.pin-stage')
  if (pin && window.innerWidth > 980) {
    ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: '+=80%',
      pin: true,
      pinSpacing: true,
    })
  }
} else {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    el.style.opacity = '1'
    el.style.transform = 'none'
  })
  loader?.classList.add('is-done')
}

function renderNews() {
  const featured = document.querySelector('[data-news-featured]')
  const list = document.querySelector('[data-news-list]')
  if (!featured || !list) return

  const [first, ...rest] = news
  featured.innerHTML = cardMarkup(first, true)
  list.innerHTML = rest.slice(0, 3).map((item) => cardMarkup(item)).join('')
}

function cardMarkup(item, featured = false) {
  const date = new Date(`${item.date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return `
    <article class="news-card${featured ? ' featured' : ''}">
      <div>
        <span class="tag">${item.tag}</span>
        &nbsp;·&nbsp;
        <time datetime="${item.date}">${date}</time>
      </div>
      <h3>${item.title}</h3>
      <p>${item.excerpt}</p>
    </article>
  `
}
