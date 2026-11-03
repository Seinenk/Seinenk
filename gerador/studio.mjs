// Cartão "carlos.ts" do perfil: o mesmo resumo é programado, montado num quadro de
// design, escrito num documento e organizado em slides. A barra com os três pontos
// e o nome do arquivo nunca muda. Tudo roda num único ciclo: CSS para movimento e
// opacidade, SMIL para a digitação (larguras exatas de cada caractere).
import { FontSet, INV, esc, measure, r, icon, discrete, Timeline } from './lib.mjs';

const W = 840;
const H = 472;
const CHROME = 46;
const STAGE = { y: CHROME, w: W, h: 370 };
const FOOT = { y: CHROME + 370, h: H - CHROME - 370 };
const FADE = 380;
const EASE_IO = 'cubic-bezier(.45,0,.25,1)';
const EASE_OUT = 'cubic-bezier(.16,1,.3,1)';
const C = INV;

/* ======================= planos (só tempos e medidas) ======================= */

const CODE_LINES = [
  [['c', '// carlos.ts']],
  [['k', 'const'], ['p', ' '], ['v', 'carlos'], ['p', ' = {']],
  [['p', '  '], ['v', 'nome'], ['p', ': '], ['s', "'Carlos Michael da Silva Sousa'"], ['p', ',']],
  [['p', '  '], ['v', 'formacao'], ['p', ': '], ['s', "'ADS · IFPI'"], ['p', ',']],
  [['p', '  '], ['v', 'atuacao'], ['p', ': ['], ['s', "'Investe Piauí'"], ['p', ', '], ['s', "'Vale do Mel'"], ['p', '],']],
  [['p', '  '], ['v', 'foco'], ['p', ': ['], ['s', "'front-end'"], ['p', ', '], ['s', "'UX/UI'"], ['p', ', '], ['s', "'IoT'"], ['p', '],']],
  [['p', '  '], ['v', 'pesquisa'], ['p', ': '], ['s', "'inovação e empreendedorismo'"], ['p', ',']],
  [['p', '  '], ['v', 'idiomas'], ['p', ': ['], ['s', "'pt'"], ['p', ', '], ['s', "'en'"], ['p', ', '], ['s', "'es'"], ['p', '],']],
  [['p', '};']],
  [],
  [['k', 'export default'], ['p', ' '], ['v', 'carlos'], ['p', ';']],
];

function planCode() {
  const P = { start: 520, char: 24, pause: 120, hold: 2600, size: 16, lh: 26, top: 66, codeX: 252, lnRight: 234 };
  P.charW = measure('mono', '0', P.size);
  let clock = P.start;
  P.lines = CODE_LINES.map((tokens, i) => {
    const text = tokens.map(([, t]) => t).join('');
    const n = [...text].length;
    const line = { tokens, text, n, d: clock, y: P.top + i * P.lh };
    clock += n * P.char + P.pause;
    return line;
  });
  P.end = clock - P.pause;
  P.ms = clock + P.hold;
  return P;
}

const DESIGN_ELS = [
  { key: 'foto', layer: 'Foto', icon: 'circle', x: 7, y: 10, dx: -16, dy: 22, gx: 9, gy: 12, fill: 'Gradiente', font: ['Cormorant Garamond', 'Medium · 94'] },
  { key: 'nome', layer: 'Nome', icon: 'type', x: 31, y: 11, dx: 18, dy: -14, gx: 12, gy: 5, fill: '#181722', font: ['Cormorant Garamond', 'Medium · 92'] },
  { key: 'sub', layer: 'Formação', icon: 'type', x: 31, y: 32, dx: 16, dy: 16, gx: 6, gy: 2.5, fill: '#58555B', font: ['Inter', 'Medium · 50'] },
  { key: 'cards', layer: 'Atuação', icon: 'square', x: 7, y: 48, dx: -10, dy: 22, gx: 18, gy: 8, fill: '#F1EDEA', font: ['Inter', 'Medium · 52'] },
  { key: 'tags', layer: 'Foco', icon: 'square', x: 7, y: 73, dx: 20, dy: 12, gx: 9, gy: 4, fill: '#58555B', font: ['Inter', 'Regular · 45'] },
];

function planDesign() {
  const P = { start: 600, step: 1150, hold: 1900 };
  P.els = DESIGN_ELS.map((el, i) => ({ ...el, t: P.start + i * P.step }));
  P.ms = P.start + P.els.length * P.step + P.hold;
  return P;
}

const DOC_LINES = [
  { kind: 'title', text: 'Carlos Michael da Silva Sousa' },
  { kind: 'sub', text: 'Tecnólogo em ADS · IFPI' },
  { kind: 'li', text: 'Atuação: Investe Piauí e Vale do Mel' },
  { kind: 'li', text: 'Foco: front-end, UX/UI e IoT' },
  { kind: 'li', text: 'Pesquisa: inovação e empreendedorismo' },
  { kind: 'li', text: 'Idiomas: português, inglês e espanhol' },
];

function planDocs() {
  const P = { start: 520, char: 26, pause: 230, hold: 2300 };
  const page = { x: 170, y: 58, w: 500 };
  const fonts = { title: ['display', 31], sub: ['sans', 13.5], li: ['sans', 13.5] };
  const baseline = { title: 130, sub: 158 };
  let clock = P.start;
  let li = 0;
  P.page = page;
  P.lines = DOC_LINES.map((line) => {
    const [font, size] = fonts[line.kind];
    const chars = [...line.text];
    const x = page.x + 54 + (line.kind === 'li' ? 16 : 0);
    const y = line.kind === 'li' ? 202 + li++ * 28 : baseline[line.kind];
    const widths = chars.map((_, k) => measure(font, chars.slice(0, k + 1).join(''), size));
    const out = { ...line, font, size, x, y, n: chars.length, widths, d: clock };
    clock += chars.length * P.char + P.pause;
    return out;
  });
  P.end = clock - P.pause;
  P.ms = clock + P.hold;
  return P;
}

function planSlides() {
  const T = { grab: 1250, drop: 2050, clickC: 2350, showC: 2500, card1: 2850, drag2: 3250, drop2: 3850, clickB: 5100, showB: 5250, chips: 5550, line: 6150 };
  return { T, ms: 8900 };
}

/* ======================= peças comuns ======================= */

function cursorShape(fs) {
  const name = fs.use('sansBold', 'Carlos');
  const w = r(measure('sansBold', name, 10.5) + 14);
  return { w, name };
}

/** Cursor com nome, como num editor colaborativo. */
function cursor(fs, moveCls, pressCls) {
  const { w, name } = cursorShape(fs);
  return `<g class="${moveCls}"><g filter="url(#csh)">
  <g class="${pressCls} tip"><path d="M4.5 2.5 19 11.2l-6.6 1.6L9.3 19.5Z" transform="translate(-4 -2.4) scale(.92)" fill="${C.accent}" stroke="${C.panel}" stroke-width="1.5" stroke-linejoin="round"/></g>
  <rect x="11" y="15" width="${w}" height="18" rx="9" fill="${C.accent}"/><text class="cur-t" x="18" y="27.6">${esc(name)}</text>
</g></g>`;
}

