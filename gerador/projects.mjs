// Cartões de projeto (um SVG por projeto, para cada um ser um link no README),
// cada qual com uma pequena ilustração animada do que o projeto faz.
import { FontSet, PALETTE, esc, measure, r, icon, keyframes } from './lib.mjs';

export const PROJECTS = [
  {
    slug: 'bee-sense',
    title: 'Bee Sense',
    kicker: 'IoT · 2025 — 2026',
    text: 'Pico W e sensores monitoram iscas de abelhas sem ferrão e avisam quando chega uma colônia ou um invasor.',
    tags: ['Pico W', 'Sensores', 'Meliponicultura'],
    cta: 'GitHub',
    href: 'https://github.com/EmilenyRochaLeal/beeSense',
    art: 'bees',
  },
  {
    slug: 'agende-ai',
    title: 'Agende Aí',
    kicker: 'SaaS · 2024 — atual',
    text: 'Plataforma para pequenos negócios do setor alimentício: agendamentos, estoque e logística num só lugar.',
    tags: ['SaaS', 'Gestão', 'TCC'],
    cta: 'Portfólio',
    href: 'https://seinenk.github.io/projetos.html',
    art: 'calendar',
  },
  {
    slug: 'dino-runner',
    title: 'Dino Runner',
    kicker: 'Sistemas embarcados · 2025',
    text: 'Jogo em C para a Pico W: o dinossauro corre numa matriz de LEDs 5×5 e a pontuação aparece no OLED.',
    tags: ['C', 'PIO', 'I²C'],
    cta: 'GitHub',
    href: 'https://github.com/Seinenk/Dino-runner',
    art: 'leds',
  },
  {
    slug: 'monitoramento-iot',
    title: 'Monitoramento IoT',
    kicker: 'IoT · 2025',
    text: 'Firmware em C lê sensores a cada segundo e um backend FastAPI repassa os dados em tempo real por WebSocket.',
    tags: ['C', 'FastAPI', 'WebSocket'],
    cta: 'GitHub',
    href: 'https://github.com/Seinenk/Monitoramento_com_iot',
    art: 'chart',
  },
  {
    slug: 'cognitiva',
    title: 'cognitiva',
    kicker: 'IA · 2025',
    text: 'Faz a mesma pergunta a vários LLMs pelo OpenRouter e compara a clareza e a coerência das respostas.',
    tags: ['Python', 'LLMs', 'OpenRouter'],
    cta: 'GitHub',
    href: 'https://github.com/Seinenk/cognitiva',
    art: 'chat',
  },
  {
    slug: 'portfolio',
    title: 'Portfólio',
    kicker: 'Web · 2023 — 2026',
    text: 'Este site, feito em Astro: temas claro e escuro, animações acessíveis e carregamento leve.',
    tags: ['Astro', 'TypeScript', 'Acessibilidade'],
    cta: 'Abrir o site',
    href: 'https://seinenk.github.io',
    art: 'browser',
  },
];

const W = 410;
const H = 222;
const ART = { x: 262, y: 18, w: 130, h: 104 };

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

/* ---------- ilustrações (coordenadas locais 0..130 × 0..104) ---------- */

const HEXP = (cx, cy, R) =>
  `M${[0, 60, 120, 180, 240, 300]
    .map((a) => {
      const rad = ((a - 90) * Math.PI) / 180;
      return `${r(cx + R * Math.cos(rad), 1)} ${r(cy + R * Math.sin(rad), 1)}`;
    })
    .join('L')}Z`;

