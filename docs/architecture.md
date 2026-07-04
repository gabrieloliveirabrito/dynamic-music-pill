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

```bash
pnpm install
pnpm build      # tsc --noEmit + esbuild
pnpm watch      # rebuild contínuo
pnpm typecheck  # apenas verificação de tipos
```

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
