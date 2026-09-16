# Alteração: seleção de player D-Bus (anti-Chrome)

## Motivação

No legado e no provider inicial do fork, a pill podia mostrar “Google Chrome” / Identity MPRIS quando metadata sumia ou o browser ganhava o scoring sem título.

## Decisão do fork

1. Chave de players = **bus name** MPRIS
2. Scoring: Playing+title > Paused+title; browsers sem título são penalizados
3. Cache `lastDisplayTrack` — não regredir para Identity enquanto o mesmo player não estiver `Stopped`
4. Filtro blacklist/whitelist aplicado no `rescan`

## Arquivos

- `src/controllers/active-player.ts`
- `src/providers/mpris-provider/`