function artBees(c) {
  const T = 6400;
  const R = 14.5;
  const hw = Math.sqrt(3) * R;
  const cx = 56;
  const cy = 56;
  const cells = [[0, 0], [hw, 0], [-hw, 0], [hw / 2, -1.5 * R], [-hw / 2, -1.5 * R], [hw / 2, 1.5 * R], [-hw / 2, 1.5 * R]];
  const trap = cells[3];
  const css =
    keyframes('trap', T, [[0, 'fill-opacity:0'], [2700, 'fill-opacity:0'], [3100, 'fill-opacity:.9'], [5200, 'fill-opacity:.9'], [5800, 'fill-opacity:0'], [T, 'fill-opacity:0']]) +
    keyframes('ping', T, [[0, 'opacity:0;transform:scale(.6)'], [3000, 'opacity:0;transform:scale(.6)'], [3100, 'opacity:1;transform:scale(.6)'], [3900, 'opacity:0;transform:scale(1.6)'], [T, 'opacity:0;transform:scale(1.6)']]) +
    keyframes('led', T, [[0, 'fill:' + c.hairline], [3000, 'fill:' + c.hairline], [3050, 'fill:' + c.accentStrong], [5400, 'fill:' + c.accentStrong], [5450, 'fill:' + c.hairline], [T, 'fill:' + c.hairline]]) +
    `.trap{animation:trap ${T}ms ease-in-out infinite}.ping{animation:ping ${T}ms ease-out infinite;transform-box:fill-box;transform-origin:center}.led{animation:led ${T}ms steps(1) infinite}` +
    `.flap{transform-box:fill-box;transform-origin:50% 100%;animation:flap .1s linear infinite alternate}@keyframes flap{to{transform:scaleY(.35)}}`;
  const trapX = cx + trap[0];
  const trapY = cy + trap[1];
  // voo: entra pela esquerda, contorna o favo, pousa na isca e sai pela direita
  const land = [r(trapX), r(trapY - 3)];
  const segs = [
    [[-14, 86], [14, 98], [30, 30], [r(trapX - 26), r(trapY - 16)]],
  ];
  const prev = segs[0];
  const refl = [2 * prev[3][0] - prev[2][0], 2 * prev[3][1] - prev[2][1]];
  segs.push([prev[3], refl, [r(trapX - 4), r(trapY - 8)], land]);
  segs.push([land, [r(trapX + 8), r(trapY - 14)], [120, 4], [146, 18]]);
  const bez = ([p0, p1, p2, p3], t) => [0, 1].map((k) => (1 - t) ** 3 * p0[k] + 3 * (1 - t) ** 2 * t * p1[k] + 3 * (1 - t) * t * t * p2[k] + t ** 3 * p3[k]);
  const segLen = (sg) => {
    let len = 0;
    let p = sg[0];
    for (let i = 1; i <= 60; i++) {
      const q = bez(sg, i / 60);
      len += Math.hypot(q[0] - p[0], q[1] - p[1]);
      p = q;
    }
    return len;
  };
  const lens = segs.map(segLen);
  const landAt = r((lens[0] + lens[1]) / (lens[0] + lens[1] + lens[2]), 4);
  const flight = `M${segs[0][0].join(' ')}C${segs[0].slice(1).map((p) => p.join(' ')).join(' ')}C${segs[1].slice(1).map((p) => p.join(' ')).join(' ')}C${segs[2].slice(1).map((p) => p.join(' ')).join(' ')}`;
  const bee = `<g class="flap"><ellipse cx="-1" cy="-6" rx="3.2" ry="5" fill="${c.raised}" stroke="${c.accent}" stroke-width=".8"/></g><ellipse cx="0" cy="0" rx="6.6" ry="4.4" fill="${c.ink}"/><rect x="-2.6" y="-4.4" width="1.8" height="8.8" fill="${c.glowA}"/><rect x="1" y="-4.4" width="1.8" height="8.8" fill="${c.glowA}"/><circle cx="7" cy="-.6" r="3" fill="${c.ink}"/>`;
  return {
    css,
    svg: `${cells.map(([dx, dy]) => `<path d="${HEXP(cx + dx, cy + dy, R - 1)}" fill="none" stroke="${c.accent}" stroke-width="1.4"/>`).join('')}
<path class="trap" d="${HEXP(trapX, trapY, R - 1)}" fill="${c.accent}" fill-opacity="0"/>
<g transform="translate(98 76)"><rect width="26" height="17" rx="3" fill="${c.ink}"/><rect x="4" y="4" width="8" height="9" rx="1" fill="${c.body}"/><circle class="led" cx="19" cy="8.5" r="2.4" fill="${c.hairline}"/>
<circle class="ping" cx="19" cy="8.5" r="9" fill="none" stroke="${c.accentStrong}" stroke-width="1.4"/></g>
<g><animateMotion dur="${T}ms" repeatCount="indefinite" rotate="auto" keyPoints="0;${landAt};${landAt};1" keyTimes="0;.42;.78;1" calcMode="linear"><mpath href="#beeflight"/></animateMotion>${bee}</g>
<path id="beeflight" d="${flight}" fill="none"/>`,
  };
}

