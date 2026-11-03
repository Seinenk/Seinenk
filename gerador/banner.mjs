// Banner do topo do perfil: nome, cargos sendo digitados e o monograma CM girando.
import { FontSet, PALETTE, HEX, CM_PATH, esc, measure, r, icon, discrete } from './lib.mjs';

export const ROLES = [
  'Desenvolvedor front-end',
  'Designer de UX/UI',
  'Diretor de tecnologia no Vale do Mel',
  'Sistemas embarcados e IoT',
  'Pesquisador em inovação',
];

export function banner(mode) {
  const c = PALETTE[mode];
  const fs = new FontSet();
  const W = 1200;
  const H = 420;

  // ---------- texto ----------
  const kicker = fs.use('sansBold', 'PORTFÓLIO · PIAUÍ, BRASIL');
  const first = fs.use('display', 'Carlos ');
  const middle = fs.use('displayItalic', 'Michael');
  const last = fs.use('display', 'da Silva Sousa');
  const site = fs.use('sansMedium', 'seinenk.github.io');
  ROLES.forEach((role) => fs.use('displayItalic', role));

  // ---------- cargos sendo digitados (SMIL, porque funciona em <img>) ----------
  const ROLE = { size: 38, x: 72, y: 318, type: 62, hold: 1900, del: 30, gap: 380, begin: 1400 };
  let clock = 0;
  const caretEvents = [[0, ROLE.x]];
  const roleTimelines = ROLES.map((role) => {
    const chars = [...role];
    const widths = chars.map((_, k) => measure('displayItalic', chars.slice(0, k + 1).join(''), ROLE.size));
    const events = [[clock, 0]];
    chars.forEach((_, k) => {
      const t = clock + (k + 1) * ROLE.type;
      events.push([t, r(widths[k] + 3)]);
      caretEvents.push([t, r(ROLE.x + widths[k] + 3)]);
    });
    const typed = clock + chars.length * ROLE.type;
    const delStart = typed + ROLE.hold;
    chars.forEach((_, k) => {
      const t = delStart + (k + 1) * ROLE.del;
      const left = chars.length - k - 1;
      const w = left > 0 ? widths[left - 1] + 3 : 0;
      events.push([t, r(w)]);
      caretEvents.push([t, r(ROLE.x + w)]);
    });
    clock = delStart + chars.length * ROLE.del + ROLE.gap;
    return events;
  });
  const cycle = clock;
  const roleClips = roleTimelines
    .map((events, i) => {
      const d = discrete(events, cycle);
      return `<clipPath id="rc${i}"><rect x="${ROLE.x - 4}" y="${ROLE.y - 40}" height="54" width="0"><animate attributeName="width" dur="${cycle}ms" begin="${ROLE.begin}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${d.keyTimes}" values="${d.values}"/></rect></clipPath>`;
    })
    .join('');
  const caret = discrete(caretEvents, cycle);

  // ---------- monograma ----------
  const M = { cx: 940, cy: 206, scale: 2.55 };
  const hexSize = 64 * M.scale;
  const ringText = fs.use('sansBold', 'UX/UI · FRONT-END · DESIGN · CÓDIGO · INOVAÇÃO · ');
  const ringR = 128;

  // ---------- selos flutuantes ----------
  const chips = [
    { text: 'ADS · IFPI', x: 694, y: 112, d: 0 },
    { text: 'Investe Piauí', x: 1004, y: 84, d: 1.4 },
    { text: 'Vale do Mel', x: 1010, y: 300, d: 2.6 },
  ].map((chip) => {
    fs.use('sansMedium', chip.text);
    const w = measure('sansMedium', chip.text, 15) + 50;
    return { ...chip, w };
  });

  const css = `
${fs.css()}
text{font-kerning:normal}
.kicker{font:600 14px IN;letter-spacing:2.2px;fill:${c.accentStrong}}
.name{font:500 106px CG;fill:${c.ink};letter-spacing:-2.2px}
.name .em{font-style:italic;fill:${c.accent}}
.last{font:500 42px CG;fill:${c.muted};letter-spacing:-.4px}
.role{font:italic 500 ${ROLE.size}px CG;fill:${c.accentStrong}}
.site{font:500 15px IN;fill:${c.muted}}
.chip-t{font:500 15px IN;fill:${c.ink}}
.ring-t{font:600 12.5px IN;letter-spacing:3px;fill:${c.ink}}
.in{animation:in 1s cubic-bezier(.16,1,.3,1) both}
.d1{animation-delay:.08s}.d2{animation-delay:.2s}.d3{animation-delay:.42s}.d4{animation-delay:.6s}.d5{animation-delay:.9s}.d6{animation-delay:1.1s}
@keyframes in{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
.pop{animation:pop 1.1s cubic-bezier(.34,1.56,.64,1) .35s both;transform-origin:${M.cx}px ${M.cy}px}
@keyframes pop{from{opacity:0;transform:scale(.6) rotate(-20deg)}to{opacity:1;transform:none}}
.aura-a{animation:driftA 16s ease-in-out infinite alternate;transform-origin:1010px 70px}
.aura-b{animation:driftB 22s ease-in-out infinite alternate;transform-origin:150px 440px}
@keyframes driftA{to{transform:translate(-60px,40px) scale(1.12)}}
@keyframes driftB{to{transform:translate(70px,-30px) scale(1.15)}}
.spin{animation:spin 36s linear infinite;transform-origin:${M.cx}px ${M.cy}px}
.orbit{animation:spin 9s linear infinite reverse;transform-origin:${M.cx}px ${M.cy}px}
@keyframes spin{to{transform:rotate(360deg)}}
.float{animation:float 6s ease-in-out infinite}
@keyframes float{50%{transform:translateY(-9px)}}
.caret{animation:blink 1.05s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.hex-pulse{animation:hexPulse 4.8s ease-in-out infinite;transform-origin:32px 32px}
@keyframes hexPulse{50%{transform:scale(1.035)}}
.roles-static{display:none}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.roles-anim{display:none}.roles-static{display:inline}}
`;

  const hexPattern = `<pattern id="hex" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(.9)"><path d="M28 66 0 50V16L28 0l28 16v34L28 66v34" fill="none" stroke="${c.hairline}" stroke-width="1.2"/></pattern>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
<title id="t">Carlos Michael da Silva Sousa</title>
<desc id="d">Desenvolvedor front-end, designer de UX/UI, diretor de tecnologia no Vale do Mel e assessor técnico na Investe Piauí. Portfólio em seinenk.github.io.</desc>
<style>${css}</style>
<defs>
<clipPath id="card"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="28"/></clipPath>
<radialGradient id="ga"><stop offset="0" stop-color="${c.glowA}" stop-opacity=".6"/><stop offset="1" stop-color="${c.glowA}" stop-opacity="0"/></radialGradient>
<radialGradient id="gb"><stop offset="0" stop-color="${c.glowB}" stop-opacity=".26"/><stop offset="1" stop-color="${c.glowB}" stop-opacity="0"/></radialGradient>
<radialGradient id="hm"><stop offset=".15" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<mask id="hexmask"><rect width="${W}" height="${H}" fill="url(#hm)" transform="translate(560 -40) scale(.55 1.1)"/></mask>
${hexPattern}
<path id="ringpath" d="M${M.cx} ${M.cy}m-${ringR} 0a${ringR} ${ringR} 0 1 1 ${ringR * 2} 0a${ringR} ${ringR} 0 1 1 -${ringR * 2} 0"/>
<filter id="sh" x="-20%" y="-40%" width="140%" height="180%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#181722" flood-opacity="${mode === 'dark' ? 0.45 : 0.12}"/></filter>
${roleClips}
</defs>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="28" fill="${c.canvas}" stroke="${c.hairline}" stroke-width="2"/>
<g clip-path="url(#card)">
  <circle class="aura-a" cx="1010" cy="70" r="380" fill="url(#ga)"/>
  <circle class="aura-b" cx="150" cy="440" r="400" fill="url(#gb)"/>
  <rect width="${W}" height="${H}" fill="url(#hex)" mask="url(#hexmask)"/>
</g>

<g class="in d1"><line x1="72" y1="96" x2="104" y2="96" stroke="${c.accentStrong}" stroke-width="1.5"/><text class="kicker" x="118" y="101">${esc(kicker)}</text></g>
<text class="name in d2" x="66" y="204">${esc(first)}<tspan class="em">${esc(middle)}</tspan></text>
<text class="last in d3" x="72" y="254">${esc(last)}</text>

<g class="in d4">
  <g class="roles-anim">
    ${ROLES.map((role, i) => `<g clip-path="url(#rc${i})"><text class="role" x="${ROLE.x}" y="${ROLE.y}">${esc(role)}</text></g>`).join('')}
    <rect class="caret" x="${ROLE.x}" y="${ROLE.y - 31}" width="2.5" height="38" fill="${c.accentStrong}"><animate attributeName="x" dur="${cycle}ms" begin="${ROLE.begin}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${caret.keyTimes}" values="${caret.values}"/></rect>
  </g>
  <text class="role roles-static" x="${ROLE.x}" y="${ROLE.y}">${esc(ROLES[0])}</text>
</g>

<g class="in d5">
  ${icon('arrow-up-right', 72, 354, 18, c.muted, 2)}
  <text class="site" x="98" y="368">${esc(site)}</text>
</g>

<g class="pop">
  <circle cx="${M.cx}" cy="${M.cy}" r="152" fill="none" stroke="${c.hairline}" stroke-width="1.5" stroke-dasharray="2 9"/>
  <g class="spin"><text class="ring-t"><textPath href="#ringpath" textLength="${r(2 * Math.PI * ringR - 6)}">${esc(ringText)}</textPath></text></g>
  <g class="orbit"><circle cx="${M.cx + 152}" cy="${M.cy}" r="5" fill="${c.accent}"/></g>
  <g transform="translate(${r(M.cx - hexSize / 2)} ${r(M.cy - hexSize / 2)}) scale(${M.scale})">
    <g class="hex-pulse">
      <path d="${HEX}" fill="${c.ink}"/>
      <path d="${CM_PATH}" fill="${c.canvas}"/>
    </g>
  </g>
</g>

${chips
  .map(
    (chip, i) => `<g class="in d6" style="animation-delay:${1 + i * 0.15}s"><g class="float" style="animation-delay:${chip.d}s" filter="url(#sh)">
  <rect x="${chip.x}" y="${chip.y}" width="${r(chip.w)}" height="38" rx="19" fill="${c.raised}" stroke="${c.hairline}"/>
  <path d="${HEX}" transform="translate(${chip.x + 14} ${chip.y + 11}) scale(.25)" fill="${c.accent}"/>
  <text class="chip-t" x="${chip.x + 34}" y="${chip.y + 24.5}">${esc(chip.text)}</text>
</g></g>`,
  )
  .join('\n')}
</svg>
`;
}
