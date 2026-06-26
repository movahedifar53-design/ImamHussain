// ============================================================================
//  Router + shell. Each view is a module exporting { title, render(el) }.
// ============================================================================
import { CONFIG } from "../config.js";
import { ICON } from "./icons.js";

import * as Home     from "./views/home.js";
import * as Prayers  from "./views/prayers.js";
import * as Calendar from "./views/calendar.js";
import * as Programs from "./views/programs.js";
import * as More     from "./views/more.js";
import * as Dua      from "./views/dua.js";
import * as Live     from "./views/live.js";
import * as Library  from "./views/library.js";
import * as Qibla    from "./views/qibla.js";
import * as About    from "./views/about.js";

const ROUTES = {
  home: Home, prayers: Prayers, calendar: Calendar, programs: Programs,
  more: More, dua: Dua, live: Live, library: Library, qibla: Qibla, about: About,
};

// Bottom-nav items (the rest are reachable via "More").
const NAV = [
  { id: "home",     label: "Home",     icon: "home" },
  { id: "prayers",  label: "Prayers",  icon: "prayer" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
  { id: "programs", label: "Programs", icon: "programs" },
  { id: "more",     label: "More",     icon: "more" },
];
// Which nav tab is highlighted for a given route.
const NAV_FOR = { dua:"more", live:"more", library:"more", qibla:"more", about:"more" };

const viewEl   = document.getElementById("view");
const titleEl  = document.getElementById("appTitle");
const backBtn  = document.getElementById("backBtn");
const navbar   = document.getElementById("navbar");

function buildNav() {
  navbar.innerHTML = NAV.map(n => `
    <button class="navbtn" data-route="${n.id}">
      ${ICON[n.icon]}<span>${n.label}</span>
    </button>`).join("");
  navbar.querySelectorAll(".navbtn").forEach(b =>
    b.addEventListener("click", () => go(b.dataset.route)));
}

function setActiveNav(route) {
  const active = NAV_FOR[route] || route;
  navbar.querySelectorAll(".navbtn").forEach(b =>
    b.classList.toggle("active", b.dataset.route === active));
}

let current = null;
export function go(route, opts = {}) {
  const view = ROUTES[route] || ROUTES.home;
  current = route;
  if (!opts.noHash) location.hash = route + (opts.q ? "?" + opts.q : "");

  titleEl.textContent = view.title || CONFIG.centreName;
  backBtn.hidden = !(NAV_FOR[route]); // show back arrow on sub-pages
  setActiveNav(route);

  viewEl.innerHTML = `<div class="spinner"></div>`;
  // allow async renders
  Promise.resolve(view.render(viewEl, opts)).catch(err => {
    console.error(err);
    viewEl.innerHTML = `<div class="empty"><div class="em-ico">⚠️</div>Something went wrong.<br><span class="faint">${err.message}</span></div>`;
  });
  window.scrollTo(0, 0);
}

backBtn.addEventListener("click", () => {
  const back = NAV_FOR[current] || "home";
  go(back);
});

function routeFromHash() {
  const raw = location.hash.replace(/^#/, "");
  const [r] = raw.split("?");
  return ROUTES[r] ? r : "home";
}
window.addEventListener("hashchange", () => {
  const r = routeFromHash();
  if (r !== current) go(r, { noHash: true });
});

// Expose for inline handlers in views.
window.App = { go };

buildNav();
go(routeFromHash(), { noHash: true });

// --- Service worker (seamless auto-update) ----------------------------------
// New deploy -> sw.js VERSION changes -> update detected -> new worker installs
// and activates immediately -> controllerchange -> page reloads automatically.
// We also poll for updates on focus and every 60s so a long-open app refreshes.
if ("serviceWorker" in navigator && !location.search.includes("nosw")) {
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloaded) return; reloaded = true; location.reload();
  });

  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("sw.js");
      // If an updated worker is waiting, tell it to take over now.
      const promote = (w) => w && w.state === "installed" &&
        navigator.serviceWorker.controller && w.postMessage?.("skipWaiting");
      reg.addEventListener("updatefound", () => {
        const w = reg.installing;
        w && w.addEventListener("statechange", () => promote(w));
      });
      promote(reg.waiting);

      const check = () => reg.update().catch(() => {});
      setInterval(check, 60 * 1000);
      document.addEventListener("visibilitychange", () => { if (!document.hidden) check(); });
    } catch {}
  });
}
