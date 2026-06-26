import { CONFIG } from "../../config.js";
import { ICON } from "../icons.js";
import { loadPrograms, upcomingPrograms } from "../lib/programs.js";

export const title = "Programs";

export async function render(el) {
  injectCss();
  if (!CONFIG.programsCsvUrl) {
    el.innerHTML = setupNotice();
    return;
  }
  el.innerHTML = `<div class="spinner"></div>`;
  try {
    const all = await loadPrograms(true);
    const up = upcomingPrograms(all);
    if (!up.length) {
      el.innerHTML = `<div class="empty"><div class="em-ico">📅</div>No upcoming programs.<br><span class="faint">Check back soon.</span></div>`;
      return;
    }
    el.innerHTML = `<div class="stack">${up.map(card).join("")}</div>`;
  } catch (e) {
    el.innerHTML = `<div class="empty"><div class="em-ico">⚠️</div>Couldn't load programs.<br><span class="faint">${e.message}</span></div>`;
  }
}

function card(p) {
  return `<div class="card pg">
    ${p.image?`<img class="pg-img" src="${p.image}" alt="" loading="lazy">`:""}
    <div class="pg-body">
      <div class="pill">${ICON.calendar}&nbsp;${p.date.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}${p.time?` · ${p.time}`:""}</div>
      <div class="pg-title">${p.title}</div>
      ${p.location?`<div class="muted pg-meta">${ICON.pin} ${p.location}</div>`:""}
      ${p.details?`<div class="pg-det">${p.details}</div>`:""}
    </div>
  </div>`;
}

function setupNotice() {
  return `<div class="empty">
    <div class="em-ico">📣</div>
    Programs are not connected yet.
    <div class="faint" style="margin-top:8px;font-size:.85rem;line-height:1.6">
      Publish a Google Sheet to the web as CSV with columns<br>
      <b>Date · Time · Title · Location · Details · Image</b><br>
      then paste the link into <code>config.js</code>.
    </div>
  </div>`;
}

function injectCss() {
  if (document.getElementById("pg-css")) return;
  const s=document.createElement("style"); s.id="pg-css";
  s.textContent=`
    .pg{padding:0;overflow:hidden}
    .pg-img{width:100%;height:160px;object-fit:cover;display:block}
    .pg-body{padding:16px}
    .pg-title{font-size:1.15rem;font-weight:700;margin-top:10px}
    .pg-meta{font-size:.85rem;margin-top:4px}
    .pg-det{font-size:.9rem;color:var(--text-dim);margin-top:8px;line-height:1.5;white-space:pre-wrap}
    code{background:var(--surface-2);padding:1px 6px;border-radius:5px;color:var(--gold-soft)}
  `;
  document.head.appendChild(s);
}
