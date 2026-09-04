# Backup View — visualizador de backup da BFMiDi

Página **standalone** (abre por duplo-clique, `file://`, sem servidor e sem
internet) que lê um backup do editor (`bfmidi-backup-*.json`, v2 ou v3) e mostra
de forma visual o que está configurado nele. Também **edita as configurações
globais** (placa, modo amigável, LEDs…) e **exporta** o backup alterado. Nada
sai do navegador.

## Uso

1. Abra `index.html` (duplo-clique).
2. Clique em **ABRIR BACKUP** (ou arraste o `.json` pra página).
3. Dois botões no topo:
   - **GLOBAIS** — placa configurada em destaque (nome antigo de placa é traduzido
     pro atual, ex. `BFMIDI-3 NANO+ V2` → `BFMIDI-S3 NANO+`), LEDs, bancos ativos, início
     automático, chamada de presets por gesto, combos, tela, modo amigável
     (MIDI), Kemper, SW GLOBAL 1/2, External SW 1/2, pedal de expressão,
     aparelhos personalizados (USER 1/2/3), mídia (imagens e ícones enviados, com
     os presets que usam cada um) e a paleta de LED gravada. No fim, um
     `details` com **todas** as chaves cruas do `global_config`.
   - **PRESETS** — barra com os presets agrupados por letra de banco (banco
     desligado aparece apagado). Ao escolher um: PC/canal, cores, fonte, layouts
     (herdado ou próprio), envios extras, **prévia da tela** em modo PRESET e em
     modo LIVE, e um card por footswitch com os estados do tile (OFF/ON, seções
     B/C do STOMP, posições do SPIN…) e os envios MIDI de cada gesto. Preset com
     layer 2 ganha o seletor LAYER 1 / LAYER 2.
4. **EDITAR** (canto direito) liga o modo de edição na aba GLOBAIS: os valores
   viram controles (placa, brilho e cores de LED, bancos ativos, início
   automático, gestos de chamada de preset, combos, tela, modo amigável e a
   tabela de canais do MULTIPLE MODE, Kemper, indicadores dos External SW,
   pedal de expressão). Cada mudança marca o campo em amarelo, o cabeçalho
   ganha o chip **MODIFICADO · n** e a caixa laranja lista `chave: antes → depois`
   com um **DESFAZER TUDO**. Só o `global_config` é editável — presets,
   `sw_params`, imagens, ícones, `user_pedals` e `boot_log` saem exatamente como entraram.
   No fim da aba GLOBAIS, um `details` **Log de boot do pedal** mostra a chave
   `boot_log` (editor/firmware 13.7+): o que o pedal imprimiu na serial desde o
   power-on até a hora do backup. O chip **RESET: …** vem da 2ª linha do log e
   fica vermelho (e o `details` já abre) quando o reset foi BROWNOUT, PANIC ou
   watchdog — o primeiro sinal de problema de alimentação/cabo ou de crash.
5. **EXPORTAR** baixa `<nome-original>-editado.json` (mesmo formato do editor,
   JSON numa linha). O arquivo aberto nunca é alterado.

Avisos do modo de edição:

- **Placa de outro chip** (S2 ↔ S3): dá pra escolher, mas o firmware recusa em
  silêncio uma placa de pinagem diferente ao restaurar (`boardIsForThisChip`),
  então a página marca em vermelho "CHIP DIFERENTE DO BACKUP". Escolher o mesmo
  modelo que já estava, só com o nome novo, não conta como alteração — a
  grafia gravada no arquivo é mantida.
- **Placa com outro número de switches** (ex. 8SW+ → NANO+): os presets ficam
  com switches sobrando/faltando; o pedal ignora o excedente, mas a prévia de
  tela e as tabelas por SW mudam. Aviso amarelo no card da placa.
- Uma chave que não existia no backup só passa a existir se você mexer nela.

Os nomes de CC/PC seguem o MODO AMIGÁVEL do backup (global ou por canal no
MULTIPLE MODE), inclusive USER 1/2/3, comandos especiais (128+), NRPN do Kemper
(200–321) e parâmetros internos da GP-5 (400+).

`demos/` tem dois backups reais pra testar.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | A página inteira (HTML + CSS + JS). Tabelas do firmware/editor copiadas à mão: paleta de display, modelos, `SW_MODE_IDS`, ações de gesto, `MATCH_MODE_OPTIONS`/`MATCH_MODE_PEDAL`. O modo de edição é o bloco `MODO DE EDIÇÃO` nos helpers (`edSel`/`edNum`/`edChk`…, `data-k` = chave do `global_config`) mais o `change` delegado em `$main`. |
| `data.js` | **GERADO** por `build.mjs`: os 51 ícones compilados (`webApp/icons/sw/`) em base64 + `PC_LABELS`/`CC_LABELS` (`webApp/pedal_labels.js`) + Kemper NRPN + GP-5. |
| `build.mjs` | Regenera `data.js`. Rodar na raiz do repo: `node "Backup View/build.mjs"`. |

## Quando regenerar / atualizar

- Mudou ícone (`py tools/build_icons.py`) ou pedal do modo amigável
  (`pedal_labels.js`) → `node "Backup View/build.mjs"`.
- Entrou **placa**, **modo de SW**, **ação de gesto** ou **pedal** novo no
  `app.jsx` → copie a linha correspondente pras tabelas no topo do `<script>`
  do `index.html` (são espelhos posicionais, append-only, como no editor).
- Mudou a `DISPLAY_PALETTE` → refaça `BASE_COLORS`/`MISC` no `index.html`;
  `IMAGE_SLOT_FIRST_ID` é derivado do tamanho da paleta, como no editor.

A prévia de tela é **aproximada** (layout L1, estado inicial de cada SW); a
composição do tile é um porte simplificado do `icon_tile_render`.
