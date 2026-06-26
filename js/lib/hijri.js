// ============================================================================
//  Offline Hijri (Islamic) calendar conversion — tabular "Kuwaiti" algorithm.
//  Round-trips Gregorian <-> Hijri via Julian Day Number.
//  Note: calculated dates may differ ±1 day from local moon-sighting; the app
//  applies CONFIG.hijriDayOffset to compensate.
// ============================================================================

export const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qa'dah", "Dhu al-Hijjah",
];

export const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// --- Gregorian <-> Julian Day Number (integer, Fliegel–Van Flandern) -------
export function gregToJDN(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy
    + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

export function jdnToGreg(jdn) {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

// --- Hijri <-> JDN ----------------------------------------------------------
// Exact inverse of jdnToHijri: estimate then refine so both directions agree.
export function hijriToJDN(y, m, d) {
  let jdn = 1948440 + Math.round((y - 1) * 354.367 + (m - 1) * 29.53 + d);
  for (let i = 0; i < 8; i++) {
    const h = jdnToHijri(jdn);
    const diff = (y - h.year) * 354 + (m - h.month) * 29.5 + (d - h.day);
    if (Math.abs(diff) < 1) break;
    jdn += Math.round(diff);
  }
  for (let i = 0; i < 40; i++) {           // exact step to the target day
    const h = jdnToHijri(jdn);
    const cmp = (h.year - y) || (h.month - m) || (h.day - d);
    if (cmp === 0) break;
    jdn += cmp > 0 ? -1 : 1;
  }
  return jdn;
}

export function jdnToHijri(jdn) {
  const l0 = jdn - 1948440 + 10632;
  const n = Math.floor((l0 - 1) / 10631);
  let l = l0 - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719)
          + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
        - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

// --- Convenience ------------------------------------------------------------
// offset: days to add before converting (moon-sighting adjustment).
export function toHijri(date, offset = 0) {
  const jdn = gregToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate()) + offset;
  return jdnToHijri(jdn);
}

export function hijriToDate(y, m, d, offset = 0) {
  const { year, month, day } = jdnToGreg(hijriToJDN(y, m, d) - offset);
  return new Date(year, month - 1, day);
}

export function formatHijri(h) {
  return `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year} AH`;
}
