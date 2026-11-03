// Faixa de conquistas: quatro destaques que entram em sequência, com sinais pulsando nos ícones
// e a contagem dos eventos subindo até 14.
import { FontSet, PALETTE, esc, measure, r, icon, keyframes } from './lib.mjs';

export const CONQUISTAS = [
  { icon: 'award', value: '1º lugar', text: 'Melhor Pitch na IV Mostra Semiárido Digital, no IFPI (2025).' },
  { icon: 'globe', value: 'Lisboa', text: 'Web Summit 2025, expondo o BeeCerrado para o mundo.' },
  { icon: 'book-open', value: 'Artigo', text: 'Empreendedorismo digital, na revista Lumen et Virtus (2026).' },
  { icon: 'presentation', value: '14', count: true, text: 'eventos, feiras e exposições desde 2022, de Picos a Lisboa.' },
];

function wrap(fontKey, text, size, maxW) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (measure(fontKey, next, size) > maxW && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export function conquistas(mode) {
  const c = PALETTE[mode];
  const fs = new FontSet();
  const W = 840;
  const GAP = 14;
  const TW = (W - 3 * GAP) / 4;
  const H = 200;
  let css = '';

  const tiles = CONQUISTAS.map((item, i) => {
    const x = r(i * (TW + GAP));
    const lines = wrap('sans', item.text, 13, TW - 40);
    lines.forEach((l) => fs.use('sans', l));
    fs.use('display', item.value);
    let value = `<text class="value" x="20" y="104">${esc(item.value)}</text>`;
    if (item.count) {
      const N = Number(item.value);
      fs.use('display', '0123456789');
      const step = 1300 / (N + 1);
      value = Array.from({ length: N + 1 }, (_, k) => {
        const name = `n${k}`;
        const stops = k === N ? [[0, 'opacity:0'], [k * step, 'opacity:1'], [1300, 'opacity:1']] : [[0, 'opacity:0'], [k * step, 'opacity:1'], [(k + 1) * step, 'opacity:0'], [1300, 'opacity:0']];
        css += keyframes(name, 1300, stops) + `.${name}{opacity:${k === N ? 1 : 0};animation:${name} 1.3s steps(1) .9s both}`;
        return `<text class="value ${name}" x="20" y="104">${k}</text>`;
      }).join('');
    }
    return `<g transform="translate(${x} 0)"><g class="in" style="animation-delay:${r(0.1 + i * 0.14, 2)}s">
<rect x="1" y="1" width="${r(TW - 2)}" height="${H - 2}" rx="20" fill="${c.canvas}" stroke="${c.hairline}" stroke-width="1.5"/>
<circle cx="38" cy="40" r="19" fill="${c.card}"/>
<circle class="ping" style="animation-delay:${r(1.6 + i * 1.1, 2)}s" cx="38" cy="40" r="19" fill="none" stroke="${c.accent}" stroke-width="1.5"/>
${icon(item.icon, 28, 30, 20, c.accentStrong, 1.9)}
${value}
${lines.map((l, k) => `<text class="desc" x="20" y="${r(134 + k * 18)}">${esc(l)}</text>`).join('')}
</g></g>`;
  });

  css = `
${fs.css()}
text{font-kerning:normal}
.value{font:500 38px CG;fill:${c.ink};letter-spacing:-.5px;font-variant-numeric:lining-nums}
.desc{font:400 13px IN;fill:${c.body}}
.in{animation:in .9s cubic-bezier(.16,1,.3,1) both}
@keyframes in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.ping{transform-box:fill-box;transform-origin:center;opacity:0;animation:ping 4.4s ease-out infinite}
@keyframes ping{0%{opacity:.9;transform:scale(1)}60%,100%{opacity:0;transform:scale(1.55)}}
${css}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.ping{display:none}}
`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
<title id="t">Conquistas</title>
<desc id="d">${CONQUISTAS.map((item) => `${item.value}: ${item.text}`).join(' ')}</desc>
<style>${css}</style>
${tiles.join('\n')}
</svg>
`;
}
