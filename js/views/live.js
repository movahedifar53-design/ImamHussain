import { CONFIG } from "../../config.js";

export const title = "Live Shrine";

export function render(el) {
  const url = CONFIG.liveStreamUrl;
  injectCss();

  if (!url) {
    el.innerHTML = `
      <div class="live-wrap">
        <div class="card gold live-soon center">
          <div class="live-crest">🕋</div>
          <div class="live-soon-t">${CONFIG.liveTitle}</div>
          <p class="muted live-note">The live broadcast from the Holy Shrine will appear here soon, inshaAllah.</p>
        </div>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="live-wrap">
      <div class="live-frame-box">
        <video id="liveVideo" class="live-video" controls autoplay muted playsinline
               poster="" preload="auto"></video>
      </div>
      <div class="live-meta">
        <div class="live-dot-row"><span class="live-dot"></span>${CONFIG.liveTitle}</div>
        <p class="muted live-note">Streaming from the Holy Shrine. If it does not start, check your connection.</p>
      </div>
    </div>`;

  startStream(el.querySelector("#liveVideo"), url);
}

function startStream(video, url) {
  if (!video) return;
  const isHls = /\.m3u8(\?|$)/i.test(url);
  // Safari / iOS play HLS natively.
  if (!isHls || video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = url;
    video.play?.().catch(() => {});
    return;
  }
  // Others: load hls.js on demand.
  const go = () => {
    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({ liveDurationInfinity: true });
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url; // last resort
    }
    video.play?.().catch(() => {});
  };
  if (window.Hls) { go(); return; }
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";
  s.onload = go;
  s.onerror = () => { video.src = url; };
  document.head.appendChild(s);
}

function injectCss() {
  if (document.getElementById("live-css")) return;
  const s = document.createElement("style"); s.id = "live-css";
  s.textContent = `
    .live-wrap{margin-top:10px}
    .live-frame-box{position:relative;width:100%;aspect-ratio:16/9;border-radius:var(--radius);
      overflow:hidden;background:#000;border:1px solid var(--border)}
    .live-video{position:absolute;inset:0;width:100%;height:100%;background:#000}
    .live-meta{margin-top:16px}
    .live-dot-row{display:flex;align-items:center;gap:8px;font-weight:700;font-size:1.1rem;font-family:var(--font-display)}
    .live-dot{width:9px;height:9px;border-radius:50%;background:var(--red-bright);
      box-shadow:0 0 0 0 rgba(230,57,70,.6);animation:livepulse 1.8s infinite}
    @keyframes livepulse{0%{box-shadow:0 0 0 0 rgba(230,57,70,.55)}70%{box-shadow:0 0 0 10px rgba(230,57,70,0)}100%{box-shadow:0 0 0 0 rgba(230,57,70,0)}}
    .live-note{font-size:.86rem;line-height:1.55;margin-top:10px}
    .live-soon{padding:48px 24px;margin-top:10px}
    .live-crest{font-size:3rem;filter:drop-shadow(0 4px 16px rgba(230,57,70,.4))}
    .live-soon-t{font-family:var(--font-display);font-size:1.5rem;font-weight:700;margin-top:12px}
  `;
  document.head.appendChild(s);
}
