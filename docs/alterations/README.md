# Alterações em relação ao upstream

Motivação das mudanças intencionais no fork. Não inclui o código legado congelado.

## Fork TypeScript (2026)

**Motivação:** Manutenibilidade, tipagem e compatibilidade com GNOME Shell 50.

**Mudanças:**

- Código-fonte em `src/` com TypeScript e `@girs/*`
- Build via esbuild em vez de JS plano na raiz
- `AppContext` para acesso centralizado a extension, settings e MPRIS
- Settings agrupados em proxy declarativo

**Referência legado:** `extension-old.js`, `prefs-old.js` (intocados)

## Estrutura de UI de preferências

**Motivação:** Alinhar prefs ao padrão Adw/GTK4 por linhas reutilizáveis.

**Mudanças:**

- `src/ui/preferences/general-tab/*-row.ts` — uma linha por configuração
- Índice em `general-tab/index.ts`

**Paridade:** Mesmas chaves GSettings do upstream; apenas organização do código mudou.

## Tradução pt_BR regenerada

**Motivação:** Corrigir encoding quebrado e completar strings vazias.

**Mudanças:**

- Header preserva autores Weblate; adicionado Gabriel Oliveira Brito como Last-Translator
- Script `scripts/generate-pt-br-po.py` para regenerar a partir de `messages.pot`

## Documentação do fork

**Motivação:** Separar README upstream de informações do port.

**Mudanças:**

- `README.fork.en.md` / `README.fork.pt.md` — fork
- `README.md` — original mantido
- `docs/` — documentação técnica do fork
