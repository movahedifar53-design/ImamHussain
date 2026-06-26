import { CONFIG } from "../../config.js";
import { ensureFrameCss } from "./dua.js";

export const title = "Live Shrine";

export function render(el) {
  const { liveYouTubeVideoId: vid, liveYouTubeChannelId: ch } = CONFIG;
  let src = null;
  if (vid) src = `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&playsinline=1`;
  else if (ch) src = `https://www.youtube.com/embed/live_stream?channel=${ch}&autoplay=1`;

  if (src) {
    el.innerHTML = `
      <iframe class="frame-full" src="${src}" title="${CONFIG.liveTitle}"
        allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    ensureFrameCss();
  } else {
    el.innerHTML = `
      <div class="card gold center mt16" style="padding:28px">
        <div style="font-size:2.4rem">🕋</div>
        <div style="font-weight:700;font-size:1.15rem;margin-top:8px">${CONFIG.liveTitle}</div>
        <p class="muted mt8" style="font-size:.9rem">The live stream isn't linked yet. Add a YouTube live video or channel id in <code>config.js</code>.</p>
        <a class="btn block mt16" target="_blank" rel="noopener"
           href="https://www.youtube.com/results?search_query=imam+hussain+holy+shrine+live+karbala">
           Watch on YouTube ↗</a>
      </div>`;
  }
}