function artCalendar(c) {
  const T = 6000;
  const box = { x: 14, y: 12, w: 102, h: 80 };
  const cols = 5;
  const rows = 3;
  const cw = 15;
  const ch = 13;
  const gx = 4.5;
  const gy = 4.5;
  const ox = box.x + (box.w - (cols * cw + (cols - 1) * gx)) / 2;
  const oy = box.y + 26;
  const cell = (i) => [ox + (i % cols) * (cw + gx), oy + Math.floor(i / cols) * (ch + gy)];
  const path = [2, 7, 8, 13];
  const target = cell(13);
  const stops = [];
  path.forEach((i, k) => {
    const [x, y] = cell(i);
    const t = 400 + k * 650;
    stops.push([t, `transform:translate(${r(x - cell(path[0])[0])}px,${r(y - cell(path[0])[1])}px)`, 'cubic-bezier(.45,0,.25,1)']);
    stops.push([t + 420, `transform:translate(${r(x - cell(path[0])[0])}px,${r(y - cell(path[0])[1])}px)`, 'cubic-bezier(.45,0,.25,1)']);
  });
  stops.push([5600, stops.at(-1)[1]], [T, `transform:translate(0px,0px)`]);
  const css =
    keyframes('sel', T, stops) +
    keyframes('selo', T, [[0, 'opacity:0'], [250, 'opacity:1'], [5500, 'opacity:1'], [5800, 'opacity:0'], [T, 'opacity:0']]) +
    keyframes('chk', T, [[0, 'stroke-dashoffset:20'], [2800, 'stroke-dashoffset:20'], [3150, 'stroke-dashoffset:0'], [5500, 'stroke-dashoffset:0'], [5800, 'stroke-dashoffset:20'], [T, 'stroke-dashoffset:20']]) +
    keyframes('toast', T, [[0, 'opacity:0;transform:translateY(8px)'], [3200, 'opacity:0;transform:translateY(8px)'], [3550, 'opacity:1;transform:translateY(0px)'], [5400, 'opacity:1;transform:translateY(0px)'], [5800, 'opacity:0;transform:translateY(0px)'], [T, 'opacity:0;transform:translateY(8px)']]) +
    `.sel{animation:sel ${T}ms linear infinite,selo ${T}ms linear infinite}.chk{stroke-dasharray:20;animation:chk ${T}ms ease-out infinite}.toast{animation:toast ${T}ms cubic-bezier(.16,1,.3,1) infinite}`;
  const [sx, sy] = cell(path[0]);
  return {
    css,
    svg: `<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="9" fill="${c.raised}" stroke="${c.hairline}"/>
<rect x="${box.x}" y="${box.y}" width="${box.w}" height="18" rx="9" fill="${c.primary}"/><rect x="${box.x}" y="${box.y + 9}" width="${box.w}" height="9" fill="${c.primary}"/>
<circle cx="${box.x + 12}" cy="${box.y + 9}" r="2" fill="${c.onPrimary}"/><rect x="${box.x + 20}" y="${box.y + 7.5}" width="34" height="3" rx="1.5" fill="${c.onPrimary}" fill-opacity=".8"/>
${Array.from({ length: cols * rows }, (_, i) => {
  const [x, y] = cell(i);
  return `<rect x="${r(x)}" y="${r(y)}" width="${cw}" height="${ch}" rx="3" fill="${c.card}"/>`;
}).join('')}
<rect class="sel" x="${r(sx - 1.5)}" y="${r(sy - 1.5)}" width="${cw + 3}" height="${ch + 3}" rx="4" fill="none" stroke="${c.accentStrong}" stroke-width="1.6"/>
<rect x="${r(target[0])}" y="${r(target[1])}" width="${cw}" height="${ch}" rx="3" fill="${c.card}"/>
<path class="chk" d="M${r(target[0] + 4)} ${r(target[1] + 6.8)}l3 3 5-6" fill="none" stroke="${c.accentStrong}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
<g class="toast"><rect x="40" y="80" width="84" height="20" rx="10" fill="${c.ink}"/><text x="82" y="93.6" text-anchor="middle" class="art-t" fill="${c.canvas}">Agendado ✓</text></g>`,
    text: 'Agendado ✓',
  };
}

