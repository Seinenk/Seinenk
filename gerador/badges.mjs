// Selos de contato (um SVG por link), com um brilho que atravessa cada selo em momentos diferentes.
import { createRequire } from 'node:module';
import { FontSet, PALETTE, HEX, esc, measure, r, icon } from './lib.mjs';

const require = createRequire(import.meta.url);
const si = require('simple-icons');

export const BADGES = [
  { slug: 'portfolio', label: 'Portfólio', glyph: 'hex', href: 'https://seinenk.github.io' },
  { slug: 'linkedin', label: 'LinkedIn', glyph: 'lucide:briefcase', href: 'https://www.linkedin.com/in/carlos-michael-da-silva-sousa-319370336' },
  { slug: 'instagram', label: 'Instagram', glyph: 'si:siInstagram', href: 'https://www.instagram.com/carlosmichaels_/' },
  { slug: 'lattes', label: 'Lattes', glyph: 'lucide:graduation-cap', href: 'http://lattes.cnpq.br/7665168854776714' },
  { slug: 'orcid', label: 'ORCID', glyph: 'si:siOrcid', href: 'https://orcid.org/0009-0000-8549-7762' },
  { slug: 'email', label: 'E-mail', glyph: 'lucide:mail', href: 'mailto:carlosmaykesilva@gmail.com' },
];

export function badge(b, index, mode) {
  const c = PALETTE[mode];
  const fs = new FontSet();
  const label = fs.use('sansMedium', b.label);
  const H = 38;
  const ICON = 16;
  const W = r(16 + ICON + 9 + measure('sansMedium', label, 14) + 18);
  const color = c.accentStrong;
  let glyph;
  if (b.glyph === 'hex') glyph = `<path transform="translate(15 ${(H - 18) / 2}) scale(${18 / 64})" d="${HEX}" fill="${c.ink}"/>`;
  else if (b.glyph.startsWith('si:')) glyph = `<path transform="translate(16 ${(H - ICON) / 2}) scale(${ICON / 24})" d="${si[b.glyph.slice(3)].path}" fill="${color}"/>`;
  else glyph = icon(b.glyph.slice(7), 16, (H - ICON) / 2, ICON, color, 2);

  const delay = r(0.15 + index * 0.09, 2);
  const shine = r(2.4 + index * 0.55, 2);
  const css = `
${fs.css()}
.t{font:500 14px IN;fill:${c.ink};font-kerning:normal}
.in{animation:in .8s cubic-bezier(.16,1,.3,1) ${delay}s both}
@keyframes in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.shine{animation:shine 7s ease-in-out ${shine}s infinite}
@keyframes shine{0%{transform:translateX(-70px) skewX(-20deg)}22%,100%{transform:translateX(${W + 40}px) skewX(-20deg)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.shine{display:none}}
`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t">
<title id="t">${esc(b.label)}</title>
<style>${css}</style>
<defs><clipPath id="p"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${(H - 2) / 2}"/></clipPath>
<linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${mode === 'dark' ? '#fff' : c.glowA}" stop-opacity="0"/><stop offset=".5" stop-color="${mode === 'dark' ? '#fff' : c.glowA}" stop-opacity="${mode === 'dark' ? 0.14 : 0.75}"/><stop offset="1" stop-color="${mode === 'dark' ? '#fff' : c.glowA}" stop-opacity="0"/></linearGradient></defs>
<g class="in">
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${(H - 2) / 2}" fill="${c.raised}" stroke="${c.hairline}" stroke-width="1.5"/>
<g clip-path="url(#p)"><rect class="shine" x="0" y="-10" width="46" height="${H + 20}" fill="url(#g)"/></g>
${glyph}<text class="t" x="${16 + ICON + 9}" y="${H / 2 + 5}">${esc(label)}</text>
</g>
</svg>
`;
}
