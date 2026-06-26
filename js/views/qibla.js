import { CONFIG } from "../../config.js";

export const title = "Qibla";

const MECCA = { lat: 21.4225, lon: 39.8262 };
let bearing = null, heading = 0, listening = false, orientHandler = null;

function computeBearing(lat, lon) {
  const r = d => d*Math.PI/180, g = x => x*180/Math.PI;
  const f1=r(lat), f2=r(MECCA.lat), dl=r(MECCA.lon-lon);
  const y=Math.sin(dl)*Math.cos(f2);
  const x=Math.cos(f1)*Math.sin(f2)-Math.sin(f1)*Math.cos(f2)*Math.cos(dl);
  return (g(Math.atan2(y,x))+360)%360;
}
const iosPerm = () => typeof DeviceOrientationEvent!=="undefined" && typeof DeviceOrientationEvent.requestPermission==="function";

export function render(el) {
  injectCss();
  cleanup();
  el.innerHTML = `
    <div class="card qibla-card center mt8">
      <div class="muted" style="font-size:.85rem">Direction to the Holy Ka'bah</div>
      <div class="compass">
        <span class="cm n">N</span><span class="cm e">E</span><span class="cm s">S</span><span class="cm w">W</span>
        <div class="needle-wrap" id="needle">
          <div class="needle"></div><div class="needle-tail"></div>
        </div>
        <div class="dot"></div>
      </div>
      <div class="readout"><span id="deg">--</span>° <small>from North</small></div>
      <div class="faint" id="loc" style="font-size:.82rem;margin-top:4px">&nbsp;</div>
      <button class="btn block mt16" id="enable" hidden>Enable live compass</button>
      <div class="qstatus faint" id="status" style="font-size:.8rem;margin-top:10px"></div>
    </div>`;

  // immediately show direction from configured centre location, then refine via GPS
  setBearing(CONFIG.location.lat, CONFIG.location.lng, "centre");
  el.querySelector("#status").textContent = "Showing from the centre's location. Allow location for your exact Qibla.";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      p => setBearing(p.coords.latitude, p.coords.longitude, "you"),
      () => {}, { enableHighAccuracy:true, timeout:8000, maximumAge:600000 });
  }

  el.querySelector("#enable").addEventListener("click", async () => {
    try {
      const res = await DeviceOrientationEvent.requestPermission();
      if (res==="granted") startCompass();
    } catch {}
  });
}

function setBearing(lat, lon, who) {
  bearing = computeBearing(lat, lon);
  const deg = document.getElementById("deg"); if (!deg) return;
  deg.textContent = bearing.toFixed(1);
  document.getElementById("loc").textContent = `📍 ${lat.toFixed(3)}, ${lon.toFixed(3)}`;
  updateNeedle();
  if (iosPerm() && !listening) document.getElementById("enable").hidden = false;
  else if (!listening) startCompass();
}

function startCompass() {
  if (listening) return;
  const evt = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
  orientHandler = e => {
    let hd = null;
    if (typeof e.webkitCompassHeading === "number") hd = e.webkitCompassHeading;
    else if (e.absolute && typeof e.alpha === "number") hd = 360 - e.alpha;
    if (hd!=null) { heading = hd; updateNeedle(); }
  };
  window.addEventListener(evt, orientHandler, true);
  listening = true;
  const s = document.getElementById("status");
  if (s) s.textContent = "Hold the phone flat. Wave in a figure-8 to calibrate.";
  const b = document.getElementById("enable"); if (b) b.hidden = true;
}

function updateNeedle() {
  if (bearing==null) return;
  const n = document.getElementById("needle");
  if (n) n.style.transform = `rotate(${(bearing-heading+360)%360}deg)`;
}

function cleanup() {
  if (orientHandler) {
    window.removeEventListener("deviceorientationabsolute", orientHandler, true);
    window.removeEventListener("deviceorientation", orientHandler, true);
    orientHandler = null;
  }
  listening = false; heading = 0;
}

function injectCss() {
  if (document.getElementById("qb-css")) return;
  const s=document.createElement("style"); s.id="qb-css";
  s.textContent=`
    .qibla-card{padding:26px}
    .compass{position:relative;width:230px;height:230px;margin:22px auto;border-radius:50%;
      background:radial-gradient(circle,var(--surface-2),var(--green-700));border:2px solid var(--border)}
    .cm{position:absolute;font-weight:700;color:var(--text-dim);font-size:.85rem}
    .cm.n{top:8px;left:50%;transform:translateX(-50%);color:var(--gold)}
    .cm.s{bottom:8px;left:50%;transform:translateX(-50%)}
    .cm.e{right:10px;top:50%;transform:translateY(-50%)}
    .cm.w{left:10px;top:50%;transform:translateY(-50%)}
    .needle-wrap{position:absolute;inset:0;transition:transform .15s ease-out}
    .needle{position:absolute;left:50%;top:50%;width:6px;height:88px;margin-left:-3px;margin-top:-88px;
      background:linear-gradient(var(--gold),var(--gold-soft));border-radius:3px;
      clip-path:polygon(50% 0,100% 100%,0 100%)}
    .needle-tail{position:absolute;left:50%;top:50%;width:6px;height:70px;margin-left:-3px;
      background:var(--surface-2);border-radius:3px}
    .dot{position:absolute;left:50%;top:50%;width:16px;height:16px;margin:-8px;border-radius:50%;
      background:var(--gold);box-shadow:0 0 0 4px var(--bg)}
    .readout{font-size:1.6rem;font-weight:800;margin-top:6px}
    .readout small{font-size:.8rem;font-weight:500;color:var(--text-dim)}
  `;
  document.head.appendChild(s);
}
