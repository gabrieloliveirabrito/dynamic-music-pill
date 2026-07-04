# Dynamic Music Pill — TypeScript Fork

> **Note:** The original project README remains at [`README.md`](README.md). This document describes the TypeScript port and fork maintenance.

## About this fork

This repository is a fork of [Dynamic Music Pill](https://github.com/Andbal23/dynamic-music-pill) by **László András (Andbal23)**. The goal is to modernize the codebase for **GNOME Shell 50** with a **TypeScript** port, improved modular structure, and typed GNOME bindings.

**Fork maintainer:** Gabriel Oliveira Brito — [gabriel.oliveira.brito@outlook.com](mailto:gabriel.oliveira.brito@outlook.com)

## Why TypeScript?

- Strong typing via `@girs/*` packages for GJS and GNOME Shell APIs
- Clear module boundaries (`providers/`, `ui/`, `controllers/`)
- Safer refactors while preserving upstream behavior
- esbuild bundle to the same entry points: `extension.js` and `prefs.js`

## Tech stack

| Tool | Role |
|------|------|
| TypeScript 6 | Source in `src/` |
| esbuild | Bundling to root JS files |
| `@girs/gnome-shell` ^50 | Shell extension APIs |
| pnpm | Package manager |
| gettext | i18n (`po/` → `locale/`) |

## Legacy reference (do not edit)

The original JavaScript is kept unchanged for comparison:

- `extension-old.js`
- `prefs-old.js`

Use these files to validate behavior during the port; they must not be modified.

## Getting started

```bash
pnpm install
pnpm build
```

Development watch:

```bash
pnpm watch
```

Install locally (adjust paths as needed):

```bash
./install.sh
```

Compile Brazilian Portuguese translations:

```bash
msgfmt -c po/pt_BR.po -o locale/pt_BR/LC_MESSAGES/dynamic-music-pill.mo
```

## Documentation

Full fork documentation: [`docs/`](docs/README.md)

- [Architecture](docs/architecture.md)
- [MPRIS & state](docs/mpris.md)
- [Settings proxy](docs/settings.md)
- [Legacy comparison](docs/legacy-comparison.md)

Portuguese version of this file: [`README.fork.pt.md`](README.fork.pt.md)

## License

Same license as the upstream project — see [`LICENSE`](LICENSE).

## Credits

- **Original author:** [Andbal23](https://github.com/Andbal23) — Dynamic Music Pill
- **TypeScript fork:** Gabriel Oliveira Brito
