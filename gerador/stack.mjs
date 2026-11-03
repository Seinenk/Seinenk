// Faixa de tecnologias: duas fileiras que deslizam em sentidos opostos.
import { createRequire } from 'node:module';
import { FontSet, PALETTE, esc, measure, r, icon } from './lib.mjs';

const require = createRequire(import.meta.url);
const si = require('simple-icons');

const brand = (slug) => si[`si${slug[0].toUpperCase()}${slug.slice(1)}`];

// O que aparece nos repositórios e no currículo de Carlos.
export const ROWS = [
  [
    ['astro', 'Astro'],
    ['typescript', 'TypeScript'],
    ['javascript', 'JavaScript'],
    ['react', 'React'],
    ['nextdotjs', 'Next.js'],
    ['html5', 'HTML'],
    ['css', 'CSS'],
    ['figma', 'Figma'],
    ['wordpress', 'WordPress'],
    ['flutter', 'Flutter'],
    ['dart', 'Dart'],
    ['vercel', 'Vercel'],
  ],
  [
    ['python', 'Python'],
    ['fastapi', 'FastAPI'],
    ['c', 'C'],
    ['raspberrypi', 'Raspberry Pi Pico W'],
    ['lucide:cpu', 'FreeRTOS'],
    ['openjdk', 'Java'],
    ['pytest', 'pytest'],
    ['git', 'Git'],
    ['githubactions', 'GitHub Actions'],
    ['openrouter', 'OpenRouter'],
    ['lucide:radio', 'IoT'],
  ],
];

export function stack(mode) {
  const c = PALETTE[mode];
  const fs = new FontSet();
  const W = 840;
  const H = 132;
  const PILL = { h: 42, padL: 14, icon: 18, gap: 9, padR: 17, space: 12, size: 14.5 };

  const rows = ROWS.map((items, i) => {
    let x = 0;
    const pills = items.map(([slug, label]) => {
      fs.use('sansMedium', label);
      const w = PILL.padL + PILL.icon + PILL.gap + measure('sansMedium', label, PILL.size) + PILL.padR;
      const glyph = slug.startsWith('lucide:')
        ? icon(slug.slice(7), r(x + PILL.padL), (PILL.h - PILL.icon) / 2, PILL.icon, c.accentStrong, 2)
        : `<path transform="translate(${r(x + PILL.padL)} ${(PILL.h - PILL.icon) / 2}) scale(${PILL.icon / 24})" d="${brand(slug).path}" fill="${c.accentStrong}"/>`;
      const out = `<rect x="${r(x + 0.5)}" y=".5" width="${r(w - 1)}" height="${PILL.h - 1}" rx="${(PILL.h - 1) / 2}" fill="${c.raised}" stroke="${c.hairline}"/>${glyph}<text class="t" x="${r(x + PILL.padL + PILL.icon + PILL.gap)}" y="${PILL.h / 2 + 5.2}">${esc(label)}</text>`;
      x += w + PILL.space;
      return out;
    });
    return { set: pills.join(''), width: r(x), y: 10 + i * (PILL.h + 18) };
  });

  const speed = 34; // px por segundo
  const css = `
${fs.css()}
.t{font:500 ${PILL.size}px IN;fill:${c.ink};font-kerning:normal}
.r0{animation:r0 ${r(rows[0].width / speed, 1)}s linear infinite}
.r1{animation:r1 ${r(rows[1].width / speed, 1)}s linear infinite}
@keyframes r0{from{transform:translateX(0)}to{transform:translateX(-${rows[0].width}px)}}
@keyframes r1{from{transform:translateX(-${rows[1].width}px)}to{transform:translateX(0)}}
@media (prefers-reduced-motion:reduce){.r0,.r1{animation:none}.r1{transform:translateX(-${r(rows[1].width / 3)}px)}}
`;

  const all = ROWS.flat().map(([, label]) => label).join(', ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t">
<title id="t">Tecnologias: ${esc(all)}</title>
<style>${css}</style>
<defs>
<linearGradient id="fade"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".09" stop-color="#fff"/><stop offset=".91" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="m"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
</defs>
<g mask="url(#m)">
${rows.map((row, i) => `<g transform="translate(0 ${row.y})"><g class="r${i}">${row.set}<g transform="translate(${row.width} 0)">${row.set}</g></g></g>`).join('\n')}
</g>
</svg>
`;
}
