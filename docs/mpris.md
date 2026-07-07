# MPRIS e gerenciamento de estado

A extensão escuta players compatíveis com **MPRIS** via **D-Bus** e reflete o estado na pílula e no menu pop-up.

## Provider

Implementação principal: `src/providers/mpris-provider.ts`  
Contrato: `src/interfaces/impris-provider.ts`  
Mock para dev: `src/providers/mock/mpris-provider.ts`

## Estado relevante

| Dado | Uso na UI |
|------|-----------|
| Reproduzindo / pausado / parado | Ícone, animações, visualizador |
| `CanGoNext` / `CanGoPrevious` | Botões anterior/próximo |
| `CanSeek` | Barra de progresso e seek ±10 s |
| Loop / shuffle (se exposto) | Controles no pop-up |
| `Length` / `Position` | Tempo e barra de progresso |
| Título, artista, álbum, arte | Texto e capa na pílula |
| Player ativo | Seletor de players |

## Detectar ausência de reprodução

Cenários a considerar no port:

1. **Nenhum player MPRIS** — não há objeto no bus; a pílula pode ocultar ou mostrar estado vazio (modo “Always ON” mantém última faixa).
2. **Player pausado** — ainda há sessão MPRIS; `PlaybackStatus` é `Paused`.
3. **Player fechado** — objeto D-Bus some; diferente de pausado.
4. **Posição congelada** — útil junto com `PlaybackStatus` para saber se há stream ativo.

Recomendação: centralizar estado derivado (ex.: `isActive`, `hasPlayer`, `isPlaying`) em um controller (`src/controllers/music-controller.ts`) em vez de espalhar checagens na UI.

## Melhorias sugeridas (não implementadas pela IA)

- Debounce em mudanças rápidas de metadata
- Cache de arte com invalidação por track ID
- Reconexão automática se o bus D-Bus reiniciar
- Tipagem estrita dos sinais MPRIS a partir de `@girs/gio-2.0`
