import './styles.css'
import { initChrome } from './shared.js'
import { news } from './news-data.js'

initChrome()

const root = document.querySelector('[data-news-page]')
if (root) {
  root.innerHTML = news
    .map((item) => {
      const date = new Date(`${item.date}T12:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      return `
        <article class="news-card" data-reveal style="opacity:1;transform:none">
          <div>
            <span class="tag">${item.tag}</span>
            &nbsp;·&nbsp;
            <time datetime="${item.date}">${date}</time>
          </div>
          <h3>${item.title}</h3>
          <p>${item.excerpt}</p>
        </article>
      `
    })
    .join('')
}