function artLeds(c) {
  const FR = 330;
  const sz = 5;
  const gap = 14;
  const ox = 14;
  const oy = 20;
  const dino = (up) => [[4 - up, 1], [3 - up, 1], [2 - up, 1], [2 - up, 2], [3 - up, 0]];
  const cactus = (col) => (col >= 0 && col < 5 ? [[4, col], [3, col]] : []);
  const frames = [
    [0, 4], [0, 3], [2, 2], [2, 1], [2, 0], [1, -1], [0, -1], [0, -1],
  ].map(([up, col]) => {
    const on = new Set([...dino(up), ...cactus(col)].filter(([rr, cc]) => rr >= 0 && rr < 5 && cc >= 0 && cc < 5).map(([rr, cc]) => `${rr},${cc}`));
    return on;
  });
  const T = FR * frames.length;
  let css = '';
  let n = 0;
  const leds = [];
  for (let row = 0; row < sz; row++) {
    for (let col = 0; col < sz; col++) {
      const key = `${row},${col}`;
      const states = frames.map((f) => f.has(key));
      const cx = ox + col * gap;
      const cy = oy + row * gap;
      if (states.every((s) => !s)) {
        leds.push(`<circle cx="${cx}" cy="${cy}" r="4.6" fill="#3A3D48"/>`);
        continue;
      }
      const name = `l${n++}`;
      const stops = states.map((s, k) => [k * FR, `fill:${s ? '#F4EEEA' : '#3A3D48'}`]);
      stops.push([T, stops[0][1]]);
      css += keyframes(name, T, stops) + `.${name}{animation:${name} ${T}ms steps(1) infinite}`;
      leds.push(`<circle class="${name}" cx="${cx}" cy="${cy}" r="4.6" fill="#3A3D48"/>`);
    }
  }
  // pontuação: os dígitos mudam a cada salto
  const scores = ['0126', '0127', '0128'];
  scores.forEach((_, k) => {
    const stops = k === 0 ? [[0, 'opacity:1'], [T, 'opacity:0'], [T * 3, 'opacity:0']] : [[0, 'opacity:0'], [k * T, 'opacity:1'], [(k + 1) * T, 'opacity:0'], [T * 3, 'opacity:0']];
    css += keyframes(`sc${k}`, T * 3, stops) + `.sc${k}{animation:sc${k} ${T * 3}ms steps(1) infinite}`;
  });
  return {
    css,
    svg: `<rect x="2" y="8" width="80" height="80" rx="10" fill="#1C1C27"/>${leds.join('')}
<rect x="88" y="26" width="38" height="44" rx="5" fill="#1C1C27"/><rect x="91.5" y="29.5" width="31" height="37" rx="2.5" fill="#0F0F16"/>
<text x="107" y="44" text-anchor="middle" class="oled-l">PTS</text>${scores.map((s, k) => `<text class="oled sc${k}" x="107" y="59" text-anchor="middle">${s}</text>`).join('')}
<rect x="96" y="76" width="22" height="13" rx="2.5" fill="${c.ink}"/><rect x="99" y="79" width="7" height="7" rx="1" fill="${c.body}"/><circle cx="112" cy="82.5" r="1.8" fill="${c.glowA}"/>`,
    oled: 'PTS0123456789',
  };
}

