// ============================================================================
//  IMAM HUSSAIN COMMUNITY APP — CONFIGURATION
//  Edit everything about the centre here. No other file needs touching.
// ============================================================================

export const CONFIG = {
  // --- Identity -------------------------------------------------------------
  centreName: "Imam Hussain",
  centreNameFull: "Imam Hussain Community Centre",
  tagline: "ﷺ A community in the love of Ahl al-Bayt",
  city: "Birmingham",            // used for the home greeting

  // --- Prayer times ---------------------------------------------------------
  // Cities available in the Prayers tab. `data` points to a JSON in /data.
  prayerCities: [
    { id: "birmingham", name: "Birmingham", data: "data/data_birmingham.json" },
    { id: "london",     name: "London",     data: "data/data_london.json" },
  ],
  defaultCity: "birmingham",

  // Qibla: coordinates of the centre (used by the compass).
  // Birmingham city centre by default — update to the centre's exact location.
  location: { lat: 52.4862, lng: -1.8904 },

  // --- Programs / Announcements (Google Sheet CMS) --------------------------
  // Publish a Google Sheet to the web as CSV and paste the link here.
  // File > Share > Publish to web > (sheet) > Comma-separated values (.csv)
  // Columns expected: Date | Time | Title | Location | Details | Image
  programsCsvUrl: "",            // <-- PASTE PUBLISHED CSV URL HERE

  // --- Live shrine stream ---------------------------------------------------
  // In-app video player (no YouTube). Paste a direct video stream URL you trust
  // (HLS .m3u8 preferred; .mp4 also works) to enable the Live tab. Leave blank
  // to show a tasteful "coming soon" placeholder.
  liveStreamUrl: "",
  liveTitle: "Imam Hussain Holy Shrine — Karbala (Live)",

  // --- Dua & Ziyarat --------------------------------------------------------
  // The Dua app (with audio) is served from its own deployment to keep this
  // repo lean. Falls back to the bundled copy if left blank.
  duaUrl: "https://movahedifar53-design.github.io/DuaZiyarat-PWA/",

  // --- Shia calendar --------------------------------------------------------
  // ±days adjustment if the centre follows moon-sighting that differs
  // from the calculated (tabular) Hijri date.
  hijriDayOffset: 0,

  // --- Library --------------------------------------------------------------
  // Books appear here. Add { title, author, lang, file } entries; drop the PDF
  // in /assets/library/. Leave empty to show "coming soon".
  library: [
    // { title: "Nahj al-Balagha", author: "Imam Ali (a)", lang: "EN", file: "assets/library/nahj.pdf" },
  ],

  // --- Contact / social (shown in About) ------------------------------------
  contact: {
    address: "",
    phone: "",
    email: "",
    website: "",
    instagram: "",
    whatsapp: "",
  },

  // --- App ------------------------------------------------------------------
  version: "v1",
};
