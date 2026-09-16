# Nota: arte preta após um tempo (também em outras extensões)

## Sintoma

Depois de um tempo tocando, a capa fica preta/vazia. Outras extensões MPRIS
mostram o mesmo.

## Interpretação

Quase certamente **upstream do player** (Chrome / YouTube Music / Plasma
browser integration): `mpris:artUrl` some, vira URL temporária expirada, ou o
arquivo `file://` em `/tmp` é limpo. Qualquer cliente MPRIS que só pinta
`background-image: url(...)` vai ficar no placeholder escuro.

Não é específico do port TypeScript. Se voltar a acontecer, conferir com:

```bash
busctl --user call org.mpris.MediaPlayer2.<player> /org/mpris/MediaPlayer2 \
  org.freedesktop.DBus.Properties Get \
  ss org.mpris.MediaPlayer2.Player Metadata
```

e ver o valor de `mpris:artUrl`.
