export function captureAttribution() {
  const params = new URLSearchParams(window.location.search)
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid']
  const stored = JSON.parse(sessionStorage.getItem('zds_attr') || '{}')
  keys.forEach((key) => {
    const value = params.get(key)
    if (value) stored[key] = value
  })
  sessionStorage.setItem('zds_attr', JSON.stringify(stored))
  return stored
}

export function initChrome() {
  const header = document.querySelector('.site-header')
  const toggle = document.querySelector('.nav-toggle')
  const year = document.querySelectorAll('[data-year]')

  year.forEach((el) => {
    el.textContent = String(new Date().getFullYear())
  })

  const onScroll = () => {
    if (!header) return
    header.classList.toggle('is-scrolled', window.scrollY > 12)
  }

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  toggle?.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open')
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
    toggle.textContent = open ? 'Close' : 'Menu'
  })

  document.querySelectorAll('.nav a').forEach((link) => {
    link.addEventListener('click', () => document.body.classList.remove('nav-open'))
  })

  captureAttribution()
}

export function wireForm(form) {
  if (!form) return
  const attr = captureAttribution()
  const next = form.querySelector('[name="_next"]')
  if (next) next.value = new URL('thank-you.html', window.location.href).href

  Object.entries(attr).forEach(([key, value]) => {
    let input = form.querySelector(`[name="${key}"]`)
    if (!input) {
      input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      form.appendChild(input)
    }
    input.value = value
  })

  const page = form.querySelector('[name="Page"]')
  if (page) page.value = window.location.pathname
}
