// Shia events helper: load dataset, find today's events, list upcoming ones.
import { CONFIG } from "../../config.js";
import { toHijri, hijriToDate, jdnToHijri, gregToJDN, HIJRI_MONTHS } from "./hijri.js";

let _events = null;
export async function loadEvents() {
  if (_events) return _events;
  const res = await fetch("data/calendar-events.json");
  const json = await res.json();
  _events = json.events;
  return _events;
}

export const TYPE_META = {
  martyrdom: { label: "Martyrdom", color: "#E63946", glyph: "🕯️" },
  birth:     { label: "Birth",     color: "#EBE6DD", glyph: "🌙" },
  eid:       { label: "Eid",       color: "#E0A33A", glyph: "✨" },
  event:     { label: "Event",     color: "#9AA0A6", glyph: "📿" },
};

const off = () => CONFIG.hijriDayOffset || 0;

export function hijriToday(now = new Date()) {
  return toHijri(now, off());
}

// Events occurring on a given Gregorian date.
export function eventsOn(events, date) {
  const h = toHijri(date, off());
  return events.filter(e => e.m === h.month && e.d === h.day);
}

// Next N upcoming events from `now` (each resolved to its next Gregorian date).
export function upcoming(events, now = new Date(), n = 12) {
  const h = hijriToday(now);
  const todayJDN = gregToJDN(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const out = [];
  for (const e of events) {
    // try this Hijri year, else next
    let y = h.year;
    let date = hijriToDate(y, e.m, e.d, off());
    let jdn = gregToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
    if (jdn < todayJDN) {
      y += 1;
      date = hijriToDate(y, e.m, e.d, off());
      jdn = gregToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }
    out.push({ ...e, date, daysLeft: jdn - todayJDN, hijriYear: y });
  }
  out.sort((a, b) => a.daysLeft - b.daysLeft);
  return out.slice(0, n);
}

export { HIJRI_MONTHS };
