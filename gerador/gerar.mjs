// Gera todos os SVGs do perfil em ../assets e as fontes do cartão de atividade.
//   npm ci && pip install -r requirements.txt && npm run gerar
//   npm run gerar -- projetos/    (só o que começa com esse caminho)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { FONTS } from './lib.mjs';
import { banner } from './banner.mjs';
import { studio } from './studio.mjs';
import { stack } from './stack.mjs';
import { footer } from './footer.mjs';
import { PROJECTS, projectCard } from './projects.mjs';
import { BADGES, badge } from './badges.mjs';
import { conquistas } from './conquistas.mjs';

const DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(DIR, '../assets');
const only = process.argv[2];

const jobs = { 'carlos-ts.svg': () => studio() };
for (const mode of ['light', 'dark']) {
  jobs[`banner-${mode}.svg`] = () => banner(mode);
  jobs[`stack-${mode}.svg`] = () => stack(mode);
  jobs[`rodape-${mode}.svg`] = () => footer(mode);
  jobs[`conquistas-${mode}.svg`] = () => conquistas(mode);
  for (const p of PROJECTS) jobs[`projetos/${p.slug}-${mode}.svg`] = () => projectCard(p, mode);
  BADGES.forEach((b, i) => (jobs[`selos/${b.slug}-${mode}.svg`] = () => badge(b, i, mode)));
}

let total = 0;
for (const [name, make] of Object.entries(jobs)) {
  if (only && !name.startsWith(only)) continue;
  const svg = make();
  const file = path.join(OUT, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, svg);
  total += Buffer.byteLength(svg);
  console.log(name.padEnd(38), `${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
}

// Fontes do cartão de atividade (.github/scripts/fontes.css): latim completo, porque
// os nomes de linguagens e os números mudam a cada dia.
if (!only || 'fontes'.startsWith(only)) {
  const chars =
    Array.from({ length: 0x7f - 0x20 }, (_, i) => String.fromCharCode(0x20 + i)).join('') +
    Array.from({ length: 0x100 - 0xa0 }, (_, i) => String.fromCharCode(0xa0 + i)).join('') +
    '·—–’“”…ºª•';
  const faces = ['sans', 'sansBold', 'display'].map((key) => {
    const f = FONTS[key];
    const b64 = execFileSync('python3', [path.join(DIR, 'subset.py'), f.file, chars], { maxBuffer: 1 << 26 }).toString();
    return `@font-face{font-family:${f.family};src:url(data:font/woff2;base64,${b64}) format('woff2');font-weight:${f.weight};font-style:${f.style}}`;
  });
  const css = `${faces.join('\n')}\n`;
  fs.writeFileSync(path.join(DIR, '../.github/scripts/fontes.css'), css);
  total += css.length;
  console.log('.github/scripts/fontes.css'.padEnd(38), `${(css.length / 1024).toFixed(1)} KB`);
}
console.log('total', `${(total / 1024).toFixed(0)} KB`);
