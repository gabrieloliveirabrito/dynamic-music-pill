# Bug: UI flick + pause do popup morto

Status: **corrigido**

## Sintoma

- Interface “piscava” periodicamente com a música tocando.
- Pause/play no popup não respondia; na pill (tablet) funcionava.

## Causa

1. **Flick:** qualquer mudança de `Position` (poll GetAll / PropertiesChanged)
   emitia `player-state-changed` → `triggerUpdate` → `updateDisplay` →
   `showActive` → `updateDimensions` + color transition + `setArt(force)` +
   `ScrollLabel.setText(force)` — redesenho total por causa de um número.
2. **Pause:** `setCapabilities` desligava `reactive` do play com base em
   `CanPlay` (legado **nunca** faz isso). Além disso, `button-release` sem
   claim no `button-press` perdia o clique pro backdrop.

## Fix

- `MediaPlayer._applyState`: Position-only não emite signal de UI.
- Pill/Expanded: early-return se título/artista/arte/status iguais.
- `showActive` não chama `updateDimensions` se já está ativa.
- Transport: `clicked` + press STOP; play sempre reactive.
