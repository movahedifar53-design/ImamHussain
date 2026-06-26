import { loadEvents, eventsOn, upcoming, hijriToday, TYPE_META } from "../lib/events.js";
import { formatHijri, HIJRI_MONTHS, WEEKDAYS } from "../lib/hijri.js";

export const title = "Shia Calendar";

export async function render(el) {
  injectCss();
  const now = new Date();
  const h = hijriToday(now);
  const events = await loadEvents();
  const todays = eventsOn(events, now);
  const next = upcoming(events, now, 15);

  el.innerHTML = `
    <div class="card gold cal-today">
      <div class="muted" style="font-size:.78rem;letter-spacing:.12em;text-transform:uppercase">${WEEKDAYS[now.getDay()]}</div>
      <div class="cal-hijri">${h.day} ${HIJRI_MONTHS[h.month-1]}</div>
      <div class="muted">${h.year} AH</div>
      <div class="faint" style="font-size:.85rem;margin-top:4px">${now.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
      ${todays.length?`<div class="divider"></div>`+todays.map(evRow).join(""):""}
    </div>

    <div class="section-title">Upcoming observances</div>
    <div class="stack">${next.map(upRow).join("")}</div>

    <div class="cal-legend">
      ${Object.entries(TYPE_META).map(([k,v])=>`<span class="lg"><i style="background:${v.color}"></i>${v.label}</span>`).join("")}
    </div>
  `;
}

function evRow(e) {
  const t = TYPE_META[e.type];
  return `<div class="row" style="gap:10px;margin-top:4px">
    <span style="font-size:1.15rem">${t.glyph}</span>
    <span>${e.title}</span></div>`;
}

function upRow(e) {
  const t = TYPE_META[e.type];
  const when = e.daysLeft===0?"Today":e.daysLeft===1?"Tomorrow":`in ${e.daysLeft} days`;
  return `<div class="card up-row">
    <div class="up-date" style="border-color:${t.color}">
      <div class="up-d">${e.date.getDate()}</div>
      <div class="up-m">${e.date.toLocaleDateString("en-GB",{month:"short"})}</div>
    </div>
    <div class="up-body">
      <div class="up-title">${e.title}</div>
      <div class="row" style="gap:8px;margin-top:3px">
        <span class="up-tag" style="color:${t.color};border-color:${t.color}">${t.label}</span>
        <span class="faint" style="font-size:.8rem">${e.d} ${HIJRI_MONTHS[e.m-1]} · ${when}</span>
      </div>
    </div>
  </div>`;
}

function injectCss() {
  if (document.getElementById("cal-css")) return;
  const s=document.createElement("style"); s.id="cal-css";
  s.textContent=`
    .cal-today{text-align:center;padding:24px}
    .cal-hijri{font-size:2rem;font-weight:800;color:var(--gold);margin-top:4px}
    .up-row{display:flex;align-items:center;gap:14px;padding:14px}
    .up-date{flex:0 0 52px;text-align:center;border:1.5px solid;border-radius:12px;padding:6px 0}
    .up-d{font-size:1.4rem;font-weight:800;line-height:1}
    .up-m{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text-dim)}
    .up-title{font-weight:600;font-size:.98rem;line-height:1.35}
    .up-tag{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;border:1px solid;border-radius:6px;padding:1px 7px}
    .cal-legend{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin:22px 4px 4px}
    .cal-legend .lg{display:flex;align-items:center;gap:6px;font-size:.78rem;color:var(--text-dim)}
    .cal-legend i{width:10px;height:10px;border-radius:50%;display:inline-block}
  `;
  document.head.appendChild(s);
}
