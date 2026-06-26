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
      <div class="hero-rule"></div>
    </section>

    <div class="card next-prayer mt16" id="npCard">
      <div class="spinner" style="margin:8px auto"></div>
    </div>

    <div class="card date-card mt16" id="dateCard"></div>

    <div class="section-title">Next program</div>
    <div id="homeProgram"><div class="card faint center">Loading…</div></div>
  `;

  injectHomeCss();

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

function injectHomeCss() {
  if (document.getElementById("home-css")) return;
  const s = document.createElement("style"); s.id = "home-css";
  s.textContent = `
    .hero { text-align:center; padding:30px 18px 28px; position:relative; }
    .hero-crest { font-size:2.6rem; color:var(--red-bright); line-height:1;
      filter:drop-shadow(0 3px 14px rgba(230,57,70,.45)); }
    .hero-name { font-family:var(--font-display); font-size:2.3rem; font-weight:700;
      letter-spacing:.4px; margin-top:8px; line-height:1.05; }
    .hero-tag { font-size:.82rem; margin-top:8px; letter-spacing:.04em; }
    .hero-rule { width:64px; height:2px; margin:14px auto 0;
      background:linear-gradient(90deg,transparent,var(--red-bright),transparent); }
    .np-name { font-family:var(--font-display); font-size:1.9rem; font-weight:700; color:var(--red-bright); line-height:1; }
    .np-time { font-size:1rem; color:var(--text-dim); margin-top:4px; }
    .np-cd { font-size:1.7rem; font-weight:800; font-variant-numeric:tabular-nums; }
  `;
  document.head.appendChild(s);
}
