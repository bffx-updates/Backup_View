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
     uma linha própria em telas estreitas. Embaixo do canal (ou ao lado, com o
     card largo) vem o aparelho que o MODO AMIGÁVEL põe naquele canal, ou
     `SEM APARELHO`.
   - **MODO AMIGÁVEL** — faixa com um chip por canal que tem aparelho
     (`CH 1 · VALETON GP-5`, USER 1/2/3 com o nome dado pelo usuário); o canal do
     PC do preset na tela fica aceso. Backup com o pedal único antigo
     (`match_mode`) mostra `TODOS OS CANAIS`; sem aparelho nenhum, `NENHUM
     APARELHO`. É config global: a mesma em todos os presets.
   - **Cabeçalho do preset** — tag, nome, ATIVO/DESATIVADO, aviso de banco
     desligado e, com layer 2, o chip DUAL LAYER e o seletor LAYER 1 / LAYER 2.
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
| `index.html` | A página inteira (HTML + CSS + JS). Tabelas do firmware/editor copiadas à mão: paleta de display, modelos, `SW_MODE_IDS`, `MATCH_MODE_OPTIONS` (nomes) e `MATCH_MODE_PEDAL`. |
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
1728 px, encolhendo junto com a janela até 11 px. Abaixo de 1240 px o card
PRINCIPAL desce pra uma linha própria e os SWs viram uma coluna só (os dois no
mesmo ponto, para a lista manter a grade 2×3 da referência num notebook de
1280), abaixo de 720 px entra o layout de celular e abaixo de 600 px as opções
de cada SW descem para baixo do texto. O pedal desenhado no card MODELO
(`deviceSvg`) é **ilustração decorativa em SVG**, não foto do produto; o texto
impresso nele sai do nome da placa.

**Refino de 25/set/2026** (mesma composição, mais robusta):
- **Piso de 11 px** em todo texto pequeno (`max(11px, …rem)`): com o rem a
  11 px, rótulos como DISPARA/LED chegavam a 7,5 px. Por isso os tiles de
  opção têm largura mínima de 61 px, e a linha MIDI cabe em até 2 linhas, com
  o `+N` colado à reticência (`fitMidi`, que corta o texto em JS).
- A linha de cima tem **altura igual** nos três cards e abrir EXTRAS só aumenta
  o PRINCIPAL. O nome da placa encolhe pelo número de letras (`--len`) até
  caber inteiro.
- Cores puxadas para o **azul-ardósia** da referência; bordas com luz vinda do
  topo, menos no MODELO, cuja moldura laranja é mais acesa nos cantos superior
  esquerdo e inferior direito.
- O topo fica numa linha só a partir de 900 px (nome do arquivo com
  reticência) e deixa de ser fixo no celular.
- Estados distintos: tecla **tracejada** = slot fora do backup, **hachurada** =
  preset desativado. O chip do cabeçalho virou **DUAL LAYER** (o termo do
  editor), e placa fora do catálogo mostra `CHIP ?`.
- Teclado: foco visível em tudo, foco preservado a cada troca de preset,
  `aria-pressed`/`aria-expanded` nos controles.

## LOG VIEW (06/nov/2026)

Botão **LOG VIEW** no topo: troca a página pela telemetria da **blackbox** do
firmware (`BLACKBOX.h`, a partir da 15.6 republicada em 06/nov/2026). A página
lê a linha `DIAG-JSON {...}` que o firmware põe no fim do `GET /log` — o editor já
guarda esse texto no backup, chave `boot_log`. Também abre o **texto puro** do
`/log` ou do `/diag` salvo da controladora (`.txt`), que entra direto no LOG VIEW.

**Painel resumido (07/nov/2026)**: o LOG VIEW abre num painel de saúde — selo
geral (SAUDÁVEL / ATENÇÃO / CUIDADO / PROBLEMA, com um anel de um gomo por área),
seis áreas com estado e medidor de faixas verde/amarela/vermelha (Estabilidade,
Resposta, Footswitches, Wi-Fi, Memória e, com a F1, Armazenamento), **O que fazer**
com até 3 itens do diagnóstico e a faixa **Minuto a minuto** (um quadrado por
minuto e por área). Tudo o que segue abaixo fica atrás do botão **AVANÇADOS**
(estado lembrado no `localStorage`, chave `bv_lv_adv`). As regras de estado moram
em `lvHealth` (por área) e `LV_STRIP` (por minuto): limiar novo entra ali.

**Demora normal não é falha (07/nov/2026)**: volta lenta explicada por uma
operação com tempo conhecido — carregar o editor, ler a imagem de fundo, gravar
preset ou config, fazer backup, ligar a controladora, atender o editor pelo cabo,
trocar de preset — dentro do tempo esperado sai da conta (`e.exp` em cada período
lento, `lvEpExpect`). As tabelas são `LV_EXPECT_ROUTES` (começo da rota HTTP →
tempo normal máximo) e `LV_EXPECT_SUB` (sub-fase dominante → tempo normal). Acima
do tempo, ou parada de 3 s ou mais, continua sendo problema. No AVANÇADOS os
períodos normais aparecem com o selo NORMAL e em azul na linha do tempo.

No AVANÇADOS, de cima pra baixo: diagnóstico automático (o que aconteceu, por que e o
que fazer), resumo em números, linha do tempo por boot, gráficos minuto a minuto,
histogramas do tempo de volta do loop e do atraso das pisadas, tempo por fase nas
voltas lentas, períodos de lentidão, travamentos gravados na NVS, eventos e o
relatório em texto.

- **Contrato**: a ordem dos arrays (`ev`, `ep`, `min`, `stalls`) é a do
  `diag_report_json` (`"v":1`). Mudou lá, mude o `lvParse` aqui; arquivo com `v`
  maior mostra o aviso de página desatualizada.
- **Diagnósticos**: `lvDiagnose`, uma regra por bloco (`add(sev, título, texto,
  o que fazer)`), em ordem de gravidade.
- **Cores**: fases com a paleta categórica do modo escuro, girada em 3 posições
  (validada pelo validador de paleta); estados (OK/ATENÇÃO/IMPORTANTE/CRÍTICO)
  sempre com ícone e rótulo.
- A cópia em `Site/backup-view/index.html` é idêntica: mudou aqui, copie lá.
