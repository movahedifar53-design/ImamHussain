import { CONFIG } from "../../config.js";

export const title = "Live Shrine";

export function render(el) {
  const { liveYouTubeVideoId: vid, liveYouTubeChannelId: ch, liveYouTubeHandle: handle } = CONFIG;
  const ytLink = handle ? `https://www.youtube.com/@${handle}/live`
              : ch ? `https://www.youtube.com/channel/${ch}/live`
              : `https://www.youtube.com/results?search_query=imam+hussain+holy+shrine+live`;

  // Prefer the channel's auto-resolving live feed (always the current broadcast,
  // never goes stale); fall back to a direct video embed.
  let src = null;
  if (ch) src = `https://www.youtube.com/embed/live_stream?channel=${ch}&autoplay=1&playsinline=1`;
  else if (vid) src = `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&playsinline=1`;

  injectCss();
  el.innerHTML = `
    <div class="live-wrap">
      <div class="live-frame-box">
        ${src ? `<iframe class="live-iframe" src="${src}" title="${CONFIG.liveTitle}"
            allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
          : `<div class="live-off">🕋<span>Live stream not configured</span></div>`}
      </div>
      <div class="live-meta">
        <div class="live-dot-row"><span class="live-dot"></span>${CONFIG.liveTitle}</div>
        <p class="muted live-note">Streaming around the clock from the Holy Shrine. If the player shows the stream as offline, it is between broadcasts, tap below to open the current live feed.</p>
        <a class="btn block" href="${ytLink}" target="_blank" rel="noopener">Watch live on YouTube ↗</a>
      </div>
    </div>`;
}

function injectCss() {
  if (document.getElementById("live-css")) return;
  const s = document.createElement("style"); s.id = "live-css";
  s.textContent = `
    .live-wrap{margin-top:10px}
    .live-frame-box{position:relative;width:100%;aspect-ratio:16/9;border-radius:var(--radius);
      overflow:hidden;background:#000;border:1px solid var(--border)}
    .live-iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
    .live-off{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
      justify-content:center;gap:8px;font-size:2.4rem;color:var(--text-dim)}
    .live-off span{font-size:.9rem}
    .live-meta{margin-top:16px}
    .live-dot-row{display:flex;align-items:center;gap:8px;font-weight:700;font-size:1.05rem;font-family:var(--font-display)}
    .live-dot{width:9px;height:9px;border-radius:50%;background:var(--red-bright);
      box-shadow:0 0 0 0 rgba(230,57,70,.6);animation:livepulse 1.8s infinite}
    @keyframes livepulse{0%{box-shadow:0 0 0 0 rgba(230,57,70,.55)}70%{box-shadow:0 0 0 10px rgba(230,57,70,0)}100%{box-shadow:0 0 0 0 rgba(230,57,70,0)}}
    .live-note{font-size:.86rem;line-height:1.55;margin:10px 0 16px}
  `;
  document.head.appendChild(s);
}
