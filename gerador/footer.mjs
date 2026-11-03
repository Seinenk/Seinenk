// Rodapé: agradecimento, favo de mel que acende em onda e uma abelha de passagem
// (um aceno ao Vale do Mel e ao Bee Sense).
import { FontSet, PALETTE, esc, r, HEX, CM_PATH } from './lib.mjs';

function bee(c, animated) {
  const wing = (cls, cx, cy, rx, ry, rot) =>
    `<g class="${animated ? cls : ''}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy + ry})" fill="${c.raised}" fill-opacity=".9" stroke="${c.accent}" stroke-width="1.1"/></g>`;
  return `<g>
${wing('wing-b', -3, -9, 5.2, 8.4, -18)}
<ellipse cx="0" cy="0" rx="11" ry="7.4" fill="${c.ink}"/>
<g clip-path="url(#body)"><rect x="-4.6" y="-8" width="3.2" height="16" fill="${c.glowA}"/><rect x="1.6" y="-8" width="3.2" height="16" fill="${c.glowA}"/></g>
<circle cx="11.5" cy="-1" r="5" fill="${c.ink}"/><circle cx="13.6" cy="-2.2" r="1.25" fill="${c.canvas}"/>
<path d="M-10.6-1.6-15.5 0l4.9 1.6Z" fill="${c.ink}"/>
<path d="M13 -5.6q1.6-4.4 4.8-5.2M10.6-5.8q-.2-4.6 2.4-6.6" fill="none" stroke="${c.ink}" stroke-width="1.1" stroke-linecap="round"/>
${wing('wing-f', 3, -10, 5.6, 9, 14)}
</g>`;
}

export function footer(mode) {
  const c = PALETTE[mode];
  const fs = new FontSet();
  const W = 840;
  const H = 230;

  const thanks = fs.use('displayItalic', 'Obrigado pela visita');
  const line = fs.use('sans', 'Do Piauí para o mundo · seinenk.github.io');
  const kicker = fs.use('sansBold', 'ATÉ A PRÓXIMA');

  // favo de mel (hexágonos com o vértice para cima)
  const R = 17;
  const hw = Math.sqrt(3) * R;
  const hexes = [];
  for (let row = 0; row < 4; row++) {
    const y = 168 + row * 1.5 * R;
    for (let col = -1; col * hw < W + hw; col++) {
      const x = col * hw + (row % 2 ? hw / 2 : 0);
      const pts = [0, 60, 120, 180, 240, 300].map((a) => {
        const rad = ((a - 90) * Math.PI) / 180;
        return `${r(x + (R - 1.2) * Math.cos(rad), 1)} ${r(y + (R - 1.2) * Math.sin(rad), 1)}`;
      });
      const delay = r(-(9 - (col * 0.16 + row * 0.38)) % 9, 2);
      hexes.push(`<path class="hx" style="animation-delay:${delay}s" d="M${pts.join('L')}Z"/>`);
    }
  }

  const flight = 'M-60 110C60 60 160 60 215 120S280 200 360 196 560 200 630 150 760 60 900 90';

  const css = `
${fs.css()}
text{font-kerning:normal}
.thanks{font:italic 500 46px CG;fill:${c.ink};letter-spacing:-.6px}
.line{font:400 15px IN;fill:${c.muted}}
.kicker{font:600 12.5px IN;letter-spacing:2.4px;fill:${c.accentStrong}}
.hx{fill:${c.glowB};fill-opacity:0;stroke:${c.hairline};stroke-width:1.2;animation:hx 9s ease-in-out infinite}
@keyframes hx{0%,100%{fill-opacity:0}45%{fill-opacity:${mode === 'dark' ? 0.34 : 0.22}}}
.in{animation:in 1s cubic-bezier(.16,1,.3,1) both}.d1{animation-delay:.1s}.d2{animation-delay:.25s}.d3{animation-delay:.4s}
@keyframes in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.wing-f,.wing-b{transform-box:fill-box;transform-origin:50% 100%;animation:flap .11s linear infinite alternate}
.wing-b{animation-delay:-.05s}
@keyframes flap{to{transform:scaleY(.3)}}
.bob{animation:bob 1.6s ease-in-out infinite}
@keyframes bob{50%{transform:translateY(-5px)}}
.aura{animation:drift 18s ease-in-out infinite alternate;transform-origin:420px 230px}
@keyframes drift{to{transform:translate(40px,-20px) scale(1.15)}}
.static{display:none}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.anim{display:none}.static{display:inline}}
`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t">
<title id="t">Obrigado pela visita. Do Piauí para o mundo: seinenk.github.io</title>
<style>${css}</style>
<defs>
<clipPath id="card"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="24"/></clipPath>
<clipPath id="body"><ellipse cx="0" cy="0" rx="11" ry="7.4"/></clipPath>
<radialGradient id="ga"><stop offset="0" stop-color="${c.glowA}" stop-opacity=".7"/><stop offset="1" stop-color="${c.glowA}" stop-opacity="0"/></radialGradient>
<linearGradient id="fadeY" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
<mask id="hm"><rect width="${W}" height="${H}" fill="url(#fadeY)"/></mask>
<path id="flight" d="${flight}"/>
</defs>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="24" fill="${c.canvas}" stroke="${c.hairline}" stroke-width="2"/>
<g clip-path="url(#card)">
  <ellipse class="aura" cx="420" cy="230" rx="460" ry="200" fill="url(#ga)"/>
  <g mask="url(#hm)">${hexes.join('')}</g>
</g>
<g transform="translate(${W / 2 - 14} 30) scale(.4375)"><path d="${HEX}" fill="${c.ink}"/><path d="${CM_PATH}" fill="${c.canvas}"/></g>
<text class="kicker in d1" x="${W / 2}" y="78" text-anchor="middle">${esc(kicker)}</text>
<text class="thanks in d2" x="${W / 2}" y="124" text-anchor="middle">${esc(thanks)}</text>
<text class="line in d3" x="${W / 2}" y="154" text-anchor="middle">${esc(line)}</text>
<g class="anim"><g><animateMotion dur="15s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear"><mpath href="#flight"/></animateMotion><g class="bob">${bee(c, true)}</g></g></g>
<g class="static" transform="translate(712 76) rotate(-12)">${bee(c, false)}</g>
</svg>
`;
}
