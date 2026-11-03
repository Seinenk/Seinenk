// Gera o cartão "Atividade no GitHub" (claro e escuro) a partir da API GraphQL do GitHub.
// Roda no workflow "Perfil" todos os dias. Sem dependências: só Node 22.
//
//   GITHUB_TOKEN=... node .github/scripts/atividade.mjs            (dados reais)
//   node .github/scripts/atividade.mjs --mock dados.json           (teste local)
//
// Ícones: Lucide (licença ISC). Fontes: Inter e Cormorant Garamond (licença OFL), embutidas.
import fs from 'node:fs';
import path from 'node:path';

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const SAIDA = process.env.SAIDA ?? 'dist';
const USUARIO = process.env.USUARIO ?? 'Seinenk';

const PALETA = {
  light: {
    canvas: '#FAF9F8', card: '#F0EBE8', hairline: '#E9E3DF', ink: '#181722', body: '#393F4A',
    muted: '#58555B', accent: '#8A7875', accentStrong: '#65595B',
    ramp: ['#181722', '#393F4A', '#65595B', '#8A7875', '#B5A8A3', '#DCD2CC'],
  },
  dark: {
    canvas: '#181722', card: '#21222D', hairline: '#2C2F3A', ink: '#FBFAF9', body: '#E2DCD8',
    muted: '#ABA6A6', accent: '#AA9B97', accentStrong: '#BCAFAA',
    ramp: ['#FBFAF9', '#DCD2CC', '#B5A8A3', '#8A7875', '#5E5660', '#393F4A'],
  },
};

const ICONES = {
  dias: '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
  zap: '<path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"/>',
  flame: '<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>',
  repo: '<path d="M18 19a5 5 0 0 1-5-5v8"/><path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5"/><circle cx="13" cy="12" r="2"/><circle cx="20" cy="19" r="2"/>',
  history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
};

// O token padrão do Actions lê o calendário de contribuições (que inclui as privadas,
// se o perfil mostrar), mas não os commits de outros repositórios; por isso o cartão
// usa só números que saem do calendário e dos dados públicos dos repositórios.
const CONSULTA = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
    }
  }
}`;

async function api(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'perfil-seinenk',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`${url}: ${res.status} ${JSON.stringify(json.errors ?? json)}`);
  return json;
}

async function buscar() {
  const mock = process.argv.indexOf('--mock');
  if (mock > -1) return JSON.parse(fs.readFileSync(process.argv[mock + 1], 'utf8'));
  if (!process.env.GITHUB_TOKEN) throw new Error('Defina GITHUB_TOKEN (ou use --mock arquivo.json).');
  const [grafo, usuario, repos] = await Promise.all([
    api('https://api.github.com/graphql', { method: 'POST', body: JSON.stringify({ query: CONSULTA, variables: { login: USUARIO } }) }),
    api(`https://api.github.com/users/${USUARIO}`),
    api(`https://api.github.com/users/${USUARIO}/repos?type=owner&per_page=100&sort=pushed`),
  ]);
  return { calendario: grafo.data.user.contributionsCollection.contributionCalendar, usuario, repos };
}

/* ---------- números ---------- */

function resumir({ calendario, usuario, repos }) {
  const dias = calendario.weeks.flatMap((w) => w.contributionDays);
  // sequência atual: conta para trás a partir de hoje (ou de ontem, se hoje ainda está zerado)
  let i = dias.length - 1;
  if (i >= 0 && dias[i].contributionCount === 0) i--;
  let atual = 0;
  while (i >= 0 && dias[i].contributionCount > 0) {
    atual++;
    i--;
  }
  let maior = 0;
  let corrida = 0;
  for (const d of dias) {
    corrida = d.contributionCount > 0 ? corrida + 1 : 0;
    maior = Math.max(maior, corrida);
  }
  const semanas = calendario.weeks.map((w) => w.contributionDays.reduce((s, d) => s + d.contributionCount, 0));

  // linguagem principal de cada repositório próprio (bytes favorecem SDKs copiados nos projetos)
  const contagem = new Map();
  for (const repo of repos) {
    if (repo.fork || !repo.language) continue;
    contagem.set(repo.language, (contagem.get(repo.language) ?? 0) + 1);
  }
  const totalRepos = [...contagem.values()].reduce((a, b) => a + b, 0) || 1;
  let linguagens = [...contagem.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([nome, n]) => ({ nome, n, pct: (n / totalRepos) * 100 }));
  if (linguagens.length > 6) {
    const resto = linguagens.slice(5);
    linguagens = [...linguagens.slice(0, 5), { nome: 'Outras', n: resto.reduce((s, l) => s + l.n, 0), pct: resto.reduce((s, l) => s + l.pct, 0) }];
  }

  const anos = Math.floor((Date.now() - new Date(usuario.created_at).getTime()) / (365.25 * 864e5));
  return {
    contribuicoes: calendario.totalContributions,
    atual,
    maior,
    semanas,
    ativos: dias.filter((d) => d.contributionCount > 0).length,
    melhorDia: Math.max(0, ...dias.map((d) => d.contributionCount)),
    melhorSemana: Math.max(0, ...semanas),
    repos: usuario.public_repos,
    anos,
    desde: new Date(usuario.created_at).getUTCFullYear(),
    linguagens,
  };
}