/** Pressionado durante cada intervalo [a, b] (ms do ciclo). */
function presses(tl, ranges) {
  const stops = [[0, 'transform:scale(1)']];
  for (const [a, b] of ranges) stops.push([a - 70, 'transform:scale(1)'], [a, 'transform:scale(.84)'], [b, 'transform:scale(.84)'], [b + 90, 'transform:scale(1)']);
  return tl.cls(stops);
}

/** Caminho do cursor: [ms, x, y] com easing entre os pontos. */
function path(tl, points) {
  return tl.cls(points.map(([ms, x, y]) => [ms, `transform:translate(${r(x)}px,${r(y)}px)`, EASE_IO]));
}

function sceneFade(tl, t0, ms) {
  return tl.cls([
    [t0, 'opacity:0;transform:scale(.985)', EASE_OUT],
    [t0 + FADE, 'opacity:1;transform:scale(1)'],
    [t0 + ms - FADE, 'opacity:1;transform:scale(1)'],
    [t0 + ms, 'opacity:0;transform:scale(1)'],
  ]);
}

function bar(inner) {
  return `<rect width="${W}" height="38" fill="${C.bar}"/><rect y="37.5" width="${W}" height="1" fill="${C.hairline}"/>${inner}`;
}

function tool(name, x, on = false, cls = '') {
  return `<g class="${cls}">${on ? `<rect x="${x}" y="7" width="24" height="24" rx="6" fill="${C.accent}"/>` : ''}${icon(name, x + 5, 12, 14, on ? C.panel : C.onSoft, 2)}</g>`;
}

function pill(fs, text, xRight, y, iconName) {
  fs.use('sansBold', text);
  const tw = measure('sansBold', text, 11.5);
  const w = r(tw + (iconName ? 40 : 26));
  const x = r(xRight - w);
  return `<rect x="${x}" y="${y}" width="${w}" height="24" rx="12" fill="${C.accent}"/>${iconName ? icon(iconName, x + 11, y + 6, 12, C.panel, 2.4) : ''}<text class="pill-t" x="${r(x + (iconName ? 27 : 13))}" y="${y + 16.2}">${esc(text)}</text>`;
}

/* ======================= cena 1: código ======================= */

function sceneCode(P, t0, tl, fs, animated) {
  const g = (ms) => t0 + ms;
  const total = tl.total;
  const parts = [];
  const defs = [];

  // explorador
  fs.use('sansBold', 'EXPLORADOR');
  const files = [
    { name: 'carlos.ts', badge: 'TS', active: true },
    { name: 'projetos.ts', badge: 'TS' },
    { name: 'trajetoria.md', badge: 'MD' },
    { name: 'conquistas.md', badge: 'MD' },
    { name: 'README.md', badge: 'MD' },
  ];
  files.forEach((f) => fs.use('sans', f.name));
  fs.use('sansMedium', 'perfil');
  fs.use('sansBold', 'TSMD');
  fs.use('sansBold', 'ESTRUTURA LINHA DO TEMPO');
  parts.push(`<rect width="188" height="${STAGE.h}" fill="${C.panel}"/><rect x="187.5" width="1" height="${STAGE.h}" fill="${C.hairline}"/>
<text class="cap" x="20" y="28">EXPLORADOR</text>
${icon('chevron-down', 14, 45, 13, C.onSoft, 2)}${icon('folder', 30, 45, 13, C.accent, 1.9)}<text class="ui-m" x="50" y="56">perfil</text>
${files
  .map((f, i) => {
    const y = 82 + i * 26;
    const badge = f.badge === 'TS'
      ? `<rect x="40" y="${y - 10.5}" width="17" height="13" rx="3" fill="${C.codeString}"/><text class="badge" x="48.5" y="${y - 1}" fill="${C.panel}">TS</text>`
      : `<rect x="40.5" y="${y - 10}" width="16" height="12" rx="3" fill="none" stroke="${C.codeComment}"/><text class="badge" x="48.5" y="${y - 1.2}" fill="${C.onSoft}">MD</text>`;
    return `${f.active ? `<rect x="8" y="${y - 17}" width="172" height="24" rx="6" fill="${C.glow}" fill-opacity=".3"/>` : ''}${badge}<text class="${f.active ? 'ui-on' : 'ui'}" x="64" y="${y}">${esc(f.name)}</text>`;
  })
  .join('\n')}
<rect x="0" y="292.5" width="188" height="1" fill="${C.hairline}"/>${icon('chevron-right', 12, 300, 12, C.onSoft, 2)}<text class="cap" x="28" y="310">ESTRUTURA</text>
<rect x="0" y="319.5" width="188" height="1" fill="${C.hairline}"/>${icon('chevron-right', 12, 327, 12, C.onSoft, 2)}<text class="cap" x="28" y="337">LINHA DO TEMPO</text>`);

  // trilha (breadcrumb)
  fs.use('sans', 'perfil carlos.ts');
  fs.use('mono', 'carlos');
  parts.push(`<text class="crumb" x="206" y="24">perfil</text>${icon('chevron-right', 245, 14, 11, C.codeComment, 2)}<text class="crumb" x="259" y="24">carlos.ts</text>${icon('chevron-right', 318, 14, 11, C.codeComment, 2)}<text class="crumb crumb-on" x="332" y="24">carlos</text>`);

  // linha ativa (acompanha a digitação)
  const lineStarts = P.lines.map((l) => [g(l.d), r(l.y - 18.5)]);
  const hl = discrete([[0, r(P.lines[0].y - 18.5)], ...lineStarts], total);
  parts.push(
    animated
      ? `<rect x="189" y="${r(P.lines[0].y - 18.5)}" width="${W - 189}" height="${P.lh}" fill="#fff" fill-opacity=".035"><animate attributeName="y" dur="${total}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${hl.keyTimes}" values="${hl.values}"/></rect>`
      : `<rect x="189" y="${r(P.lines.at(-1).y - 18.5)}" width="${W - 189}" height="${P.lh}" fill="#fff" fill-opacity=".035"/>`,
  );

  // linhas
  P.lines.forEach((line, i) => {
    fs.use('mono', line.text + String(i + 1));
    const lnVisible = discrete([[0, 0], [g(line.d), 1], [g(P.ms), 0]], total);
    const ln = `<text class="ln" x="${P.lnRight}" y="${line.y}">${i + 1}${animated ? `<animate attributeName="opacity" dur="${total}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${lnVisible.keyTimes}" values="${lnVisible.values}"/>` : ''}</text>`;
    if (!line.n) return parts.push(ln);
    let indent = 0;
    const tokens = line.tokens.map(([k, t]) => [k, t]);
    if (tokens[0][0] === 'p' && /^\s+$/.test(tokens[0][1])) indent = tokens.shift()[1].length;
    const x = r(P.codeX + indent * P.charW);
    const spans = tokens.map(([k, t]) => `<tspan class="t-${k}">${esc(t)}</tspan>`).join('');
    if (animated) {
      const events = [[0, 0], [g(line.d), r(indent * P.charW)]];
      for (let k = 1; k <= line.n; k++) events.push([g(line.d + k * P.char), r(k * P.charW + 1)]);
      events.push([g(P.ms), 0]);
      const d = discrete(events, total);
      defs.push(`<clipPath id="cl${i}"><rect x="${P.codeX - 1}" y="${line.y - 19}" height="${P.lh}" width="0"><animate attributeName="width" dur="${total}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${d.keyTimes}" values="${d.values}"/></rect></clipPath>`);
      parts.push(`${ln}<text class="code" x="${x}" y="${line.y}" xml:space="preserve" clip-path="url(#cl${i})">${spans}</text>`);
    } else {
      parts.push(`${ln}<text class="code" x="${x}" y="${line.y}" xml:space="preserve">${spans}</text>`);
    }
    // minimapa
    const mw = r(Math.min(34, line.n * 0.78));
    const color = line.tokens.some(([k]) => k === 's') ? C.codeString : C.codeKey;
    if (animated) {
      const events = [[0, 0]];
      for (let k = 1; k <= line.n; k++) events.push([g(line.d + k * P.char), r(Math.min(34, k * 0.78))]);
      events.push([g(P.ms), 0]);
      const d = discrete(events, total);
      parts.push(`<rect x="${790 + indent * 0.78}" y="${r(52 + i * 4.6)}" height="2.2" width="0" rx="1" fill="${color}" fill-opacity=".55"><animate attributeName="width" dur="${total}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${d.keyTimes}" values="${d.values}"/></rect>`);
    } else {
      parts.push(`<rect x="${790 + indent * 0.78}" y="${r(52 + i * 4.6)}" height="2.2" width="${mw}" rx="1" fill="${color}" fill-opacity=".55"/>`);
    }
  });
  parts.push(`<rect x="786" y="44" width="42" height="60" rx="3" fill="#fff" fill-opacity=".03"/>`);

  // cursor de texto
  const last = P.lines.at(-1);
  const endX = r(P.codeX + last.n * P.charW + 2);
  if (animated) {
    const xs = [[0, P.codeX]];
    const ys = [[0, P.lines[0].y - 15.5]];
    for (const line of P.lines) {
      let indent = 0;
      if (line.tokens[0]?.[0] === 'p' && /^\s+$/.test(line.tokens[0][1])) indent = line.tokens[0][1].length;
      xs.push([g(line.d), r(P.codeX + indent * P.charW)]);
      ys.push([g(line.d), r(line.y - 15.5)]);
      for (let k = 1; k <= line.n; k++) xs.push([g(line.d + k * P.char), r(P.codeX + k * P.charW)]);
    }
    const dx = discrete(xs, total);
    const dy = discrete(ys, total);
    const vis = discrete([[0, 0], [g(P.start), 1], [g(P.end + 60), 0]], total);
    parts.push(`<rect x="${P.codeX}" y="${P.lines[0].y - 15.5}" width="2" height="19" fill="${C.codeKey}"><animate attributeName="x" dur="${total}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${dx.keyTimes}" values="${dx.values}"/><animate attributeName="y" dur="${total}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${dy.keyTimes}" values="${dy.values}"/><animate attributeName="opacity" dur="${total}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${vis.keyTimes}" values="${vis.values}"/></rect>`);
    parts.push(`<g class="${tl.win(g(P.end + 60), g(P.ms))}"><rect class="blink" x="${endX}" y="${last.y - 15.5}" width="9" height="19" fill="${C.codeKey}"/></g>`);
  } else {
    parts.push(`<rect x="${endX}" y="${last.y - 15.5}" width="9" height="19" fill="${C.codeKey}"/>`);
  }

  // barra de status
  fs.use('sans', 'main TypeScript UTF-8 LF Prettier');
  parts.push(`<rect y="346" width="${W}" height="24" fill="${C.bar}"/><rect y="345.5" width="${W}" height="1" fill="${C.hairline}"/>
${icon('git-branch', 12, 352, 12, C.onSoft, 2)}<text class="status" x="29" y="362">main</text>
${icon('check', 70, 352, 12, C.onSoft, 2.2)}<text class="status" x="86" y="362">0</text>
<text class="status" x="826" y="362" text-anchor="end">TypeScript</text><text class="status" x="746" y="362" text-anchor="end">UTF-8</text><text class="status" x="700" y="362" text-anchor="end">LF</text>`);

  return { body: `<rect width="${W}" height="${STAGE.h}" fill="${C.bg}"/>${parts.join('\n')}`, defs: defs.join('') };
}

