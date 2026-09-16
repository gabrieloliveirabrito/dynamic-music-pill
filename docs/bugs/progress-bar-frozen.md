# Bug: progress bar frozen + UI flicker

Status: **corrigido**

## Sintoma

No popup (ExpandedPlayer), a barra de progresso respondia ao clique mas
ficava parada durante a reprodução. Havia um “flick” periódico na interface.
Visualmente a barra parecia um bloco grosso sem as classes do stylesheet.

## Causa

1. MPRIS quase nunca empurra `Position` — o legado **interpola**
   (`_lastPosition` + tempo decorrido) e sincroniza via DBus a cada ~5s.
   O port lia só o valor cacheado estático.
2. Timer 500ms reescrevia labels/caps a cada tick → relayout/flick.
3. Progress reinventada (`music-pill-progress-track`) em vez de
   `progress-container` / `progress-slider-*` do `stylesheet.css`.

## Fix

- `MediaPlayer`: cache + `getInterpolatedPosition` / `syncPosition` / `Seeked`
- ExpandedPlayer `_tick` fiel (100ms, seek-lock 2s, update só se mudou)
- ProgressBar com classes CSS do legado + min-width 6px no fill
- Transport com `control-btn` (botões circulares)
