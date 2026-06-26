import { ICON } from "../icons.js";

export const title = "More";

const ITEMS = [
  { route:"dua",     icon:"dua",     name:"Dua & Ziyarat", desc:"Supplications, Arabic & Persian, audio" },
  { route:"live",    icon:"live",    name:"Live Shrine",   desc:"Imam Hussain Holy Shrine, Karbala" },
  { route:"library", icon:"library", name:"Library",       desc:"Books and religious texts" },
  { route:"qibla",   icon:"qibla",   name:"Qibla",         desc:"Compass direction to the Ka'bah" },
  { route:"about",   icon:"info",    name:"About & Contact", desc:"Centre details and links" },
];

export function render(el) {
  el.innerHTML = `<div class="stack mt8">${ITEMS.map(i=>`
    <div class="card more-row" onclick="App.go('${i.route}')">
      <div class="ico">${ICON[i.icon]}</div>
      <div style="flex:1">
        <div style="font-weight:700">${i.name}</div>
        <div class="muted" style="font-size:.82rem">${i.desc}</div>
      </div>
      <span class="faint">${ICON.chevron}</span>
    </div>`).join("")}</div>`;
  if (!document.getElementById("more-css")) {
    const s=document.createElement("style"); s.id="more-css";
    s.textContent=`.more-row{display:flex;align-items:center;gap:14px;cursor:pointer}
      .more-row .ico{width:46px;height:46px;flex:0 0 46px;border-radius:12px;display:grid;place-items:center;background:var(--gold-dim);color:var(--gold)}
      .more-row .ico svg{width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:1.8}`;
    document.head.appendChild(s);
  }
}
