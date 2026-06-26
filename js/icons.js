// Inline SVG icon set (stroke uses currentColor).
const s = (p) => `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${p}</svg>`;

export const ICON = {
  home:    s('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>'),
  prayer:  s('<path d="M12 2a4 4 0 0 1 4 4c0 2-1.5 3-1.5 5h-5C9.5 9 8 8 8 6a4 4 0 0 1 4-4z"/><path d="M5 21h14"/><path d="M7 21v-5h10v5"/>'),
  calendar:s('<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>'),
  programs:s('<path d="M3 11l14-6v14L3 13z"/><path d="M3 11v2"/><path d="M9 19a2 2 0 0 1-4 0v-5"/>'),
  more:    s('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
  dua:     s('<path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2z"/><path d="M19 18v3H6a2 2 0 0 1-2-2"/>'),
  live:    s('<rect x="2" y="5" width="14" height="14" rx="2"/><path d="M22 8l-6 4 6 4z"/>'),
  library: s('<path d="M4 4h5v16H4z"/><path d="M9 4h5v16H9z"/><path d="M14 5l4-1 3 15-4 1z"/>'),
  qibla:   s('<circle cx="12" cy="12" r="9"/><path d="M15 9l-2.5 5.5L8 17l2.5-5.5z"/>'),
  clock:   s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  pin:     s('<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
  info:    s('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
  bell:    s('<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>'),
  chevron: s('<path d="M9 6l6 6-6 6"/>'),
  book:    s('<path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2z"/><path d="M19 18v3H6a2 2 0 0 1-2-2"/>'),
};
