export const title = "Dua & Ziyarat";

// The full Dua & Ziyarat app is bundled under /dua and shown in a frame so all
// of its content (7 duas, Arabic/Persian toggle, audio) works unchanged.
export function render(el) {
  el.innerHTML = `<iframe class="frame-full" src="dua/index.html" title="Dua & Ziyarat"></iframe>`;
  ensureFrameCss();
}

export function ensureFrameCss() {
  if (document.getElementById("frame-css")) return;
  const s=document.createElement("style"); s.id="frame-css";
  s.textContent=`.frame-full{position:fixed;left:50%;transform:translateX(-50%);
    top:calc(var(--safe-top) + 56px);width:100%;max-width:var(--maxw);
    height:calc(100vh - var(--safe-top) - 56px - var(--nav-h) - var(--safe-bottom));
    border:0;background:var(--bg)}`;
  document.head.appendChild(s);
}