/* ======================= cena 2: quadro de design ======================= */

function sceneDesign(P, t0, tl, fs) {
  const g = (ms) => t0 + ms;
  const F = { x: 240, y: 78, w: 360, h: 270 };
  const cq = F.w / 100;
  const parts = [];

  // barra de ferramentas
  fs.use('sans', 'Portfólio /');
  fs.use('sansMedium', 'Perfil');
  fs.use('sans', '100%');
  fs.use('display', 'CM');
  parts.push(bar(`${tool('mouse-pointer-2', 10, true)}${tool('hash', 40)}${tool('square', 70)}${tool('type', 100)}${tool('pen-tool', 130)}
<text class="ui" x="414" y="23.5" text-anchor="end">Portfólio /</text><text class="ui-m" x="420" y="23.5">Perfil</text>
<circle cx="640" cy="19" r="11" fill="${C.accent}"/><text class="avatar" x="640" y="23" text-anchor="middle">CM</text>
${pill(fs, 'Compartilhar', 778, 7)}<text class="ui" x="826" y="23.5" text-anchor="end">100%</text>`));

  // camadas
  fs.use('sansBold', 'Camadas');
  fs.use('sans', 'Assets');
  parts.push(`<rect y="38" width="170" height="${STAGE.h - 38}" fill="${C.panel}"/><rect x="169.5" y="38" width="1" height="${STAGE.h - 38}" fill="${C.hairline}"/>
<text class="ui-b" x="16" y="62">Camadas</text><text class="ui" x="84" y="62">Assets</text><rect x="16" y="70" width="58" height="2" rx="1" fill="${C.accent}"/>
<rect y="80.5" width="170" height="1" fill="${C.hairline}"/>
${icon('hash', 14, 92, 13, C.on, 2)}<text class="ui-b" x="34" y="103">Perfil</text>`);
  P.els.forEach((el, i) => {
    fs.use('sans', el.layer);
    const y = 130 + i * 26;
    const appear = tl.win(g(el.t), g(P.ms) + 1);
    const hi = tl.win(g(el.t), g(el.t + P.step * 0.85));
    parts.push(`<g class="${appear}"><rect class="${hi}" x="8" y="${y - 17}" width="154" height="24" rx="6" fill="${C.glow}" fill-opacity=".35"/>${icon(el.icon, 30, y - 11.5, 12, C.onSoft, 2)}<text class="ui" x="50" y="${y}">${esc(el.layer)}</text></g>`);
  });

  // tela com grade de pontos
  fs.use('sans', 'Perfil · 1440');
  parts.push(`<rect x="170" y="38" width="500" height="${STAGE.h - 38}" fill="url(#dots)"/>
<text class="tiny" x="${F.x}" y="${F.y - 8}">Perfil · 1440</text>
<rect x="${F.x + 2}" y="${F.y + 10}" width="${F.w - 4}" height="${F.h}" rx="4" fill="#000" fill-opacity=".28"/>
<rect x="${F.x}" y="${F.y}" width="${F.w}" height="${F.h}" fill="${C.paper}"/>`);

  // elementos do quadro
  const els = P.els.map((el) => {
    const x = (el.x / 100) * F.w;
    const y = (el.y / 100) * F.h;
    let svg = '';
    let w = 0;
    let h = 0;
    if (el.key === 'foto') {
      const d = 19 * cq;
      w = h = d;
      svg = `<circle cx="${r(x + d / 2)}" cy="${r(y + d / 2)}" r="${r(d / 2)}" fill="url(#photo)"/><text class="dz-cm" x="${r(x + d / 2)}" y="${r(y + d / 2 + 8)}" text-anchor="middle">CM</text>`;
    } else if (el.key === 'nome') {
      const size = 6.4 * cq;
      const a = fs.use('display', 'Carlos Michael');
      const b = fs.use('display', 'da Silva Sousa');
      w = Math.max(measure('display', a, size), measure('display', b, size));
      h = size * 2.1;
      svg = `<text class="dz-name" x="${r(x)}" y="${r(y + size * 0.84)}">${a}</text><text class="dz-name" x="${r(x)}" y="${r(y + size * 1.89)}">${b}</text>`;
    } else if (el.key === 'sub') {
      const size = 3.5 * cq;
      const t = fs.use('sansMedium', 'ADS · IFPI');
      w = measure('sansMedium', t, size, 0.5);
      h = size * 1.15;
      svg = `<text class="dz-sub" x="${r(x)}" y="${r(y + size * 0.9)}">${esc(t)}</text>`;
    } else if (el.key === 'cards') {
      const cw = (86 * cq - 3 * cq) / 2;
      w = 86 * cq;
      h = 46;
      fs.use('sansBold', 'ATUAÇÃO');
      svg = ['Investe Piauí', 'Vale do Mel']
        .map((label, i) => {
          fs.use('sansMedium', label);
          const cx = x + i * (cw + 3 * cq);
          return `<rect x="${r(cx)}" y="${r(y)}" width="${r(cw)}" height="${h}" rx="${r(1.6 * cq)}" fill="${C.paperSoft}"/><text class="dz-small" x="${r(cx + 2.6 * cq)}" y="${r(y + 17)}">ATUAÇÃO</text><text class="dz-card" x="${r(cx + 2.6 * cq)}" y="${r(y + 35)}">${esc(label)}</text>`;
        })
        .join('');
    } else {
      const size = 3.1 * cq;
      let cx = x;
      h = 21;
      svg = ['front-end', 'UX/UI', 'IoT']
        .map((t) => {
          fs.use('sans', t);
          const cw = measure('sans', t, size) + 4.8 * cq;
          const out = `<rect x="${r(cx + 0.5)}" y="${r(y + 0.5)}" width="${r(cw - 1)}" height="${h - 1}" rx="${(h - 1) / 2}" fill="none" stroke="${C.paperMuted}"/><text class="dz-tag" x="${r(cx + 2.4 * cq)}" y="${r(y + 14.6)}">${esc(t)}</text>`;
          cx += cw + 1.8 * cq;
          return out;
        })
        .join('');
      w = cx - x - 1.8 * cq;
    }
    return { ...el, px: x, py: y, w, h, svg };
  });

  const handles = (x, y, w, h) => {
    const p = 5;
    const box = [x - p, y - p, w + 2 * p, h + 2 * p];
    const corners = [[box[0], box[1]], [box[0] + box[2], box[1]], [box[0], box[1] + box[3]], [box[0] + box[2], box[1] + box[3]]];
    return `<rect x="${r(box[0])}" y="${r(box[1])}" width="${r(box[2])}" height="${r(box[3])}" fill="none" stroke="${C.glow}" stroke-width="1.2"/>${corners
      .map(([cx, cy]) => `<rect x="${r(cx - 3)}" y="${r(cy - 3)}" width="6" height="6" fill="${C.paper}" stroke="${C.glow}" stroke-width="1.2"/>`)
      .join('')}`;
  };

  fs.use('sansBold', '0123456789');
  const inner = els
    .map((el) => {
      const dx = r((el.dx / 100) * F.w);
      const dy = r((el.dy / 100) * F.h);
      const move = tl.cls([
        [g(el.t), `opacity:0;transform:translate(${dx}px,${dy}px) scale(.9)`, EASE_OUT],
        [g(el.t + 120), `opacity:1;transform:translate(${dx}px,${dy}px) scale(1)`, EASE_IO],
        [g(el.t + 700), 'opacity:1;transform:translate(0px,0px) scale(1)'],
      ]);
      const sel = tl.win(g(el.t), g(el.t + P.step * 0.85));
      // guia vertical de alinhamento ao soltar
      const guide = tl.cls([
        [g(el.t + 640), 'opacity:0'],
        [g(el.t + 700), 'opacity:1'],
        [g(el.t + 1000), 'opacity:1'],
        [g(el.t + 1150), 'opacity:0'],
      ]);
      return `<line class="${guide}" x1="${r(el.px)}" y1="0" x2="${r(el.px)}" y2="${F.h}" stroke="${C.glow}" stroke-width="1" stroke-dasharray="3 3"/>
<g class="${move} box">${el.svg}<g class="${sel}">${handles(el.px, el.py, el.w, el.h)}</g></g>`;
    })
    .join('\n');
  parts.push(`<g transform="translate(${F.x} ${F.y})">${inner}</g>`);

  // propriedades
  fs.use('sansBold', 'Design');
  fs.use('sans', 'Protótipo Preenchimento Texto X Y L A');
  parts.push(`<rect x="670" y="38" width="170" height="${STAGE.h - 38}" fill="${C.panel}"/><rect x="670" y="38" width="1" height="${STAGE.h - 38}" fill="${C.hairline}"/>
<text class="ui-b" x="686" y="62">Design</text><text class="ui" x="740" y="62">Protótipo</text><rect x="686" y="70" width="44" height="2" rx="1" fill="${C.accent}"/>
<rect x="670" y="80.5" width="170" height="1" fill="${C.hairline}"/>
<text class="cap" x="686" y="194">PREENCHIMENTO</text><text class="cap" x="686" y="250">TEXTO</text>`);
  fs.use('sansBold', 'PREENCHIMENTO TEXTO');

  const props = [
    { name: 'Perfil', x: 0, y: 0, w: 1440, h: 1080, fill: '#FCFBFB', font: ['—', 'Quadro 4:3'], from: -Infinity, to: g(P.els[0].t) },
    ...els.map((el, i) => ({
      name: el.layer,
      x: Math.round(el.x * 14.4),
      y: Math.round(el.y * 10.8),
      w: Math.round((el.w / F.w) * 1440),
      h: Math.round((el.h / F.h) * 1080),
      fill: el.fill,
      font: el.font,
      from: g(el.t),
      to: i === els.length - 1 ? g(el.t + P.step + 300) : g(els[i + 1].t),
    })),
  ];
  props.push({ ...props[0], from: props.at(-1).to, to: Infinity });
  const field = (x, y, label, value) => `<rect x="${x}" y="${y}" width="68" height="24" rx="6" fill="${C.bar}" stroke="${C.hairline}"/><text class="ui" x="${x + 9}" y="${y + 16.2}" fill-opacity=".8">${label}</text><text class="ui-on num" x="${x + 24}" y="${y + 16.2}">${value}</text>`;
  props.forEach((p) => {
    fs.use('sansBold', p.name);
    fs.use('sans', `${p.x}${p.y}${p.w}${p.h}${p.fill}${p.font.join('')}`);
    const cls = tl.win(p.from === -Infinity ? 0 : p.from, p.to === Infinity ? tl.total + 1 : p.to);
    const swatch = p.fill === 'Gradiente' ? 'url(#photo)' : p.fill;
    parts.push(`<g class="${cls}"><text class="ui-b" x="686" y="102">${esc(p.name)}</text>
${field(686, 114, 'X', p.x)}${field(760, 114, 'Y', p.y)}${field(686, 146, 'L', p.w)}${field(760, 146, 'A', p.h)}
<rect x="686" y="204" width="18" height="18" rx="5" fill="${swatch}" stroke="${C.hairline}"/><text class="ui-on" x="712" y="217.5">${esc(p.fill)}</text>
<text class="ui-on" x="686" y="272">${esc(p.font[0])}</text><text class="ui" x="686" y="291">${esc(p.font[1])}</text></g>`);
  });

  // cursor
  const at = (px, py) => [F.x + (px / 100) * F.w, F.y + (py / 100) * F.h];
  const rest = at(93, 84);
  const pts = [[g(0), ...rest]];
  for (const el of P.els) {
    const from = at(el.x + el.dx + el.gx, el.y + el.dy + el.gy);
    const to = at(el.x + el.gx, el.y + el.gy);
    pts.push([g(el.t - 60), ...from], [g(el.t + 120), ...from], [g(el.t + 700), ...to], [g(el.t + 820), ...to]);
  }
  pts.push([g(P.ms - 1000), ...rest], [g(P.ms), ...rest]);
  const press = presses(tl, P.els.map((el) => [g(el.t + 120), g(el.t + 700)]));
  parts.push(cursor(fs, path(tl, pts), press));

  return { body: `<rect width="${W}" height="${STAGE.h}" fill="${C.bg}"/>${parts.join('\n')}`, defs: '' };
}