function artChart(c) {
  const T = 5600;
  const pts = [];
  const N = 22;
  for (let i = 0; i < N; i++) {
    const x = 10 + (i / (N - 1)) * 108;
    const y = 66 - (Math.sin(i * 0.55) * 9 + Math.sin(i * 1.7 + 1) * 4 + i * 0.75);
    pts.push([r(x, 1), r(y, 1)]);
  }
  const d = `M${pts.map(([x, y]) => `${x} ${y}`).join('L')}`;
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  len = Math.ceil(len);
  const area = `${d}L118 86L10 86Z`;
  const css =
    keyframes('draw', T, [[0, `stroke-dashoffset:${len}`], [300, `stroke-dashoffset:${len}`], [3600, 'stroke-dashoffset:0'], [4900, 'stroke-dashoffset:0;opacity:1'], [5400, 'stroke-dashoffset:0;opacity:0'], [T, `stroke-dashoffset:${len};opacity:0`]]) +
    keyframes('area', T, [[0, 'opacity:0'], [3400, 'opacity:0'], [3900, 'opacity:1'], [4900, 'opacity:1'], [5400, 'opacity:0'], [T, 'opacity:0']]) +
    keyframes('wifi', 1400, [[0, 'opacity:.35'], [700, 'opacity:1'], [1400, 'opacity:.35']]) +
    `.draw{stroke-dasharray:${len};animation:draw ${T}ms linear infinite}.area{animation:area ${T}ms ease infinite}.wifi{animation:wifi 1.4s ease-in-out infinite}`;
  const temps = ['29,8', '30,6', '31,4'];
  const temp = (k, from, to) =>
    keyframes(`tp${k}`, T, from === 0 ? [[0, 'opacity:1'], [to, 'opacity:0'], [T, 'opacity:0']] : [[0, 'opacity:0'], [from, 'opacity:1'], [to, 'opacity:0'], [T, 'opacity:0']]) +
    `.tp${k}{animation:tp${k} ${T}ms steps(1) infinite}`;
  const tcss = temp(0, 0, 1500) + temp(1, 1500, 2700) + temp(2, 2700, 5400);
  return {
    css: css + tcss,
    svg: `${[34, 54, 74].map((y) => `<line x1="10" y1="${y}" x2="118" y2="${y}" stroke="${c.hairline}" stroke-dasharray="2 3"/>`).join('')}
<path class="area" d="${area}" fill="url(#chartfill)"/>
<path class="draw" d="${d}" fill="none" stroke="${c.accentStrong}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
${temps.map((t, k) => `<text class="art-num tp${k}" x="10" y="20">${t} °C</text>`).join('')}
<g class="wifi">${icon('wifi', 104, 7, 15, c.accentStrong, 2.2)}</g>`,
    nums: temps.join('') + ' °C',
  };
}

function artChat(c) {
  const T = 6400;
  const grow = (name, from, w) => keyframes(name, T, [[0, 'transform:scaleX(0)'], [from, 'transform:scaleX(0)'], [from + 600, 'transform:scaleX(1)'], [5600, 'transform:scaleX(1);opacity:1'], [6000, 'transform:scaleX(1);opacity:0'], [T, 'transform:scaleX(0);opacity:0']]) + `.${name}{animation:${name} ${T}ms cubic-bezier(.16,1,.3,1) infinite;transform-box:fill-box;transform-origin:left center}`;
  const css =
    grow('a1', 300, 0) + grow('a2', 600, 0) + grow('b1', 1100, 0) + grow('b2', 1400, 0) +
    grow('s1', 2300, 0) + grow('s2', 2500, 0) + grow('s3', 2700, 0) + grow('s4', 2900, 0) +
    keyframes('win', T, [[0, 'opacity:0'], [3600, 'opacity:0'], [3900, 'opacity:1'], [5600, 'opacity:1'], [6000, 'opacity:0'], [T, 'opacity:0']]) + `.win{animation:win ${T}ms ease infinite}`;
  const bubble = (y, label, l1, l2, k) => `<rect x="6" y="${y}" width="118" height="26" rx="8" fill="${c.raised}" stroke="${c.hairline}"/>
<circle cx="18" cy="${y + 13}" r="7" fill="${k === 'a' ? c.ink : c.accent}"/><text x="18" y="${y + 16.4}" text-anchor="middle" class="art-b" fill="${k === 'a' ? c.canvas : c.ink}">${label}</text>
<rect class="${k}1" x="31" y="${y + 7.5}" width="${l1}" height="4" rx="2" fill="${c.muted}" fill-opacity=".55"/><rect class="${k}2" x="31" y="${y + 14.5}" width="${l2}" height="4" rx="2" fill="${c.muted}" fill-opacity=".35"/>`;
  return {
    css,
    svg: `${bubble(6, 'A', 82, 58, 'a')}${bubble(38, 'B', 74, 66, 'b')}
<text x="6" y="80" class="art-s">clareza</text><text x="6" y="97" class="art-s">coerência</text>
<rect x="56" y="73" width="68" height="3.4" rx="1.7" fill="${c.hairline}"/><rect x="56" y="79" width="68" height="3.4" rx="1.7" fill="${c.hairline}"/>
<rect x="56" y="90" width="68" height="3.4" rx="1.7" fill="${c.hairline}"/><rect x="56" y="96" width="68" height="3.4" rx="1.7" fill="${c.hairline}"/>
<rect class="s1" x="56" y="73" width="58" height="3.4" rx="1.7" fill="${c.ink}"/><rect class="s2" x="56" y="79" width="44" height="3.4" rx="1.7" fill="${c.accent}"/>
<rect class="s3" x="56" y="90" width="50" height="3.4" rx="1.7" fill="${c.ink}"/><rect class="s4" x="56" y="96" width="61" height="3.4" rx="1.7" fill="${c.accent}"/>
<g class="win">${icon('check', 112, 30, 12, c.accentStrong, 2.6)}</g>`,
    labels: 'AB clareza coerência',
  };
}

