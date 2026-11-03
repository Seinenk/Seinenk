# Gerador do perfil

Scripts que desenham os SVGs animados do README do perfil (`../assets`) e as fontes
embutidas do cartão de atividade (`../.github/scripts/fontes.css`).

```bash
npm ci
pip install -r requirements.txt
npm run gerar
```

- Os textos ficam nos próprios módulos: `banner.mjs` (cargos que se alternam),
  `projects.mjs` (cartões de projeto), `conquistas.mjs`, `stack.mjs` (tecnologias),
  `badges.mjs` (links de contato) e `studio.mjs` (o cartão `carlos.ts`).
- As cores seguem a paleta Grafite do portfólio (`lib.mjs`), em versão clara e escura.
- As fontes (Inter, Cormorant Garamond e JetBrains Mono, licença OFL) entram no SVG só
  com os caracteres usados, porque imagens no GitHub não carregam fontes externas.
- Toda animação para quando o sistema pede menos movimento.

O cartão de atividade e a cobrinha não saem daqui: o workflow `Perfil`
(`../.github/workflows/perfil.yml`) gera os dois todos os dias e publica no ramo `output`.
