# Bug: visualizer reinventado crashava Mutter (SIGSEGV 139)

Status: **corrigido**

## Sintoma

Com a pill no dock, o GNOME Shell saía com código 139. Stack apontava para
`SimulatedVisualizer._start` / `bar.set_height` em loop.

## Causa

O visualizer TS foi reinventado (timer 50ms + `set_height` nas barras) em vez de
portar `srcJS/uiVisualizers.js`. Com `visualizerAnimation || 1`, modo 0 virava 1;
rebuild durante o timer deixava barras destruídas e `set_height` gerava SIGSEGV.
`child-added` no inject também reentrava sem filtrar a própria pill.

## Fix

1. Port fiel do `SimulatedVisualizer` (scale_y + timer 16ms, sem set_height).
2. Remover `|| 1` em `setMode(visualizerAnimation)`.
3. Inject: `child-added` ignora `actor === pill` (como o legado).

Arquivos: `src/ui/visualizers/*`, `src/ui/music-pill/positioning/inject.ts`