/* ======================= cena 3: documento ======================= */

function sceneDocs(P, t0, tl, fs) {
  const g = (ms) => t0 + ms;
  const total = tl.total;
  const parts = [];
  const defs = [];
  const sub = P.lines[1];
  const firstLi = P.lines[2];

  // faixa de opções
  fs.use('sans', 'Título Normal Inter 11 Salvando… Salvo');
  const styleA = tl.win(0, g(sub.d));
  const styleB = tl.win(g(sub.d), total + 1);
  const listOn = tl.win(g(firstLi.d), total + 1);
  const saving = tl.win(0, g(P.end + 700));
  const saved = tl.win(g(P.end + 700), total + 1);
  parts.push(bar(`<rect x="10.5" y="7.5" width="96" height="23" rx="5" fill="none" stroke="${C.hairline}"/><text class="ui-on ${styleA}" x="20" y="23.5">Título</text><text class="ui-on ${styleB}" x="20" y="23.5">Normal</text>${icon('chevron-down', 88, 13, 12, C.onSoft, 2)}
<rect x="114.5" y="7.5" width="58" height="23" rx="5" fill="none" stroke="${C.hairline}"/><text class="ui" x="124" y="23.5">Inter</text>
<rect x="180.5" y="7.5" width="32" height="23" rx="5" fill="none" stroke="${C.hairline}"/><text class="ui" x="189" y="23.5">11</text>
<rect x="224" y="11" width="1" height="16" fill="${C.hairline}"/>
${tool('bold', 232)}${tool('italic', 260)}${tool('underline', 288)}
<rect x="320" y="11" width="1" height="16" fill="${C.hairline}"/>
${tool('align-left', 328)}${tool('align-center', 356)}
<g><rect class="${listOn}" x="384" y="7" width="24" height="24" rx="6" fill="${C.glow}" fill-opacity=".45"/>${icon('list', 389, 12, 14, C.on, 2)}</g>
<g class="${saving}">${`<g transform="translate(626 19)"><g class="spin">${icon('loader-circle', -7, -7, 14, C.onSoft, 2)}</g></g>`}<text class="ui" x="640" y="23.5">Salvando…</text></g>
<g class="${saved}">${icon('cloud-check', 619, 12, 15, C.accent, 2)}<text class="ui" x="640" y="23.5">Salvo</text></g>
${pill(fs, 'Compartilhar', 828, 7, 'share-2')}`));

  // mesa e página
  const { page } = P;
  parts.push(`<rect x="${page.x + 3}" y="${page.y + 12}" width="${page.w - 6}" height="${STAGE.h}" rx="3" fill="#000" fill-opacity=".3"/>
<rect x="${page.x}" y="${page.y}" width="${page.w}" height="${STAGE.h}" fill="${C.paper}"/>`);

  P.lines.forEach((line, i) => {
    fs.use(line.font, line.text);
    const cls = line.kind === 'title' ? 'dc-title' : line.kind === 'sub' ? 'dc-sub' : 'dc-li';
    const events = [[0, 0]];
    for (let k = 1; k <= line.n; k++) events.push([g(line.d + k * P.char), r(line.widths[k - 1] + 2)]);
    events.push([g(P.ms), 0]);
    const d = discrete(events, total);
    const top = line.y - line.size * 1.05;
    defs.push(`<clipPath id="dl${i}"><rect x="${line.x - 2}" y="${r(top)}" height="${r(line.size * 1.5)}" width="0"><animate attributeName="width" dur="${total}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${d.keyTimes}" values="${d.values}"/></rect></clipPath>`);
    if (line.kind === 'li') {
      const bullet = discrete([[0, 0], [g(line.d), 1], [g(P.ms), 0]], total);
      parts.push(`<circle cx="${line.x - 10}" cy="${r(line.y - 4.6)}" r="2.6" fill="${C.paperAccent}" opacity="0"><animate attributeName="opacity" dur="${total}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${bullet.keyTimes}" values="${bullet.values}"/></circle>`);
    }
    parts.push(`<text class="${cls}" x="${line.x}" y="${line.y}" clip-path="url(#dl${i})">${esc(line.text)}</text>`);
  });

  // cursor de texto
  const xs = [[0, P.lines[0].x]];
  const ys = [[0, r(P.lines[0].y - P.lines[0].size * 0.82)]];
  const hs = [[0, r(P.lines[0].size * 1.02)]];
  for (const line of P.lines) {
    xs.push([g(line.d), line.x]);
    ys.push([g(line.d), r(line.y - line.size * 0.82)]);
    hs.push([g(line.d), r(line.size * 1.02)]);
    for (let k = 1; k <= line.n; k++) xs.push([g(line.d + k * P.char), r(line.x + line.widths[k - 1] + 1)]);
  }
  const dx = discrete(xs, total);
  const dy = discrete(ys, total);
  const dh = discrete(hs, total);
  const vis = discrete([[0, 0], [g(P.start), 1], [g(P.end + 60), 0]], total);
  parts.push(`<rect x="${P.lines[0].x}" y="0" width="1.6" height="20" fill="${C.onPaper}"><animate attributeName="x" dur="${total}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${dx.keyTimes}" values="${dx.values}"/><animate attributeName="y" dur="${total}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${dy.keyTimes}" values="${dy.values}"/><animate attributeName="height" dur="${total}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${dh.keyTimes}" values="${dh.values}"/><animate attributeName="opacity" dur="${total}ms" repeatCount="indefinite" calcMode="discrete" keyTimes="${vis.keyTimes}" values="${vis.values}"/></rect>`);
  const last = P.lines.at(-1);
  parts.push(`<g class="${tl.win(g(P.end + 60), g(P.ms))}"><rect class="blink" x="${r(last.x + last.widths.at(-1) + 1)}" y="${r(last.y - last.size * 0.82)}" width="1.6" height="${r(last.size * 1.02)}" fill="${C.onPaper}"/></g>`);

  // comentário na margem quando o texto termina
  fs.use('sansBold', 'Carlos');
  fs.use('sans', 'agora Resumo pronto para o portfólio');
  const note = tl.cls([
    [g(P.end + 500), 'opacity:0;transform:translateX(14px)', EASE_OUT],
    [g(P.end + 1000), 'opacity:1;transform:translateX(0px)'],
  ]);
  parts.push(`<g class="${note}"><rect x="690.5" y="120.5" width="136" height="66" rx="10" fill="${C.bar}" stroke="${C.hairline}"/>
<circle cx="709" cy="140" r="10" fill="${C.accent}"/><text class="avatar-s" x="709" y="143.6" text-anchor="middle">CM</text>
<text class="ui-b" x="724" y="144">Carlos</text><text class="tiny" x="768" y="144">agora</text>
<text class="ui" x="702" y="166">Resumo pronto para</text><text class="ui" x="702" y="180">o portfólio</text></g>
<path class="${note}" d="M670 132.5h20" stroke="${C.glow}" stroke-dasharray="2 3"/>`);
  fs.use('sans', 'Resumo pronto para o portfólio');
  fs.use('display', 'CM');

  return { body: `<rect width="${W}" height="${STAGE.h}" fill="${C.bg}"/>${parts.join('\n')}`, defs: defs.join('') };
}

