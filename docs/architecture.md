# Arquitetura

## Objetivo do fork

Portar a extensão **Dynamic Music Pill** de JavaScript para **TypeScript**, compatível com **GNOME Shell 50**, mantendo paridade funcional com o código legado (`extension-old.js`, `prefs-old.js`).

## Stack

| Tecnologia | Uso |
|------------|-----|
| TypeScript 6 | Código-fonte tipado em `src/` |
| esbuild | Bundle de `extension.js` e `prefs.js` |
| `@girs/*` | Bindings GJS para GNOME Shell, Gio, St, etc. |
| pnpm | Gerenciador de pacotes |
| gettext | Traduções em `po/` → `locale/` |

## Build

**Dependencies:** `pnpm`, `msgfmt` (gettext), `glib-compile-schemas` (glib2).

```bash
pnpm install
pnpm build      # locale + schema + TypeScript/esbuild
make build      # equivalent
```

| Script | Command | Output |
|--------|---------|--------|
| Full build | `pnpm build` | `.mo`, `gschemas.compiled`, `extension.js`, `prefs.js` |
| Translations | `pnpm run build:locale` | `locale/**/LC_MESSAGES/*.mo` from `po/*.po` |
| GSettings | `pnpm run build:schema` | `schemas/gschemas.compiled` |
| JS only | `pnpm run build:js` | `extension.js`, `prefs.js` |

> `.mo` and `schemas/gschemas.compiled` are gitignored — regenerate after clone or when editing `po/` / `schemas/`.

Saída na raiz: `extension.js`, `prefs.js` e source maps.

## Estrutura de pastas (`src/`)

```
src/
├── extension.ts          # Ponto de entrada da extensão
├── prefs.ts              # Ponto de entrada das preferências
├── controllers/          # Lógica de controle (ex.: music-controller)
├── providers/            # MPRIS e configurações
│   ├── mpris-provider.ts
│   ├── settings-provider/
│   └── mock/             # Provider mock para desenvolvimento
├── ui/
│   ├── music-pill/       # Widget principal no painel/dock
│   └── preferences/      # Abas e linhas de preferências
├── components/           # Widgets reutilizáveis (St)
├── interfaces/           # Contratos (ex.: IMPrisProvider)
├── types/                # Tipos auxiliares
├── constants/            # Constantes MPRIS, log, etc.
└── utils/                # Log, tradução, helpers
```

## Código legado (somente referência)

Não alterar:

- `extension-old.js`
- `prefs-old.js`
- Qualquer código em `srcJS` (se presente)

Usar apenas para comparar comportamento e modularização durante o port.

## Contexto da aplicação

`getAppContext()` em `extension.ts` expõe:

- `extension` — instância da extensão
- `settings` — proxy de configurações
- `mpris` — provider MPRIS

Componentes de UI e prefs obtêm dependências por esse contexto ou por injeção direta.