/* ---------- desenho ---------- */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const r = (n, d = 2) => Number(n.toFixed(d));
const fmt = (n) => new Intl.NumberFormat('pt-BR').format(n);
const icone = (nome, x, y, tam, cor) =>
  `<g transform="translate(${x} ${y}) scale(${tam / 24})" fill="none" stroke="${cor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONES[nome]}</g>`;

/** Número em "odômetro": cada algarismo gira até o valor final (o estado final é o padrão, sem animação). */
function odometro(valor, x, y, tam, atraso) {
  const texto = fmt(valor);
  const larg = tam * 0.66;
  const ponto = tam * 0.32;
  const alt = tam * 1.25;
  let cx = x;
  let k = 0;
  const partes = [];
  for (const ch of texto) {
    if (!/\d/.test(ch)) {
      partes.push(`<text class="big" x="${r(cx + ponto / 2)}" y="${y}" text-anchor="middle">${esc(ch)}</text>`);
      cx += ponto;
      continue;
    }
    const d = Number(ch);
    const destino = (10 + d) * alt;
    const coluna = Array.from({ length: 20 }, (_, n) => `<text x="${r(cx + larg / 2)}" y="${r(y + n * alt)}" text-anchor="middle">${n % 10}</text>`).join('');
    partes.push(`<g clip-path="url(#od)" transform="translate(0 0)"><g class="roll big" style="transform:translateY(-${r(destino)}px);animation-delay:${r(atraso + k * 0.08, 2)}s">${coluna}</g></g>`);
    cx += larg;
    k++;
  }
  return { svg: partes.join(''), largura: cx - x };
}

