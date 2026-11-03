// Utilitários do gerador de SVGs do perfil: fontes embutidas, medidas de texto e keyframes.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.dirname(new URL(import.meta.url).pathname);
const require = createRequire(import.meta.url);
const opentype = require('opentype.js');

const NM = path.join(DIR, 'node_modules/@fontsource');

export const FONTS = {
  display: { family: 'CG', weight: 500, style: 'normal', file: `${NM}/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff` },
  displayItalic: { family: 'CG', weight: 500, style: 'italic', file: `${NM}/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff` },
  sans: { family: 'IN', weight: 400, style: 'normal', file: `${NM}/inter/files/inter-latin-400-normal.woff` },
  sansMedium: { family: 'IN', weight: 500, style: 'normal', file: `${NM}/inter/files/inter-latin-500-normal.woff` },
  sansBold: { family: 'IN', weight: 600, style: 'normal', file: `${NM}/inter/files/inter-latin-600-normal.woff` },
  mono: { family: 'JB', weight: 400, style: 'normal', file: `${NM}/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff` },
};

const parsed = {};
export function font(key) {
  if (!parsed[key]) {
    const buf = fs.readFileSync(FONTS[key].file);
    parsed[key] = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  }
  return parsed[key];
}

/** Largura do texto em px, com kerning e espaçamento entre letras. */
export function measure(key, text, size, letterSpacing = 0) {
  const f = font(key);
  const scale = size / f.unitsPerEm;
  let width = 0;
  let previous = null;
  for (const ch of text) {
    const glyph = f.charToGlyph(ch);
    if (previous) width += (f.getKerningValue(previous, glyph) || 0) * scale;
    width += (glyph.advanceWidth ?? 0) * scale;
    previous = glyph;
  }
  return width + letterSpacing * [...text].length;
}

/** Registra o texto usado por cada fonte, para gerar o subconjunto embutido. */
export class FontSet {
  constructor() {
    this.used = {};
  }
  use(key, text) {
    this.used[key] = (this.used[key] ?? '') + text;
    return text;
  }
  css() {
    return Object.entries(this.used)
      .map(([key, text]) => {
        const f = FONTS[key];
        const chars = [...new Set([...text, ' '])].join('');
        const b64 = execFileSync('python3', [path.join(DIR, 'subset.py'), f.file, chars], { maxBuffer: 1 << 26 }).toString();
        return `@font-face{font-family:${f.family};src:url(data:font/woff2;base64,${b64}) format('woff2');font-weight:${f.weight};font-style:${f.style}}`;
      })
      .join('');
  }
}

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const r = (n, d = 2) => Number(n.toFixed(d));

/** Linha do tempo discreta (SMIL) a partir de pares [ms, valor]. */
export function discrete(events, total) {
  const map = new Map();
  for (const [t, v] of events) map.set(Math.round(Math.min(total, Math.max(0, t))), v);
  if (!map.has(0)) map.set(0, events[0]?.[1] ?? 0);
  const times = [...map.keys()].sort((a, b) => a - b);
  if (times[times.length - 1] !== total) {
    map.set(total, map.get(times[times.length - 1]));
    times.push(total);
  }
  return {
    keyTimes: times.map((t) => r(t / total, 5)).join(';'),
    values: times.map((t) => map.get(t)).join(';'),
  };
}

/**
 * Animações CSS num ciclo único: cada chamada cria uma classe com seus keyframes,
 * em ms do ciclo, para que todas as partes do SVG fiquem sincronizadas.
 * stops: [ms, declarações, easing do trecho seguinte?]
 */
