# Configurações (Settings Provider)

## Visão geral

O fork usa um **proxy tipado** sobre `Gio.Settings` da extensão. Valores são lidos e escritos pela instância obtida com `extension.getSettings()`.

Entrada: `src/providers/settings-provider/index.ts`  
Utilitário de proxy: `src/providers/settings-provider/utils.ts` (`createSettingsGroup`)

## Grupos atuais

| Grupo | Arquivo | Exemplos de chaves |
|-------|---------|-------------------|
| `pill` | `pill.ts` | Always show, album art, compact mode |
| `scrollControls` | `scroll-controls.ts` | Ação de scroll, inversão |
| `fallbackArt` | `fallback-art.ts` | Imagem alternativa de capa |

## API do proxy

Cada grupo expõe:

- Propriades com get/set implícitos (ex.: `settings.pill.alwaysShow`)
- `bind(prop, object, property)` — ligação GObject
- `connect(signal, callback)` — escuta `changed::key`

## Preferências UI

Linhas modulares em `src/ui/preferences/general-tab/`:

- `always-show-row.ts`, `art-row.ts`, `fallback-row.ts`
- `scroll-action-row.ts`, `scroll-ctrl-row.ts`, `invert-row.ts`

Cada linha lê/escreve via `SettingsProvider`, alinhado ao padrão Adw do GNOME.

## Schema

Definições GSettings: `schemas/org.gnome.shell.extensions.dynamic-music-pill.gschema.xml`

Após alterar o schema em desenvolvimento:

```bash
glib-compile-schemas ~/.local/share/gnome-shell/extensions/dynamic-music-pill@andbal/schemas
```
