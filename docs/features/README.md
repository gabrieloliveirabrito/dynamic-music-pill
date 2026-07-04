# Funcionalidades

Implementações novas ou em port no fork TypeScript.

## Port TypeScript + GNOME Shell 50

**Status:** em progresso  
**Documentação:** [architecture.md](../architecture.md)

- Build com esbuild e tipos `@girs/gnome-shell` ^50
- Estrutura modular em `src/`

## Settings Provider (proxy Gio.Settings)

**Status:** parcial  
**Documentação:** [settings.md](../settings.md)

Proxy tipado com grupos `pill`, `scrollControls`, `fallbackArt`.

## MPRIS Provider + mock

**Status:** parcial  
**Documentação:** [mpris.md](../mpris.md)

Provider D-Bus real e mock para desenvolvimento.

## Preferências — aba General (parcial)

**Status:** em progresso

Linhas portadas: always show, album art, fallback art, scroll controls, invert scroll.

## Tradução pt_BR completa

**Status:** concluído (2026-06-24)

290 strings traduzidas; compilado em `locale/pt_BR/LC_MESSAGES/dynamic-music-pill.mo`.

---

Novas features devem ser documentadas aqui antes ou durante a implementação (pelo mantenedor).