function cartao(s, modo, hoje) {
  const c = PALETA[modo];
  const W = 840;
  const H = 336;

  // destaques
  const destaques = [
    { valor: s.contribuicoes, rotulo: 'contribuições', x: 32 },
    { valor: s.atual, rotulo: s.atual === 1 ? 'dia de sequência atual' : 'dias de sequência atual', x: 236 },
    { valor: s.maior, rotulo: s.maior === 1 ? 'dia na maior sequência' : 'dias na maior sequência', x: 420 },
  ];
  const big = 46;
  const yBig = 116;
  const nums = destaques.map((d, i) => {
    const o = odometro(d.valor, d.x, yBig, big, 0.35 + i * 0.15);
    return `${o.svg}<text class="label" x="${d.x}" y="${yBig + 26}">${esc(d.rotulo)}</text>`;
  });

  // barras semanais
  const semanas = s.semanas.slice(-53);
  const maxS = Math.max(1, ...semanas);
  const area = { x: 606, y: 64, w: 202, h: 80 };
  const bw = area.w / semanas.length;
  const barras = semanas
    .map((v, i) => {
      const h = v > 0 ? Math.max(3, (v / maxS) * area.h) : 1.5;
      const ultima = i === semanas.length - 1;
      return `<rect class="bar" style="animation-delay:${r(0.4 + i * 0.012, 3)}s" x="${r(area.x + i * bw + 0.6)}" y="${r(area.y + area.h - h)}" width="${r(Math.max(1, bw - 1.2))}" height="${r(h)}" rx="1" fill="${ultima ? c.ink : c.accent}" fill-opacity="${v > 0 ? 1 : 0.35}"/>`;
    })
    .join('');

  // linha de números menores
  const itens = [
    ['dias', s.ativos, s.ativos === 1 ? 'dia com contribuições' : 'dias com contribuições'],
    ['zap', s.melhorDia, 'no dia mais produtivo'],
    ['flame', s.melhorSemana, 'na semana mais intensa'],
    ['repo', s.repos, 'repositórios públicos'],
    s.anos >= 1 ? ['history', s.anos, s.anos === 1 ? 'ano no GitHub' : 'anos no GitHub'] : ['history', s.desde, 'no GitHub desde'],
  ];
  const colW = (W - 64) / itens.length;
  const linha = itens
    .map(([ic, n, rot], i) => {
      const x = r(32 + i * colW);
      return `<g class="fade" style="animation-delay:${r(0.9 + i * 0.08, 2)}s">${icone(ic, x, 181, 16, c.accentStrong)}<text class="mid" x="${x + 24}" y="${195.5}">${fmt(n)}</text><text class="small" x="${x}" y="${218}">${esc(rot)}</text></g>`;
    })
    .join('');

  // linguagens
  const bar = { x: 32, y: 262, w: W - 64, h: 10 };
  let lx = bar.x;
  const segs = s.linguagens
    .map((l, i) => {
      const w = (l.pct / 100) * bar.w;
      const out = `<rect x="${r(lx)}" y="${bar.y}" width="${r(Math.max(0, w - (i < s.linguagens.length - 1 ? 2 : 0)))}" height="${bar.h}" fill="${c.ramp[i]}"/>`;
      lx += w;
      return out;
    })
    .join('');
  const legW = bar.w / Math.max(3, s.linguagens.length);
  const legenda = s.linguagens
    .map((l, i) => {
      const x = r(bar.x + i * legW);
      const qtd = `${l.n} ${l.n === 1 ? 'repositório' : 'repositórios'}`;
      return `<g class="fade" style="animation-delay:${r(1.3 + i * 0.07, 2)}s"><circle cx="${x + 5}" cy="${bar.y + 31}" r="5" fill="${c.ramp[i]}" stroke="${c.hairline}"/><text class="small strong" x="${x + 16}" y="${bar.y + 35.5}">${esc(l.nome)}</text><text class="small" x="${x + 16}" y="${bar.y + 53}">${qtd}</text></g>`;
    })
    .join('');

  const fontes = fs.readFileSync(path.join(AQUI, 'fontes.css'), 'utf8');
  const css = `
${fontes}
text{font-kerning:normal}
.kicker{font:600 11.5px IN;letter-spacing:1.8px;fill:${c.accentStrong}}
.date{font:400 12px IN;fill:${c.muted}}
.big{font:600 ${big}px IN;fill:${c.ink};letter-spacing:-1px}
.label{font:400 13.5px IN;fill:${c.muted}}
.mid{font:600 17px IN;fill:${c.ink}}
.small{font:400 12.5px IN;fill:${c.muted}}
.strong{font-weight:600;fill:${c.body}}
.roll{animation:roll 1.9s cubic-bezier(.16,1,.3,1) both}
@keyframes roll{from{transform:translateY(0)}}
.bar{transform-box:fill-box;transform-origin:50% 100%;animation:grow .9s cubic-bezier(.16,1,.3,1) both}
@keyframes grow{from{transform:scaleY(0)}}
.langs{animation:wipe 1.4s cubic-bezier(.65,0,.35,1) 1s both}
@keyframes wipe{from{transform:scaleX(0)}}
.fade{animation:fade .8s ease both}
@keyframes fade{from{opacity:0;transform:translateY(6px)}}
.pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2.4s ease-out infinite}
@keyframes pulse{0%{opacity:.8;transform:scale(1)}70%,100%{opacity:0;transform:scale(2.4)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;

  const vUlt = semanas.at(-1) ?? 0;
  const hUlt = vUlt > 0 ? Math.max(3, (vUlt / maxS) * area.h) : 1.5;
  const ultimo = { x: r(area.x + (semanas.length - 1) * bw + bw / 2), y: r(area.y + area.h - hUlt - 7) };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
<title id="t">Atividade no GitHub</title>
<desc id="d">Últimos 12 meses: ${fmt(s.contribuicoes)} contribuições, sequência atual de ${s.atual} dias e maior sequência de ${s.maior} dias; ${s.ativos} dias com contribuições, ${s.melhorDia} no dia mais produtivo e ${s.melhorSemana} na semana mais intensa; ${s.repos} repositórios públicos. Linguagem principal dos repositórios: ${s.linguagens.map((l) => `${l.nome} (${l.n})`).join(', ')}.</desc>
<style>${css}</style>
<defs>
<clipPath id="od"><rect x="0" y="${yBig - big * 0.95}" width="${W}" height="${big * 1.22}"/></clipPath>
<clipPath id="lb"><rect x="${bar.x}" y="${bar.y}" width="${bar.w}" height="${bar.h}" rx="${bar.h / 2}"/></clipPath>
</defs>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="24" fill="${c.canvas}" stroke="${c.hairline}" stroke-width="2"/>
<text class="kicker" x="32" y="44">ATIVIDADE NO GITHUB · ÚLTIMOS 12 MESES</text>
<text class="date" x="${W - 32}" y="44" text-anchor="end">atualizado em ${esc(hoje)}</text>
${nums.join('\n')}
${barras}
<circle class="pulse" cx="${ultimo.x}" cy="${ultimo.y}" r="3" fill="${c.ink}"/><circle cx="${ultimo.x}" cy="${ultimo.y}" r="3" fill="${c.ink}"/>
<text class="small" x="${area.x}" y="${area.y + area.h + 22}">contribuições por semana</text>
<line x1="32" x2="${W - 32}" y1="164" y2="164" stroke="${c.hairline}"/>
${linha}
<text class="kicker" x="32" y="248">LINGUAGEM PRINCIPAL DOS REPOSITÓRIOS</text>
<rect x="${bar.x}" y="${bar.y}" width="${bar.w}" height="${bar.h}" rx="${bar.h / 2}" fill="${c.card}"/>
<g clip-path="url(#lb)"><g class="langs" style="transform-origin:${bar.x}px 0">${segs}</g></g>
${legenda}
</svg>
`;
}

const dados = await buscar();
const resumo = resumir(dados);
const hoje = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Fortaleza' }).format(new Date());
fs.mkdirSync(SAIDA, { recursive: true });
for (const modo of ['light', 'dark']) {
  fs.writeFileSync(path.join(SAIDA, `atividade-${modo}.svg`), cartao(resumo, modo, hoje));
}
console.log(JSON.stringify({ ...resumo, semanas: `${resumo.semanas.length} semanas` }, null, 2));