/* ======================= cena 4: slides ======================= */

function sceneSlides(P, t0, tl, fs) {
  const g = (ms) => t0 + ms;
  const { T } = P;
  const total = tl.total;
  const parts = [];
  const SL = { x: 232, y: 52, w: 544, h: 306 };
  const TH = { x: 36, y: 60, w: 116, h: 65.25, gap: 20 };
  const STEP = TH.h + TH.gap;
  const cq = SL.w / 100;
  const thumbAt = (row) => [TH.x + TH.w * 0.55, TH.y + row * STEP + TH.h * 0.55];
  const slideAt = (sx, sy) => [SL.x + (sx / 100) * SL.w, SL.y + (sy / 100) * SL.h];

  // barra
  fs.use('sansMedium', 'Slide 1 de 3 2');
  fs.use('sansBold', 'Apresentar');
  const c1 = tl.win(0, g(T.clickC));
  const c2 = tl.win(g(T.clickC), g(T.clickB));
  const c3 = tl.win(g(T.clickB), total + 1);
  parts.push(bar(`${tool('plus', 10)}${tool('layers', 40)}
<text class="ui-m ${c1}" x="420" y="23.5" text-anchor="middle">Slide 1 de 3</text><text class="ui-m ${c2}" x="420" y="23.5" text-anchor="middle">Slide 2 de 3</text><text class="ui-m ${c3}" x="420" y="23.5" text-anchor="middle">Slide 3 de 3</text>
${pill(fs, 'Apresentar', 828, 7, 'play')}`));

  // trilho de miniaturas
  parts.push(`<rect y="38" width="168" height="${STAGE.h - 38}" fill="${C.panel}"/><rect x="167.5" y="38" width="1" height="${STAGE.h - 38}" fill="${C.hairline}"/>`);
  fs.use('sansMedium', '123');
  [0, 1, 2].forEach((row) => parts.push(`<text class="num-s" x="16" y="${r(TH.y + row * STEP + 11)}">${row + 1}</text>`));

  const mini = (x, y, w, h, o = 0.22, rx = 1.5) => `<rect x="${r(TH.x + (x / 100) * TH.w)}" y="${r((y / 100) * TH.h)}" width="${r((w / 100) * TH.w)}" height="${r((h / 100) * TH.h)}" rx="${rx}" fill="${C.onPaper}" fill-opacity="${o}"/>`;
  const thumb = (row, content, ringCls, moveCls) => `<g class="${moveCls}"><g transform="translate(0 ${r(TH.y + row * STEP)})">
<rect class="${ringCls}" x="${TH.x - 4}" y="-4" width="${TH.w + 8}" height="${r(TH.h + 8)}" rx="7" fill="none" stroke="${C.accent}" stroke-width="2.4"/>
<rect x="${TH.x}" y="0" width="${TH.w}" height="${TH.h}" rx="4" fill="${C.paper}"/>${content}</g></g>`;
  const thA = mini(25, 36, 50, 13, 0.6) + mini(33, 58, 34, 7);
  const thB = mini(9, 14, 30, 11, 0.55) + mini(9, 44, 17, 12, 0.22, 4) + mini(29, 44, 17, 12, 0.22, 4) + mini(49, 44, 17, 12, 0.22, 4) + mini(9, 70, 60, 7);
  const thC = mini(9, 14, 30, 11, 0.55) + mini(9, 44, 38, 34) + mini(53, 44, 38, 34);
  const ringA = tl.win(0, g(T.clickC + 120), 'opacity:1', 'opacity:0');
  const ringC = tl.win(g(T.clickC + 120), g(T.clickB + 120));
  const ringB = tl.win(g(T.clickB + 120), total + 1);
  const moveB = tl.cls([[g(T.grab + 300), 'transform:translateY(0px)', EASE_IO], [g(T.drop), `transform:translateY(${r(STEP)}px)`]]);
  const moveC = tl.cls([[g(T.grab + 120), 'transform:translateY(0px)', EASE_IO], [g(T.drop), `transform:translateY(${r(-STEP)}px)`]]);
  parts.push(thumb(0, thA, ringA, ''), thumb(1, thB, ringB, moveB), thumb(2, thC, ringC, moveC));

  // slide principal
  parts.push(`<rect x="${SL.x + 3}" y="${SL.y + 12}" width="${SL.w - 6}" height="${SL.h}" rx="6" fill="#000" fill-opacity=".3"/><rect x="${SL.x}" y="${SL.y}" width="${SL.w}" height="${SL.h}" rx="5" fill="${C.paper}"/>`);
  const fadeWin = (from, to) => {
    const stops = [[0, `opacity:${from === 0 ? 1 : 0}`]];
    if (from > 0) stops.push([g(from), 'opacity:0'], [g(from + 300), 'opacity:1']);
    if (to !== null) stops.push([g(to), 'opacity:1'], [g(to + 300), 'opacity:0']);
    return tl.cls(stops);
  };
  const pop = (t) => tl.cls([[g(t), 'opacity:0;transform:translateY(10px) scale(.96)', EASE_OUT], [g(t + 450), 'opacity:1;transform:translateY(0px) scale(1)']]);

  // A: capa
  fs.use('sansBold', 'PORTFÓLIO');
  fs.use('display', 'Carlos Michael');
  fs.use('sans', 'da Silva Sousa · ADS · IFPI');
  const cx = SL.x + SL.w / 2;
  parts.push(`<g class="${fadeWin(0, T.showC)}">
<text class="sl-kicker" x="${cx}" y="${SL.y + 104}" text-anchor="middle">PORTFÓLIO</text>
<text class="sl-title" x="${cx}" y="${SL.y + 162}" text-anchor="middle">Carlos Michael</text>
<rect x="${r(cx - 32)}" y="${SL.y + 180}" width="64" height="2" fill="${C.paperAccent}"/>
<text class="sl-sub" x="${cx}" y="${SL.y + 214}" text-anchor="middle">da Silva Sousa · ADS · IFPI</text></g>`);

  // C: atuação
  fs.use('display', 'Atuação Foco');
  fs.use('sansBold', 'ASSESSOR TÉCNICO DIRETOR DE TECNOLOGIA');
  fs.use('sansMedium', 'Investe Piauí Vale do Mel');
  const head = (t, text) => `<text class="sl-head ${pop(t)} box" x="${r(SL.x + 0.08 * SL.w)}" y="${r(SL.y + 0.12 * SL.h + 30)}">${text}</text>`;
  const card = (x, small, label) => {
    const cxp = SL.x + (x / 100) * SL.w;
    const cy = SL.y + 0.46 * SL.h;
    return `<rect x="${r(cxp)}" y="${r(cy)}" width="${r(0.4 * SL.w)}" height="${r(0.34 * SL.h)}" rx="${r(1.6 * cq)}" fill="${C.paperSoft}"/><text class="sl-small" x="${r(cxp + 3 * cq)}" y="${r(cy + 42)}">${small}</text><text class="sl-card" x="${r(cxp + 3 * cq)}" y="${r(cy + 72)}">${esc(label)}</text>`;
  };
  const card2To = slideAt(52 + 6, 46 + 8);
  const drag = { dx: r(0.14 * SL.w), dy: r(0.22 * SL.h) };
  const card2From = [card2To[0] + drag.dx, card2To[1] + drag.dy];
  const dragCls = tl.cls([
    [g(T.drag2), `opacity:0;transform:translate(${drag.dx}px,${drag.dy}px) scale(.92)`, EASE_OUT],
    [g(T.drag2 + 120), `opacity:1;transform:translate(${drag.dx}px,${drag.dy}px) scale(1)`, EASE_IO],
    [g(T.drop2), 'opacity:1;transform:translate(0px,0px) scale(1)'],
  ]);
  parts.push(`<g class="${fadeWin(T.showC, T.showB)}">${head(T.showC + 150, 'Atuação')}
<g class="${pop(T.card1)} box">${card(8, 'ASSESSOR TÉCNICO', 'Investe Piauí')}</g>
<g class="${dragCls} box">${card(52, 'DIRETOR DE TECNOLOGIA', 'Vale do Mel')}</g></g>`);

  // B: foco
  const chipSize = 3.6 * cq;
  let chipX = SL.x + 0.08 * SL.w;
  const chips = ['front-end', 'UX/UI', 'IoT']
    .map((t, i) => {
      fs.use('sans', t);
      const w = measure('sans', t, chipSize) + 6 * cq;
      const y = SL.y + 0.42 * SL.h;
      const out = `<g class="${pop(T.chips + i * 150)} box"><rect x="${r(chipX + 0.5)}" y="${r(y + 0.5)}" width="${r(w - 1)}" height="37" rx="18.5" fill="none" stroke="${C.paperMuted}"/><text class="sl-chip" x="${r(chipX + 3 * cq)}" y="${r(y + 25)}">${esc(t)}</text></g>`;
      chipX += w + 2 * cq;
      return out;
    })
    .join('');
  fs.use('sans', 'Pesquisa: inovação e empreendedorismo');
  parts.push(`<g class="${fadeWin(T.showB, null)}">${head(T.showB + 150, 'Foco')}${chips}
<text class="sl-line ${pop(T.line)} box" x="${r(SL.x + 0.08 * SL.w)}" y="${r(SL.y + 0.7 * SL.h + 18)}">Pesquisa: inovação e empreendedorismo</text></g>`);

  // cursor
  const P0 = slideAt(86, 84);
  const pts = [
    [g(0), ...P0],
    [g(450), ...P0],
    [g(T.grab - 80), ...thumbAt(2)],
    [g(T.grab + 120), ...thumbAt(2)],
    [g(T.drop), ...thumbAt(1)],
    [g(T.clickC + 160), ...thumbAt(1)],
    [g(T.drag2 - 60), ...card2From],
    [g(T.drag2 + 120), ...card2From],
    [g(T.drop2), ...card2To],
    [g(T.drop2 + 250), ...card2To],
    [g(T.clickB - 160), ...thumbAt(2)],
    [g(T.clickB + 160), ...thumbAt(2)],
    [g(T.line + 400), ...slideAt(72, 82)],
    [g(P.ms - 900), ...P0],
    [g(P.ms), ...P0],
  ];
  const press = presses(tl, [[g(T.grab), g(T.drop)], [g(T.clickC), g(T.clickC + 160)], [g(T.drag2 + 60), g(T.drop2)], [g(T.clickB), g(T.clickB + 160)]]);
  parts.push(cursor(fs, path(tl, pts), press));

  return { body: `<rect width="${W}" height="${STAGE.h}" fill="${C.bg}"/>${parts.join('\n')}`, defs: '' };
}

