// Programs CMS: reads a published Google Sheet (CSV).
// Columns (header row, case-insensitive): Date | Time | Title | Location | Details | Image
import { CONFIG } from "../../config.js";

let _cache = null;

// Minimal RFC-4180-ish CSV parser (handles quotes, commas, newlines).
export function parseCSV(text) {
  const rows = []; let row = []; let field = ""; let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i+1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c === "\r") { /* skip */ }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim() !== ""));
}

function toObjects(rows) {
  if (!rows.length) return [];
  const head = rows[0].map(h => h.trim().toLowerCase());
  const idx = (name) => head.indexOf(name);
  const di = idx("date"), ti = idx("time"), tt = idx("title"),
        lo = idx("location"), de = idx("details"), im = idx("image");
  return rows.slice(1).map(r => ({
    rawDate: (r[di] || "").trim(),
    date: parseDate((r[di] || "").trim()),
    time: (r[ti] || "").trim(),
    title: (r[tt] || "").trim(),
    location: (lo >= 0 ? r[lo] || "" : "").trim(),
    details: (de >= 0 ? r[de] || "" : "").trim(),
    image: (im >= 0 ? r[im] || "" : "").trim(),
  })).filter(p => p.title);
}

// Accepts YYYY-MM-DD, DD/MM/YYYY, or DD-MM-YYYY.
function parseDate(s) {
  if (!s) return null;
  let m;
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) return new Date(+m[1], +m[2]-1, +m[3]);
  if ((m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/))) return new Date(+m[3], +m[2]-1, +m[1]);
  const d = new Date(s);
  return isNaN(d) ? null : d;
}

export async function loadPrograms(force = false) {
  if (_cache && !force) return _cache;
  if (!CONFIG.programsCsvUrl) { _cache = []; return _cache; }
  const res = await fetch(CONFIG.programsCsvUrl, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load programs");
  const text = await res.text();
  _cache = toObjects(parseCSV(text));
  return _cache;
}

export function upcomingPrograms(list, now = new Date()) {
  const start = new Date(now); start.setHours(0,0,0,0);
  return list
    .filter(p => p.date && p.date >= start)
    .sort((a,b) => a.date - b.date);
}

export function nextProgram(list, now = new Date()) {
  return upcomingPrograms(list, now)[0] || null;
}
