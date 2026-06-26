import { CONFIG } from "../../config.js";
import { loadCity, findDay, PRAYER_ROWS, nextPrayer } from "../lib/prayers.js";
import { toHijri, formatHijri } from "../lib/hijri.js";

export const title = "Prayer Times";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const SOURCE = {
  birmingham: 'Fajr: openfajr.org · others: najaf.org',
  london:     'najaf.org',
  toronto:    'valieasr.org',
};

let cityId, offset = 0;

export async function render(el) {
  cityId = localStorage.getItem("ih-city") || CONFIG.defaultCity;
  offset = 0;
  injectCss();
  el.innerHTML = `
    <div class="city-row" id="cityRow"></div>
    <div class="card pt-card mt16" id="ptCard"><div class="spinner"></div></div>
    <div class="pt-source faint center mt16" id="ptSource"></div>
  `;
  renderCities(el);
  await draw(el);
}

function renderCities(el) {
  el.querySelector("#cityRow").innerHTML = CONFIG.prayerCities.map(c=>`
    <button class="city-btn ${c.id===cityId?"active":""}" data-city="${c.id}">${c.name}</button>`).join("");
  el.querySelectorAll(".city-btn").forEach(b=>b.addEventListener("click", async ()=>{
    cityId = b.dataset.city; offset = 0;
    localStorage.setItem("ih-city", cityId);
    el.querySelectorAll(".city-btn").forEach(x=>x.classList.toggle("active", x===b));
    await draw(el);
  }));
}

async function draw(el) {
  const card = el.querySelector("#ptCard");
  const arr = await loadCity(cityId);
  const d = new Date(); d.setDate(d.getDate() + offset);
  const pt = findDay(arr, d);
  const h = toHijri(d, CONFIG.hijriDayOffset || 0);

  const sub = offset===0?"Today":offset===1?"Tomorrow":offset===-1?"Yesterday":DAYS[d.getDay()];
  const np = offset===0 ? nextPrayer(arr) : null;

  card.innerHTML = `
    <div class="pt-head">
      <button class="navd" id="prevD">‹</button>
      <div class="center">
        <div class="pt-date">${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}</div>
        <div class="muted" style="font-size:.8rem">${sub} · ${formatHijri(h)}</div>
      </div>
      <button class="navd" id="nextD">›</button>
    </div>
    <div class="pt-rows">
      ${PRAYER_ROWS.map(r=>{
        const isNext = np && r.prayer && r.name===np.name;
        return `<div class="pt-row ${isNext?"hl":""} ${r.prayer?"":"minor"}">
          <span class="pn">${r.name}</span>
          <span class="ptm">${pt?pt[r.key]:"--:--"}</span>
        </div>`;
      }).join("")}
    </div>
  `;
  el.querySelector("#prevD").onclick = ()=>{ offset--; draw(el); };
  el.querySelector("#nextD").onclick = ()=>{ offset++; draw(el); };
  el.querySelector("#ptSource").textContent = "Times: " + (SOURCE[cityId] || "local source");
}

function injectCss() {
  if (document.getElementById("pt-css")) return;
  const s=document.createElement("style"); s.id="pt-css";
  s.textContent=`
    .city-row{display:flex;gap:8px;justify-content:center;margin-top:8px}
    .city-btn{background:transparent;border:1.5px solid var(--border);color:var(--text-dim);
      padding:7px 16px;border-radius:999px;font-size:.85rem;font-weight:600;cursor:pointer;transition:all .2s}
    .city-btn.active{background:var(--gold);border-color:var(--gold);color:var(--green-900)}
    .pt-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
    .pt-date{font-family:var(--font-display);font-size:1.45rem;font-weight:700}
    .navd{width:38px;height:38px;border-radius:50%;background:var(--surface-2);border:1px solid var(--border-2);
      color:var(--gold);font-size:1.3rem;cursor:pointer}
    .pt-rows{margin-top:8px}
    .pt-row{display:flex;justify-content:space-between;align-items:center;padding:14px 12px;border-radius:12px;
      margin-top:6px;border:1px solid transparent}
    .pt-row .pn{font-weight:600}
    .pt-row .ptm{font-size:1.25rem;font-weight:700;font-variant-numeric:tabular-nums}
    .pt-row.minor{opacity:.62}.pt-row.minor .ptm{font-weight:600;font-size:1.05rem}
    .pt-row.hl{background:linear-gradient(160deg,rgba(212,175,55,.18),var(--surface));border-color:var(--gold)}
    .pt-row.hl .pn,.pt-row.hl .ptm{color:var(--gold-soft)}
  `;
  document.head.appendChild(s);
}
