import { CONFIG } from "../../config.js";

export const title = "About";

export function render(el) {
  const c = CONFIG.contact || {};
  const links = [
    c.website   && { label:"Website",   href:c.website,  icon:"🌐" },
    c.email     && { label:c.email,     href:`mailto:${c.email}`, icon:"✉️" },
    c.phone     && { label:c.phone,     href:`tel:${c.phone}`,    icon:"📞" },
    c.whatsapp  && { label:"WhatsApp",  href:c.whatsapp, icon:"💬" },
    c.instagram && { label:"Instagram", href:c.instagram, icon:"📷" },
  ].filter(Boolean);

  el.innerHTML = `
    <div class="card gold center mt8" style="padding:26px">
      <div style="font-size:2.2rem;color:var(--gold)">۞</div>
      <div style="font-weight:800;font-size:1.3rem;margin-top:6px">${CONFIG.centreNameFull}</div>
      <div class="muted" style="font-size:.9rem;margin-top:4px">${CONFIG.tagline}</div>
    </div>

    ${c.address?`<div class="card mt16"><div class="section-title" style="margin-top:0">Address</div>
      <div class="muted">${c.address}</div></div>`:""}

    ${links.length?`<div class="section-title">Contact</div>
      <div class="stack">${links.map(l=>`
        <a class="card row" style="text-decoration:none;color:inherit;gap:12px" href="${l.href}" target="_blank" rel="noopener">
          <span style="font-size:1.2rem">${l.icon}</span><span>${l.label}</span>
        </a>`).join("")}</div>`:
      `<div class="empty"><div class="em-ico">📇</div>Contact details coming soon.</div>`}

    <div class="faint center mt24" style="font-size:.78rem">Imam Hussain Community App · ${CONFIG.version}</div>
  `;
}
