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
    { id: "toronto",    name: "Toronto",    data: "data/data_toronto.json" },
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
  // YouTube video OR channel id for the Karbala live stream.
  liveYouTubeVideoId: "",        // e.g. a specific live video id
  liveYouTubeChannelId: "",      // fallback: channel's current live
  liveTitle: "Imam Hussain Holy Shrine — Karbala (Live)",

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
