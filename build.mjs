// Gera `data.js` pro Backup View a partir do que já existe no webApp:
//   - os 51 ícones compilados (webApp/icons/sw/ICO<id>.png) como data URI
//   - PC_LABELS / CC_LABELS (webApp/pedal_labels.js)
//   - KEMPER_NRPN_CCS (webApp/kemper_nrpn.js) e GP5_EFFECT_PARAMS (webApp/gp5_params.js)
// A página é aberta por file:// (duplo-clique), então NÃO pode importar módulos
// ES nem fazer fetch — tudo vira um script clássico `data.js`.
// Rodar: node "Backup View/build.mjs"   (na raiz do repo)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const webApp = path.join(root, 'webApp');

const meta = JSON.parse(fs.readFileSync(path.join(root, 'icons/build/ICONS_META.json'), 'utf8'));
const icons = {};
for (let id = 1; id <= meta.count; id++) {
  const p = path.join(webApp, 'icons/sw', `ICO${id}.png`);
  if (!fs.existsSync(p)) continue;
  icons[id] = 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
}

const labels = await import(pathToFileURL(path.join(webApp, 'pedal_labels.js')).href);
const kemper = await import(pathToFileURL(path.join(webApp, 'kemper_nrpn.js')).href);
const gp5 = await import(pathToFileURL(path.join(webApp, 'gp5_params.js')).href);

const out = {
  iconCount: meta.count,
  colorIconIds: meta.color_ids || [],
  icons,
  PC_LABELS: labels.PC_LABELS,
  CC_LABELS: labels.CC_LABELS,
  KEMPER_NRPN: kemper.KEMPER_NRPN_CCS.map((e) => [e.value, e.label]),
  GP5_PARAMS: gp5.GP5_EFFECT_PARAMS.map((e) => [e.value, e.label]),
};
const js = '// GERADO por build.mjs — não editar à mão.\nwindow.BV_DATA = ' + JSON.stringify(out) + ';\n';
fs.writeFileSync(path.join(here, 'data.js'), js);
console.log(`data.js: ${(js.length / 1024).toFixed(0)} KB, ${Object.keys(icons).length} icones, ` +
  `${Object.keys(out.PC_LABELS).length} tabelas PC, ${Object.keys(out.CC_LABELS).length} tabelas CC`);
