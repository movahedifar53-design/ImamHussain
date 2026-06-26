import { CONFIG } from "../../config.js";
import { ICON } from "../icons.js";

export const title = "Library";

export function render(el) {
  const books = CONFIG.library || [];
  if (!books.length) {
    el.innerHTML = `<div class="empty"><div class="em-ico">📚</div>The library is being prepared.<br>
      <span class="faint">Books and texts will appear here soon.</span></div>`;
    return;
  }
  injectCss();
  el.innerHTML = `<div class="stack mt8">${books.map(b=>`
    <a class="card book-row" href="${b.file}" target="_blank" rel="noopener">
      <div class="ico">${ICON.book}</div>
      <div style="flex:1">
        <div style="font-weight:700">${b.title}</div>
        <div class="muted" style="font-size:.82rem">${b.author||""}${b.lang?` · ${b.lang}`:""}</div>
      </div>
      <span class="faint">${ICON.chevron}</span>
    </a>`).join("")}</div>`;
}

function injectCss(){
  if(document.getElementById("lib-css"))return;
  const s=document.createElement("style");s.id="lib-css";
  s.textContent=`.book-row{display:flex;align-items:center;gap:14px;text-decoration:none;color:inherit}
    .book-row .ico{width:46px;height:46px;flex:0 0 46px;border-radius:12px;display:grid;place-items:center;background:var(--gold-dim);color:var(--gold)}
    .book-row .ico svg{width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:1.8}`;
  document.head.appendChild(s);
}
