import{i as n}from"./shared-DbpEhN1r.js";import{n as r}from"./news-data-B345JYjv.js";n();const t=document.querySelector("[data-news-page]");t&&(t.innerHTML=r.map(e=>{const a=new Date(`${e.date}T12:00:00`).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});return`
        <article class="news-card" data-reveal style="opacity:1;transform:none">
          <div>
            <span class="tag">${e.tag}</span>
            &nbsp;·&nbsp;
            <time datetime="${e.date}">${a}</time>
          </div>
          <h3>${e.title}</h3>
          <p>${e.excerpt}</p>
        </article>
      `}).join(""));