function artBrowser(c) {
  const T = 6400;
  const L = PALETTE.light;
  const D = PALETTE.dark;
  const win = { x: 6, y: 8, w: 118, h: 88 };
  const page = (p) => `<rect x="${win.x}" y="${win.y + 14}" width="${win.w}" height="${win.h - 14}" fill="${p.canvas}"/>
<rect x="${win.x + 10}" y="${win.y + 26}" width="34" height="3" rx="1.5" fill="${p.accentStrong}"/>
<rect x="${win.x + 10}" y="${win.y + 34}" width="58" height="8" rx="2" fill="${p.ink}"/>
<rect x="${win.x + 10}" y="${win.y + 46}" width="46" height="8" rx="2" fill="${p.accent}"/>
<rect x="${win.x + 10}" y="${win.y + 60}" width="52" height="3" rx="1.5" fill="${p.muted}" fill-opacity=".6"/><rect x="${win.x + 10}" y="${win.y + 66}" width="40" height="3" rx="1.5" fill="${p.muted}" fill-opacity=".6"/>
<rect x="${win.x + 78}" y="${win.y + 26}" width="30" height="40" rx="5" fill="${p.card}"/><path d="M${win.x + 93} ${win.y + 37}l5 2.9v5.8l-5 2.9-5-2.9v-5.8Z" fill="${p.ink}"/>
<rect x="${win.x + 10}" y="${win.y + 76}" width="24" height="7" rx="3.5" fill="${p.primary}"/>`;
  const knobX = win.x + win.w - 22;
  const css =
    keyframes('knob', T, [[0, 'transform:translateX(0px)'], [1350, 'transform:translateX(0px)', 'cubic-bezier(.65,0,.35,1)'], [1600, 'transform:translateX(7px)'], [4450, 'transform:translateX(7px)', 'cubic-bezier(.65,0,.35,1)'], [4700, 'transform:translateX(0px)'], [T, 'transform:translateX(0px)']]) +
    `.knob{animation:knob ${T}ms linear infinite}`;
  const kt = [0, 1500, 2300, 4600, 5400, T].map((t) => r(t / T, 4)).join(';');
  return {
    css,
    svg: `<defs><clipPath id="bw"><rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" rx="8"/></clipPath><clipPath id="dk"><circle cx="${knobX + 1}" cy="${win.y + 7}" r="0"><animate attributeName="r" dur="${T}ms" repeatCount="indefinite" calcMode="spline" keyTimes="${kt}" values="0;0;150;150;0;0" keySplines="0 0 1 1;.65 0 .35 1;0 0 1 1;.65 0 .35 1;0 0 1 1"/></circle></clipPath></defs>
<g clip-path="url(#bw)">${page(L)}<g clip-path="url(#dk)">${page(D)}</g>
<rect x="${win.x}" y="${win.y}" width="${win.w}" height="14" fill="${c.ink}"/>
<circle cx="${win.x + 8}" cy="${win.y + 7}" r="2" fill="${c.glowA}"/><circle cx="${win.x + 15}" cy="${win.y + 7}" r="2" fill="${c.muted}"/><circle cx="${win.x + 22}" cy="${win.y + 7}" r="2" fill="${c.muted}"/>
<rect x="${knobX - 3}" y="${win.y + 3}" width="17" height="8" rx="4" fill="${c.body}"/><circle class="knob" cx="${knobX + 1}" cy="${win.y + 7}" r="3" fill="${c.canvas}"/></g>
<rect x="${win.x + 0.5}" y="${win.y + 0.5}" width="${win.w - 1}" height="${win.h - 1}" rx="7.5" fill="none" stroke="${c.hairline}"/>`,
  };
}

