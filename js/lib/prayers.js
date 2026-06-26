// Prayer-times data helper. Data files are arrays of {month,day,dawn,...}.
import { CONFIG } from "../../config.js";

export const PRAYER_ROWS = [
  { key: "dawn",     name: "Fajr",          prayer: true },
  { key: "sunrise",  name: "Sunrise",       prayer: false },
  { key: "noon",     name: "Dhuhr",         prayer: true },
  { key: "sunset",   name: "Sunset",        prayer: false },
  { key: "maghrib",  name: "Maghrib",       prayer: true },
  { key: "midnight", name: "Midnight",      prayer: false },
];

const cache = {};

export function cityById(id) {
  return CONFIG.prayerCities.find(c => c.id === id) || CONFIG.prayerCities[0];
}

export async function loadCity(id) {
  if (cache[id]) return cache[id];
  const city = cityById(id);
  const res = await fetch(city.data);
  const json = await res.json();
  const arr = Array.isArray(json) ? json : Object.values(json);
  cache[id] = arr;
  return arr;
}

export function findDay(arr, date) {
  const m = date.getMonth() + 1, d = date.getDate();
  return arr.find(p => p.month === m && p.day === d) || null;
}

// Returns { name, time, at:Date, minsLeft } for the next upcoming prayer today,
// or first prayer tomorrow if the day is over.
export function nextPrayer(arr, now = new Date()) {
  const today = findDay(arr, now);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const prayers = PRAYER_ROWS.filter(r => r.prayer);
  if (today) {
    for (const r of prayers) {
      const [h, m] = today[r.key].split(":").map(Number);
      const pm = h * 60 + m;
      if (pm > nowMins) {
        const at = new Date(now); at.setHours(h, m, 0, 0);
        return { name: r.name, time: today[r.key], at, minsLeft: pm - nowMins };
      }
    }
  }
  // wrap to tomorrow's Fajr
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
  const td = findDay(arr, tomorrow);
  if (td) {
    const [h, m] = td.dawn.split(":").map(Number);
    const at = new Date(tomorrow); at.setHours(h, m, 0, 0);
    return { name: "Fajr", time: td.dawn, at, minsLeft: Math.round((at - now) / 60000) };
  }
  return null;
}

export function countdownText(at, now = new Date()) {
  let s = Math.max(0, Math.floor((at - now) / 1000));
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60);   s -= m * 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