/* ======================= montagem ======================= */

export function studio(mode) {
  const fs = new FontSet();
  const plans = { code: planCode(), design: planDesign(), docs: planDocs(), slides: planSlides() };
  const meta = [
    { id: 'code', label: 'Código', icon: 'code-xml' },
    { id: 'design', label: 'Design', icon: 'pen-tool' },
    { id: 'docs', label: 'Docs', icon: 'file-text' },
    { id: 'slides', label: 'Slides', icon: 'presentation' },
  ];
  let clock = 0;
  for (const m of meta) {
    m.t0 = clock;
    m.ms = plans[m.id].ms;
    clock += m.ms;
  }
  const tl = new Timeline(clock);
  const [code, design, docs, slides] = meta;

  const sCode = sceneCode(plans.code, code.t0, tl, fs, true);
  const sDesign = sceneDesign(plans.design, design.t0, tl, fs);
  const sDocs = sceneDocs(plans.docs, docs.t0, tl, fs);
  const sSlides = sceneSlides(plans.slides, slides.t0, tl, fs);
  const sStatic = sceneCode(plans.code, 0, new Timeline(clock), fs, false);

  const scenes = [
    [code, sCode],
    [design, sDesign],
    [docs, sDocs],
    [slides, sSlides],
  ]
    .map(([m, s]) => `<g class="${sceneFade(tl, m.t0, m.ms)} box">${s.body}</g>`)
    .join('\n');

  // rodapé: progresso das quatro visões
  const segW = (W - 44 - 3 * 14) / 4;
  const foot = (animated) =>
    meta
      .map((m, i) => {
        fs.use('sansMedium', m.label);
        const x = r(22 + i * (segW + 14));
        const y = FOOT.y;
        const label = animated ? tl.win(m.t0, m.t0 + m.ms, `fill:${C.on}`, `fill:${C.onSoft}`) : '';
        const iconCls = animated ? tl.win(m.t0, m.t0 + m.ms, `stroke:${C.accent}`, `stroke:${C.codeComment}`) : '';
        const fill = animated
          ? tl.cls([
              [m.t0, 'transform:scaleX(0);opacity:1'],
              [m.t0 + m.ms, 'transform:scaleX(1);opacity:1'],
              [tl.total - 420, 'transform:scaleX(1);opacity:1'],
              [tl.total - 20, 'transform:scaleX(1);opacity:0'],
            ])
          : '';
        const on = !animated && i === 0;
        return `<g class="${iconCls}" stroke="${on ? C.accent : C.codeComment}">${icon(m.icon, x, y + 13, 14, on ? C.accent : C.codeComment, 2).replace(/ stroke="[^"]*"/, '')}</g>
<text class="foot-t ${label}" x="${r(x + 21)}" y="${y + 24.6}" fill="${on ? C.on : C.onSoft}">${esc(m.label)}</text>
<rect x="${x}" y="${y + 36}" width="${r(segW)}" height="3" rx="1.5" fill="${C.hairline}"/>
${animated ? `<rect class="${fill} bar-fill" x="${x}" y="${y + 36}" width="${r(segW)}" height="3" rx="1.5" fill="${C.accent}"/>` : on ? `<rect x="${x}" y="${y + 36}" width="${r(segW)}" height="3" rx="1.5" fill="${C.accent}"/>` : ''}`;
      })
      .join('\n');

  const footAnim = foot(true);
  const footStatic = foot(false);
  fs.use('mono', 'carlos.ts');
  const css = `
${fs.css()}
text{font-kerning:normal}
.code{font:400 16px JB;fill:${C.codePunct}}
.t-c{fill:${C.codeComment};font-style:italic}.t-k,.t-s{fill:${C.codeString}}.t-v{fill:${C.codeKey}}.t-p{fill:${C.codePunct}}
.ln{font:400 14px JB;fill:${C.codeComment};text-anchor:end}
.file{font:400 13px JB;fill:${C.onSoft}}
.cap{font:600 10.5px IN;letter-spacing:1.2px;fill:${C.onSoft}}
.ui{font:400 12.5px IN;fill:${C.onSoft}}
.ui-on{font:400 12.5px IN;fill:${C.on}}
.ui-m{font:500 13px IN;fill:${C.on}}
.ui-b{font:600 12.5px IN;fill:${C.on}}
.num{font-variant-numeric:tabular-nums}
.num-s{font:500 11px IN;fill:${C.onSoft}}
.tiny{font:400 11px IN;fill:${C.onSoft}}
.badge{font:600 7.5px IN;text-anchor:middle;letter-spacing:.3px}
.crumb{font:400 12px IN;fill:${C.codeComment}}.crumb-on{fill:${C.onSoft}}
.status{font:400 11px IN;fill:${C.onSoft}}
.pill-t{font:600 11.5px IN;fill:${C.panel}}
.avatar{font:500 12px CG;fill:${C.panel}}
.avatar-s{font:600 10.5px CG;fill:${C.panel}}
.cur-t{font:600 10.5px IN;fill:${C.panel}}
.foot-t{font:500 12.5px IN}
.dz-cm{font:500 23.4px CG;fill:${C.paper}}
.dz-name{font:500 23px CG;fill:${C.onPaper};letter-spacing:-.4px}
.dz-sub{font:500 12.6px IN;fill:${C.paperMuted};letter-spacing:.5px}
.dz-small{font:600 8.3px IN;fill:${C.paperAccent};letter-spacing:1px}
.dz-card{font:500 13px IN;fill:${C.onPaper}}
.dz-tag{font:400 11.2px IN;fill:${C.onPaper}}
.dc-title{font:500 31px CG;fill:${C.onPaper};letter-spacing:-.3px}
.dc-sub{font:400 13.5px IN;fill:${C.paperMuted}}
.dc-li{font:400 13.5px IN;fill:${C.onPaper}}
.sl-kicker{font:600 15px IN;fill:${C.paperAccent};letter-spacing:3px}
.sl-title{font:500 54px CG;fill:${C.onPaper};letter-spacing:-1px}
.sl-sub{font:400 19px IN;fill:${C.paperMuted}}
.sl-head{font:500 38px CG;fill:${C.onPaper}}
.sl-small{font:600 11px IN;fill:${C.paperAccent};letter-spacing:.9px}
.sl-card{font:500 21px IN;fill:${C.onPaper}}
.sl-chip{font:400 19px IN;fill:${C.onPaper}}
.sl-line{font:400 19px IN;fill:${C.paperMuted}}
.box{transform-box:fill-box;transform-origin:center}
.bar-fill{transform-box:fill-box;transform-origin:left center}
.tip{transform-origin:0 0}
.blink{animation:blink 1.05s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.spin{animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
${tl.css()}
.static{display:none}
@media (prefers-reduced-motion:reduce){.anim{display:none}.static{display:inline}}
`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
<title id="t">carlos.ts: o mesmo resumo em código, design, documento e slides</title>
<desc id="d">Janela de editor que alterna quatro visões do perfil de Carlos Michael da Silva Sousa: código em TypeScript sendo digitado, um quadro de design montado camada por camada, um documento de texto sendo escrito e uma apresentação de slides sendo reorganizada. Formação: ADS no IFPI. Atuação: Investe Piauí e Vale do Mel. Foco: front-end, UX/UI e IoT. Pesquisa: inovação e empreendedorismo. Idiomas: português, inglês e espanhol.</desc>
<style>${css}</style>
<defs>
<clipPath id="card"><rect width="${W}" height="${H}" rx="18"/></clipPath>
<clipPath id="stage"><rect y="${STAGE.y}" width="${W}" height="${STAGE.h}"/></clipPath>
<pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="1" fill="${C.hairline}"/></pattern>
<linearGradient id="photo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.paperMuted}"/><stop offset="1" stop-color="${C.onPaper}"/></linearGradient>
<filter id="csh" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="1.6" flood-color="#000" flood-opacity=".4"/></filter>
${sCode.defs}${sDocs.defs}
</defs>
<g clip-path="url(#card)">
<rect width="${W}" height="${H}" fill="${C.bg}"/>
<rect width="${W}" height="${CHROME}" fill="${C.bar}"/><rect y="${CHROME - 1}" width="${W}" height="1" fill="${C.hairline}"/>
<circle cx="24" cy="23" r="6" fill="${C.codeString}"/><circle cx="44" cy="23" r="6" fill="${C.codePunct}" fill-opacity=".55"/><circle cx="64" cy="23" r="6" fill="${C.codePunct}" fill-opacity=".55"/>
<text class="file" x="86" y="27.5">carlos.ts</text>
<g clip-path="url(#stage)"><g transform="translate(0 ${STAGE.y})">
<g class="anim">${scenes}</g>
<g class="static">${sStatic.body}</g>
</g></g>
<rect y="${FOOT.y}" width="${W}" height="1" fill="${C.hairline}"/>
<g class="anim">${footAnim}</g>
<g class="static">${footStatic}</g>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="17.5" fill="none" stroke="${C.hairline}"/>
</svg>
`;
}

export const STUDIO_SIZE = { W, H };
