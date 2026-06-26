import { CONFIG } from "../../config.js";
import { ICON } from "../icons.js";
import { loadCity, nextPrayer, countdownText } from "../lib/prayers.js";
import { loadEvents, eventsOn, upcoming, hijriToday, TYPE_META } from "../lib/events.js";
import { formatHijri, WEEKDAYS } from "../lib/hijri.js";
import { loadPrograms, nextProgram } from "../lib/programs.js";

export const title = CONFIG.centreName;

let timer = null;

export async function render(el) {
  if (timer) { clearInterval(timer); timer = null; }
  const cityId = localStorage.getItem("ih-city") || CONFIG.defaultCity;

  el.innerHTML = `
    <section class="hero card gold">
      <div class="hero-crest">۞</div>
      <h1 class="hero-name">${CONFIG.centreName}</h1>
      <p class="hero-tag muted">${CONFIG.centreNameFull}</p>
    </section>

    <div class="card next-prayer mt16" id="npCard">
      <div class="spinner" style="margin:8px auto"></div>
    </div>

    <div class="card date-card mt16" id="dateCard"></div>

    <div class="section-title">Explore</div>
    <div class="tile-grid" id="homeTiles"></div>

    <div class="section-title">Next program</div>
    <div id="homeProgram"><div class="card faint center">Loading…</div></div>
  `;

  injectHomeCss();
  renderTiles(el);

  // --- date + today's events ---
  const now = new Date();
  const h = hijriToday(now);
  const dateCard = el.querySelector("#dateCard");
  const events = await loadEvents().catch(() => []);
  const todays = eventsOn(events, now);
  dateCard.innerHTML = `
    <div class="row between">
      <div>
        <div class="muted" style="font-size:.8rem">${WEEKDAYS[now.getDay()]}</div>
        <div style="font-size:1.15rem;font-weight:700">${now.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
      </div>
      <div class="pill">${formatHijri(h)}</div>
    </div>
    ${todays.length ? `<div class="divider"></div>` + todays.map(e=>`
      <div class="row" style="gap:10px">
        <span style="font-size:1.2rem">${TYPE_META[e.type].glyph}</span>
        <span style="font-size:.92rem">${e.title}</span>
      </div>`).join("") : ""}
  `;

  // --- next prayer (live countdown) ---
  const npCard = el.querySelector("#npCard");
  try {
    const arr = await loadCity(cityId);
    const tick = () => {
      const np = nextPrayer(arr);
      if (!np) { npCard.innerHTML = `<div class="faint center">Prayer times unavailable</div>`; return; }
      npCard.innerHTML = `
        <div class="row between">
          <div class="muted" style="font-size:.78rem;text-transform:uppercase;letter-spacing:.12em">Next prayer</div>
          <div class="faint" style="font-size:.78rem">${CONFIG.prayerCities.find(c=>c.id===cityId).name}</div>
        </div>
        <div class="row between mt8" style="align-items:flex-end">
          <div>
            <div class="np-name">${np.name}</div>
            <div class="np-time">${np.time}</div>
          </div>
          <div class="np-count">
            <div class="np-cd">${countdownText(np.at)}</div>
            <div class="faint" style="font-size:.72rem;text-align:right">remaining</div>
          </div>
        </div>`;
    };
    tick();
    timer = setInterval(() => { if (document.body.contains(npCard)) tick(); else clearInterval(timer); }, 1000);
  } catch {
    npCard.innerHTML = `<div class="faint center">Prayer times unavailable</div>`;
  }

  // --- next program ---
  const pgEl = el.querySelector("#homeProgram");
  try {
    const programs = await loadPrograms();
    const np = nextProgram(programs);
    pgEl.innerHTML = np ? `
      <div class="card" onclick="App.go('programs')" style="cursor:pointer">
        <div class="row between">
          <div class="pill">${ICON.programs}&nbsp;${np.date.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}${np.time?` · ${np.time}`:""}</div>
          <span class="faint">${ICON.chevron}</span>
        </div>
        <div style="font-weight:700;font-size:1.05rem;margin-top:10px">${np.title}</div>
        ${np.location?`<div class="muted" style="font-size:.85rem;margin-top:2px">${ICON.pin} ${np.location}</div>`:""}
      </div>` : emptyPrograms();
  } catch {
    pgEl.innerHTML = emptyPrograms();
  }
}

function emptyPrograms() {
  return `<div class="card faint center" onclick="App.go('programs')" style="cursor:pointer">No upcoming programs yet. Tap to view all.</div>`;
}

const TILES = [
  { route:"prayers",  icon:"prayer",  name:"Prayer Times", desc:"Daily timings" },
  { route:"calendar", icon:"calendar",name:"Shia Calendar",desc:"Important days" },
  { route:"dua",      icon:"dua",     name:"Dua & Ziyarat",desc:"Supplications" },
  { route:"live",     icon:"live",    name:"Live Shrine",  desc:"Karbala stream" },
  { route:"library",  icon:"library", name:"Library",      desc:"Books & texts" },
  { route:"qibla",    icon:"qibla",   name:"Qibla",        desc:"Find direction" },
];

function renderTiles(el) {
  el.querySelector("#homeTiles").innerHTML = TILES.map(t=>`
    <div class="tile" onclick="App.go('${t.route}')">
      <div class="ico">${ICON[t.icon]}</div>
      <div class="t-name">${t.name}</div>
      <div class="t-desc">${t.desc}</div>
    </div>`).join("");
}

function injectHomeCss() {
  if (document.getElementById("home-css")) return;
  const s = document.createElement("style"); s.id = "home-css";
  s.textContent = `
    .hero { text-align:center; padding:26px 18px; }
    .hero-crest { font-size:2.4rem; color:var(--gold); line-height:1; }
    .hero-name { font-size:1.7rem; font-weight:800; letter-spacing:.3px; margin-top:6px; }
    .hero-tag { font-size:.85rem; margin-top:2px; }
    .np-name { font-size:1.5rem; font-weight:800; color:var(--gold); }
    .np-time { font-size:1.05rem; color:var(--text-dim); margin-top:-2px; }
    .np-cd { font-size:1.7rem; font-weight:800; font-variant-numeric:tabular-nums; }
  `;
  document.head.appendChild(s);
}
