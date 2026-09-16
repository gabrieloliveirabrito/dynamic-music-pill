# Bug: ScrollLabel infinite scroll → too much recursion

Status: **corrigido**

## Sintoma

`JS ERROR: too much recursion` em `ScrollLabel.loop` / `onStopped`
(`src/components/scroll-label.ts`).

## Causa

O port TS chamava `loop()` **direto** no `onStopped` do `ease()`, sem a pausa
de 2s do legado, e usava `translationX` (camelCase). Se o `ease` completa
síncrono (ou falha e dispara `onStopped` na hora), a stack explode — mesmo
padrão do vinyl.

## Fix

Port fiel de `srcJS/uiWidgets.js` `_startInfiniteScroll`:
- pausa `GLib.timeout_add(..., 2000, ...)`
- `translation_x` (snake_case)
- próximo ciclo via `GLib.idle_add` (cinto e suspensório)

Também: `fadeWidth = size/SCALE + 4`, `_paused = true` no freeze, shader
`smoothstep` no TextFadeEffect.