export class Timeline {
  constructor(total) {
    this.total = total;
    this.rules = [];
    this.n = 0;
  }
  pct(ms) {
    return r(Math.min(100, Math.max(0, (ms / this.total) * 100)), 4);
  }
  cls(stops, timing = 'linear') {
    const name = `k${(this.n++).toString(36)}`;
    const map = new Map();
    for (const [ms, decl, ease] of stops) map.set(this.pct(ms), [decl, ease]);
    const keys = [...map.keys()].sort((a, b) => a - b);
    if (keys[0] !== 0) {
      map.set(0, [map.get(keys[0])[0]]);
      keys.unshift(0);
    }
    if (keys[keys.length - 1] !== 100) {
      map.set(100, [map.get(keys[keys.length - 1])[0]]);
      keys.push(100);
    }
    const body = keys
      .map((k) => {
        const [decl, ease] = map.get(k);
        return `${k}%{${decl}${ease ? `;animation-timing-function:${ease}` : ''}}`;
      })
      .join('');
    this.rules.push(`@keyframes ${name}{${body}}.${name}{animation:${name} ${this.total}ms ${timing} infinite}`);
    return name;
  }
  /** Visível só entre a e b (troca seca). */
  win(a, b, on = 'opacity:1', off = 'opacity:0') {
    return this.cls(a <= 0 ? [[0, on], [b, off]] : [[0, off], [a, on], [b, off]], 'step-end');
  }
  css() {
    return this.rules.join('');
  }
}

/** Keyframes com tempos em ms convertidos para % do ciclo. */
export function keyframes(name, total, stops) {
  const sorted = [...stops].sort((a, b) => a[0] - b[0]);
  return `@keyframes ${name}{${sorted
    .map(([ms, decl, ease]) => `${r(Math.min(100, Math.max(0, (ms / total) * 100)), 3)}%{${decl}${ease ? `;animation-timing-function:${ease}` : ''}}`)
    .join('')}}`;
}

/** Monograma CM (hexágono + letras em Cormorant, 64×64). */
export const HEX = 'M32 3.5 56.68 17.75v28.5L32 60.5 7.32 46.25v-28.5Z';
export const CM_PATH = fs.readFileSync(path.join(DIR, 'dados/cm-path.txt'), 'utf8').trim();

/** Ícones Lucide (licença ISC), 24×24, em traço. */
const iconCache = {};
export function icon(name, x, y, size, color, width = 1.8) {
  iconCache[name] ??= fs
    .readFileSync(path.join(DIR, `node_modules/lucide-static/icons/${name}.svg`), 'utf8')
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/\s*\n\s*/g, '');
  return `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${iconCache[name]}</g>`;
}

/** Paletas (as mesmas do portfólio, tema Grafite). */
export const PALETTE = {
  light: {
    canvas: '#FAF9F8', soft: '#F4F1EF', card: '#F0EBE8', raised: '#FFFFFF', hairline: '#E9E3DF',
    ink: '#181722', body: '#393F4A', muted: '#58555B', accent: '#8A7875', accentStrong: '#65595B',
    glowA: '#DCD2CC', glowB: '#8A7875', primary: '#6A5D5E', onPrimary: '#FFFFFF',
  },
  dark: {
    canvas: '#181722', soft: '#1C1C27', card: '#21222D', raised: '#252732', hairline: '#2C2F3A',
    ink: '#FBFAF9', body: '#E2DCD8', muted: '#ABA6A6', accent: '#AA9B97', accentStrong: '#BCAFAA',
    glowA: '#393F4A', glowB: '#8A7875', primary: '#DCD2CC', onPrimary: '#181722',
  },
};

/** Cores fixas do cartão escuro (janela de código e maquetes). */
export const INV = {
  bg: '#1E1E29', bar: '#252732', panel: '#181722', hairline: '#2C2F3A', on: '#FAF9F8', onSoft: '#B9B2B0',
  accent: '#C3B6B1', glow: '#8A7875',
  paper: '#FCFBFB', paperSoft: '#F1EDEA', onPaper: '#181722', paperMuted: '#58555B', paperAccent: '#675B5C',
  codeKey: '#E8E2DE', codeString: '#B9ABA6', codePunct: '#979496', codeComment: '#8D8B8E',
};
