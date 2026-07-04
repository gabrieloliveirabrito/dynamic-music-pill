# Bugs conhecidos

Registro de problemas identificados no fork TypeScript. O código legado serve apenas como referência de comportamento esperado.

## Encoding em traduções antigas

**Status:** corrigido em `po/pt_BR.po` (2026-06-24)

Strings com mojibake (ex.: `ConfiguraÃÂ§ÃÂµes`) foram regeneradas em UTF-8 via `scripts/generate-pt-br-po.py`.

## Port incompleto

**Status:** aberto

Grande parte da UI (pop-up expandido, visualizadores, abas de prefs) ainda não foi portada de `extension-old.js`. Comportamento pode divergir do upstream.

## Callback de debug em produção

**Status:** aberto

`extension.ts` registra callback `"first"` com `logInfo` de track — provável resquício de desenvolvimento; remover quando o controller estiver estável.

---

Ao encontrar novos bugs, adicionar entrada nesta pasta com: sintoma, reprodução, comparação com legado (se aplicável) e arquivos envolvidos.
