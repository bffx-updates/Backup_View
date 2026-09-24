# Backup View — visualizador de backup da BFMiDi

Página **standalone** (abre por duplo-clique, `file://`, sem servidor e sem
internet) que lê um backup do editor (`bfmidi-backup-*.json`, v2 ou v3) e mostra
num relance como cada preset está configurado. Nada sai do navegador.

## Uso

1. Abra `index.html` (duplo-clique).
2. Clique em **ABRIR BACKUP** (ou arraste o `.json` pra página). Ele abre no
   preset do início automático do backup (ou no primeiro que existir).
3. A tela é uma só, no visual do console do editor:
   - **Console** — mostrador `A1 / SET BANK` + teclas 1..6 (1..4 nas placas de
     4 foots). A tecla escolhe o preset do banco; clicar no mostrador (ou nas
     setas ‹ › que aparecem no hover, ou ← → no teclado) troca de banco entre
     os que o backup traz. Teclas 1..6 do teclado também escolhem o preset.
   - **MODELO** — placa do `global_config` (nome antigo é traduzido pro atual,
     ex. `BFMIDI-3 8SW+` → `BFMIDI-S3 8SW+`), família e chip.
   - **PRINCIPAL** — o header do preset no desenho do card do editor: PC
     principal (com o nome amigável quando o pedal tem), CANAL (`OFF` = não
     envia) e o botão EXTRAS com a contagem; clicar abre a lista dos envios
     extras (PC/CC, `EXP` no valor 128). Fica à direita do MODELO e desce pra
     uma linha própria em telas estreitas.
   - **Cabeçalho do preset** — tag, nome, ATIVO/DESATIVADO, aviso de banco
     desligado e, com layer 2, o seletor LAYER 1 / LAYER 2.
   - **Um card por footswitch** (1-2-3 à esquerda, 4-5-6 à direita), em dois
     andares. Em cima: número, barra na cor do LED, o tile no estado em que o
     SW nasce na chamada do preset, o MODO em letra grande (encolhe até caber
     quando o nome é longo, ex. MOMENTARY) e as opções. Embaixo, numa linha só,
     a 1ª mensagem MIDI: `CC : 42 - NOME AMIGÁVEL` (ou `- CANAL n` quando não
     há nome; `+N` quando há mais mensagens — a lista completa fica no tooltip
     do card). Opções do modo: LED (anel com as cores dos 3
     pixels), DISPARA (na chamada), COMEÇA (ligado), INVERTE (LED) — acesas em
     laranja quando ligadas. Outros modos mostram as opções deles (LEMBRA,
     3 CORES, SYNC, ON/OFF…).
   - **Log de boot do pedal** — a chave `boot_log` (editor/firmware 13.7+), com
     o chip `RESET: …` vermelho (e já aberto) quando foi BROWNOUT, PANIC ou
     watchdog.

Os nomes de CC/PC seguem o MODO AMIGÁVEL do backup (global ou por canal no
MULTIPLE MODE), inclusive USER 1/2/3, comandos especiais (128+), NRPN do Kemper
(200–321) e parâmetros internos da GP-5 (400+).

A versão anterior — abas GLOBAIS/PRESETS, prévia de tela, edição do
`global_config` e EXPORTAR — ficou em **`index_completo.html`** (mesmo
`data.js`), sem manutenção.

`demos/` tem dois backups reais pra testar.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | A página inteira (HTML + CSS + JS). Tabelas do firmware/editor copiadas à mão: paleta de display, modelos, `SW_MODE_IDS`, `MATCH_MODE_PEDAL`. |
| `index_completo.html` | A versão anterior, com globais, presets detalhados e edição. |
| `data.js` | **GERADO** por `build.mjs`: os ícones compilados (`webApp/icons/sw/`) em base64 + `PC_LABELS`/`CC_LABELS` (`webApp/pedal_labels.js`) + Kemper NRPN + GP-5. |
| `build.mjs` | Regenera `data.js`. Rodar na raiz do repo: `node "Backup View/build.mjs"`. |

## Quando regenerar / atualizar

- Mudou ícone (`py tools/build_icons.py`) ou pedal do modo amigável
  (`pedal_labels.js`) → `node "Backup View/build.mjs"`.
- Entrou **placa**, **modo de SW** ou **pedal** novo no `app.jsx` → copie a
  linha correspondente pras tabelas no topo do `<script>` do `index.html` (são
  espelhos posicionais, append-only, como no editor).
- Mudou a `DISPLAY_PALETTE` → refaça `BASE_COLORS`/`MISC` no `index.html`.

A composição do tile é um porte simplificado do `icon_tile_render`.

## Visual

O desenho segue uma imagem de referência do usuário feita a **1728 px** de
largura (fundo azul-escuro com brilho laranja nos cantos, card MODELO com borda
laranja, etc.). Pra manter a proporção em qualquer tela, **todo tamanho é em
`rem`** e o `html` tem `font-size: clamp(11px, 100vw / 108, 16px)` — 16 px a
1728 px, encolhendo junto com a janela até 11 px. Abaixo de ~1100 px o card
PRINCIPAL desce pra uma linha própria, abaixo de 1000 px os SWs viram uma
coluna só, e abaixo de 720 px entra o layout de celular. O pedal desenhado no
card MODELO (`deviceSvg`) é **ilustração decorativa em SVG**, não foto do
produto; o texto impresso nele sai do nome da placa.