const ARTS = { bees: artBees, calendar: artCalendar, leds: artLeds, chart: artChart, chat: artChat, browser: artBrowser };

export function projectCard(project, mode) {
  const c = PALETTE[mode];
  const fs = new FontSet();
  const art = ARTS[project.art](c);
  if (art.text) fs.use('sansBold', art.text);
  if (art.nums) fs.use('sansBold', art.nums);
  if (art.labels) fs.use('sansMedium', art.labels);
  if (art.oled) fs.use('mono', art.oled);

  const kicker = fs.use('sansBold', project.kicker.toUpperCase());
  const title = fs.use('display', project.title);
  const lines = wrap('sans', project.text, 13.2, W - 44);
  if (lines.length > 2) throw new Error(`${project.title}: descrição com ${lines.length} linhas`);
  const titleSize = Math.min(33, r((33 * (ART.x - 34)) / measure('display', project.title, 33), 1));
  lines.forEach((l) => fs.use('sans', l));
  const cta = fs.use('sansMedium', project.cta);

  let tx = 22;
  const tags = project.tags
    .map((t) => {
      fs.use('sansMedium', t);
      const w = measure('sansMedium', t, 11.5) + 20;
      const out = `<rect x="${r(tx + 0.5)}" y="${H - 42.5}" width="${r(w - 1)}" height="23" rx="11.5" fill="${c.soft}" stroke="${c.hairline}"/><text class="tag" x="${r(tx + 10)}" y="${H - 27}">${esc(t)}</text>`;
      tx += w + 6;
      return out;
    })
    .join('');
  const ctaW = measure('sansMedium', cta, 12.5);

  const css = `
${fs.css()}
text{font-kerning:normal}
.kicker{font:600 10.5px IN;letter-spacing:1.5px;fill:${c.accentStrong}}
.title{font:500 ${titleSize}px CG;fill:${c.ink};letter-spacing:-.5px}
.desc{font:400 13.2px IN;fill:${c.body}}
.tag{font:500 11.5px IN;fill:${c.body}}
.cta{font:500 12.5px IN;fill:${c.accentStrong}}
.art-t{font:600 10px IN}
.art-num{font:600 13px IN;fill:${c.ink};font-variant-numeric:tabular-nums}
.art-b{font:600 8px IN}
.art-s{font:500 9.5px IN;fill:${c.muted}}
.oled{font:400 11px JB;fill:#F4EEEA}.oled-l{font:400 8px JB;fill:#9C9396;letter-spacing:1px}
.in{animation:in .9s cubic-bezier(.16,1,.3,1) both}.d1{animation-delay:.08s}.d2{animation-delay:.18s}.d3{animation-delay:.3s}.d4{animation-delay:.42s}
@keyframes in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
${art.css}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.art-anim{display:none}}
`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
<title id="t">${esc(project.title)}</title>
<desc id="d">${esc(project.kicker)}. ${esc(project.text)} ${esc(project.tags.join(', '))}.</desc>
<style>${css}</style>
<defs><linearGradient id="chartfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.accent}" stop-opacity=".35"/><stop offset="1" stop-color="${c.accent}" stop-opacity="0"/></linearGradient>
<clipPath id="artclip"><rect width="${ART.w}" height="${ART.h}" rx="12"/></clipPath></defs>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="20" fill="${c.canvas}" stroke="${c.hairline}" stroke-width="2"/>
<g transform="translate(${ART.x} ${ART.y})"><rect width="${ART.w}" height="${ART.h}" rx="12" fill="${c.card}"/><g clip-path="url(#artclip)">${art.svg}</g></g>
<text class="kicker in d1" x="22" y="40">${esc(kicker)}</text>
<text class="title in d2" x="20" y="80">${esc(title)}</text>
<g class="in d3">${lines.map((l, i) => `<text class="desc" x="22" y="${r(142 + i * 19)}">${esc(l)}</text>`).join('')}</g>
<g class="in d4">${tags}<text class="cta" x="${r(W - 40 - ctaW)}" y="${H - 26.5}">${esc(cta)}</text>${icon('arrow-up-right', W - 36, H - 39, 14, c.accentStrong, 2.2)}</g>
</svg>
`;
}
