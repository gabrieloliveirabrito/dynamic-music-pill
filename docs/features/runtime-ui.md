# Runtime UI (pill + popup)

Status: **em progresso** (MVP funcional)

## Implementado

- `MusicController` — seleção inteligente, debounce, ações de mouse
- `MusicPill` componentizada — texto, arte, visualizer simulado, cliques
- Posicionamento Dash-to-Dock / painel (`positioning/`)
- `ExpandedPlayer` — vinyl, progress/seek, transport, visualizer
- `PlayerSelectorMenu` — Auto Smart + lista de players
- `LyricsClient` (lrclib) — serviço pronto, UI de letras ainda pendente
- Utils: `formatTime`, `getPlayerIcon`, DTD autohide

## Pendente vs legado

- Página de letras no popup + TrayLyric D-Bus
- Custom buttons / subpages (volume, sleep, history, speed)
- Cava visualizer real (`SharedVisualizerEngine`)
- Shuffle/loop UI + cores dinâmicas da capa
- Drag-fix e animações 1:1 do monolito legado

## Como testar

1. `pnpm run build:js`
2. Recarregar extensão
3. Clique esquerdo na pill → popup (default `toggle_menu`)
4. Clique direito / ação `open_player_menu` → seletor
5. Spotify + Chrome: pill deve manter título, não Identity do browser
