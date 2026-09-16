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

  initPinStory()
} else {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    el.style.opacity = '1'
    el.style.transform = 'none'
  })
  loader?.classList.add('is-done')
}

function initPinStory() {
  const stage = document.querySelector('.pin-stage')
  if (!stage) return

  const scenes = [...document.querySelectorAll('[data-pin-scene]')]
  const dots = [...document.querySelectorAll('[data-pin-dot]')]
  const fill = document.querySelector('.pin-rail-fill')
  const step = document.querySelector('[data-pin-step]')
  const hint = document.querySelector('.pin-hint')
  if (!scenes.length) return

  const mobile = window.matchMedia('(max-width: 980px)').matches
  const end = mobile ? '+=150%' : '+=210%'

  gsap.set(scenes, { opacity: 0, y: 36 })
  gsap.set(scenes[0], { opacity: 1, y: 0 })
  dots.forEach((dot, i) => dot.classList.toggle('is-active', i === 0))
  if (step) step.textContent = '01'

  ScrollTrigger.create({
    trigger: stage,
    start: 'top top',
    end,
    pin: true,
    scrub: 0.7,
    anticipatePin: 1,
    onUpdate: (self) => {
      const p = self.progress
      const index = Math.min(scenes.length - 1, Math.floor(p * scenes.length * 0.999))

      if (fill) {
        if (mobile) gsap.set(fill, { width: `${p * 100}%`, height: '100%' })
        else gsap.set(fill, { height: `${p * 100}%`, width: '100%' })
      }

      if (hint) gsap.set(hint, { autoAlpha: p > 0.84 ? 0 : 0.72 })

      scenes.forEach((scene, i) => {
        const start = i / scenes.length
        const peak = (i + 0.42) / scenes.length
        const finish = (i + 1) / scenes.length
        let opacity = 0
        let y = 36

        if (i === scenes.length - 1 && p >= peak) {
          opacity = 1
          y = 0
        } else if (p >= start && p <= peak) {
          const t = (p - start) / (peak - start || 1)
          opacity = t
          y = 36 * (1 - t)
        } else if (p > peak && p < finish) {
          const t = (p - peak) / (finish - peak || 1)
          opacity = 1 - t
          y = -24 * t
        }

        gsap.set(scene, { opacity, y })
      })

      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index))
      if (step) step.textContent = String(index + 1).padStart(2, '0')
    },
  })
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
