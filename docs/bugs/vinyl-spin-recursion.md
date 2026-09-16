# Bug: vinyl `_spinOnce` recursion crash

Status: **corrigido**

## Sintoma

Ao abrir o popup com vinyl rotate, Mutter crashava com `JS ERROR: too much recursion` em `VinylArt._spinOnce` / `onStopped`.

## Causa

`ease()` falhava ou finalizava de forma síncrona e `onStopped` chamava `_spinOnce` de novo na mesma stack — loop infinito.

## Fix

Portar a abordagem do legado: ramp + um único `ease` longo (`+36000°`), sem recursão. Próximo passo só via `GLib.idle_add`.

Arquivo: `src/ui/expanded-player/components/vinyl-art.ts`
