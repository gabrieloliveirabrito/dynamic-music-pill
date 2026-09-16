# Alteração: port fiel da UI (anti-reinvenção)

## Motivação

O runtime TS tinha reinventado visualizer (`set_height`) e uma MusicPill
simplificada. Isso crashava o Mutter e deixava a pill visualmente diferente
do legado — inaceitável: o fork é port + fix DBus, não extensão nova.

## O que mudou

- Visualizer portado 1:1 de `srcJS/uiVisualizers.js` (scale_y).
- MusicPill: tablet controls, textWrapper, visBin, margins e `_updateDimensions` alinhados ao legado.
- Inject: filtro `actor !== pill` no `child-added`.
- Regra `02-port-runtime-ui.mdc`: UI idêntica; só DBus é delta intencional.

O TS ainda estava longe do visual do legado. Gaps principais corrigidos nesta rodada:

- ScrollLabel: pause 2s + `translation_x` (crash de recursão)
- TextFadeEffect: shader com `smoothstep` (legado)
- CrossfadeArt: layers `St.Widget`, crossfade 1800ms
- Cor da arte → body (average color + transição)
- Show/hide com ease 500ms + grace 5s
- Hover → `setHoverMode` nos ScrollLabels
- Alpha via transparency settings (não mais 0.95 fixo)

Ainda pendente para paridade total: dynamic-width completo, side-panel height,
ExpandedPlayer 1:1, cava.

