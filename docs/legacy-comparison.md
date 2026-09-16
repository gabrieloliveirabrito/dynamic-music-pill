# Comparação com o código legado

Referência imutável: `extension-old.js`, `prefs-old.js`.

## Mapeamento modular (port em andamento)

| Legado (conceito) | TypeScript (`src/`) | Status |
|-------------------|---------------------|--------|
| Controller / MPRIS | `providers/mpris-provider/`, `controllers/music-controller.ts` | MVP runtime |
| Music pill UI | `ui/music-pill/` | MVP (componentizado) |
| Expanded player / pop-up | `ui/expanded-player/` | MVP parcial |
| Player selector | `ui/player-selector/` | MVP |
| Visualizers | `ui/visualizers/` | Simulado (cava pendente) |
| Lyrics | `services/lyrics/client.ts` | Cliente pronto, UI pendente |
| Preferências | `prefs.ts`, `ui/preferences/` | Quase completo |

## Padrões mantidos

- Entradas esbuild: `extension.ts` e `prefs.ts` → mesmos nomes de saída que upstream
- Domínio gettext: `dynamic-music-pill`
- UUID: `dynamic-music-pill@andbal`
- Schema: `org.gnome.shell.extensions.dynamic-music-pill`

## Padrões novos no fork

- Tipos em `src/types/` e interfaces explícitas
- `AppContext` global para DI leve
- Mock MPRIS para desenvolvimento sem player real
- Proxy de settings com mapa declarativo por grupo

## Validação recomendada

1. Habilitar extensão com player MPRIS (Spotify, VLC, etc.)
2. Comparar comportamento de scroll, cliques e capa com build legado
3. Conferir preferências já portadas contra mesmas chaves GSettings
4. Registrar diferenças intencionais em `docs/alterations/`
