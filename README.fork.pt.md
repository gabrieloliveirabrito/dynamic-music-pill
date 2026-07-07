# Dynamic Music Pill — Fork TypeScript

> **Nota:** O README original do projeto permanece em [`README.md`](README.md). Este arquivo descreve o port TypeScript e a manutenção do fork.

## Sobre o fork

Este repositório é um fork de [Dynamic Music Pill](https://github.com/Andbal23/dynamic-music-pill), de **László András (Andbal23)**. O objetivo é modernizar o código para **GNOME Shell 50** com um port em **TypeScript**, estrutura modular e bindings tipados do GNOME.

**Mantenedor do fork:** Gabriel Oliveira Brito — [gabriel.oliveira.brito@outlook.com](mailto:gabriel.oliveira.brito@outlook.com)

## Por que TypeScript?

- Tipagem com pacotes `@girs/*` para APIs GJS e GNOME Shell
- Módulos separados (`providers/`, `ui/`, `controllers/`)
- Refatorações mais seguras mantendo o comportamento do upstream
- Bundle esbuild nos mesmos pontos de entrada: `extension.js` e `prefs.js`

## Tecnologias

| Ferramenta | Função |
|------------|--------|
| TypeScript 6 | Código-fonte em `src/` |
| esbuild | Bundle para JS na raiz |
| `@girs/gnome-shell` ^50 | APIs da extensão Shell |
| pnpm | Gerenciador de pacotes |
| gettext | Traduções (`po/` → `locale/`) |

## Código legado (não editar)

O JavaScript original permanece intacto para comparação:

- `extension-old.js`
- `prefs-old.js`

Use esses arquivos para validar o comportamento durante o port; não devem ser alterados.

## Como começar

**Dependências de build:** `pnpm`, `msgfmt` (gettext) e `glib-compile-schemas` (glib2).

```bash
pnpm install
pnpm build          # locale (.mo) + schema + TypeScript/esbuild
# equivalente: make build
```

Passos individuais:

```bash
pnpm run build:locale   # po/*.po -> locale/**/LC_MESSAGES/*.mo
pnpm run build:schema   # schemas/ -> gschemas.compiled
pnpm run build:js       # apenas TypeScript + esbuild
```

> **Nota:** arquivos `.mo` e `schemas/gschemas.compiled` não são versionados (ver `.gitignore`). Sempre rode `pnpm build` após clonar ou alterar traduções/schema.

Desenvolvimento com rebuild contínuo:

```bash
pnpm watch            # apenas JS; rode build:locale/schema manualmente se necessário
```

Instalação local:

```bash
./install.sh          # pnpm build + rsync + glib-compile-schemas no destino
```

Validar tradução pt_BR:

```bash
msgfmt -c po/pt_BR.po -o locale/pt_BR/LC_MESSAGES/dynamic-music-pill.mo
```

## Documentação

Documentação completa: [`docs/`](docs/README.md)

- [Arquitetura](docs/architecture.md)
- [MPRIS e estado](docs/mpris.md)
- [Proxy de configurações](docs/settings.md)
- [Comparação com o legado](docs/legacy-comparison.md)

Versão em inglês: [`README.fork.en.md`](README.fork.en.md)

## Licença

Mesma licença do projeto original — veja [`LICENSE`](LICENSE).

## Créditos

- **Autor original:** [Andbal23](https://github.com/Andbal23) — Dynamic Music Pill
- **Fork TypeScript:** Gabriel Oliveira Brito
