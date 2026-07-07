#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate po/pt_BR.po from po/messages.pot using embedded translations."""

from __future__ import annotations

import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
POT_PATH = REPO_ROOT / "po" / "messages.pot"
PO_PATH = REPO_ROOT / "po" / "pt_BR.po"

PO_HEADER_COMMENTS = (
    "# Brazilian Portuguese translations for Dynamic Music Pill.\n"
    "# Copyright (C) YEAR THE PACKAGE'S COPYRIGHT HOLDER\n"
    "# This file is distributed under the same license as the PACKAGE package.\n"
    "# FIRST AUTHOR <EMAIL@ADDRESS>, YEAR.\n"
    "#\n"
)

PO_HEADER_MSGSTR = (
    'msgid ""\n'
    'msgstr ""\n'
    '"Project-Id-Version: Dynamic Music Pill\\n"\n'
    '"Report-Msgid-Bugs-To: \\n"\n'
    '"POT-Creation-Date: 2026-06-03 16:59+0200\\n"\n'
    '"PO-Revision-Date: 2026-06-24\\n"\n'
    '"Last-Translator: Gabriel Oliveira Brito <gabriel.oliveira.brito@outlook.com>\\n"\n'
    '"Language-Team: Portuguese (Brazil)\\n"\n'
    '"Language: pt_BR\\n"\n'
    '"MIME-Version: 1.0\\n"\n'
    '"Content-Type: text/plain; charset=UTF-8\\n"\n'
    '"Content-Transfer-Encoding: 8bit\\n"\n'
    '"Plural-Forms: nplurals=2; plural=(n > 1);\\n"\n'
)

TRANSLATIONS: dict[str, str] = {
    "About": "Sobre",
    "Add up to two extra buttons in the expanded player's controls row.": "Adicione até dois botões extras na linha de controles do player expandido.",
    "Adds a slight delay to track changes (fixes sync issues)": "Adiciona um pequeno atraso nas trocas de faixa (corrige problemas de sincronização)",
    "Adjust the vinyl spin speed (Lower is slower, Default: 10)": "Ajuste a velocidade de rotação do vinil (valores menores = mais lento; padrão: 10)",
    "Adjust transparency level": "Ajustar nível de transparência",
    "After Text": "Depois do texto",
    "After Visualizer": "Depois do visualizador",
    "Album Art Cache": "Cache de capas",
    "Album Art Size": "Tamanho da capa",
    "Alignment Preset": "Predefinição de alinhamento",
    "All Controls": "Todos os controles",
    "Always ON": "Sempre ativo",
    "Animate long track titles and artist names": "Animar títulos e nomes de artista longos",
    "Apply to Album Art": "Aplicar à capa",
    "Apply to Text": "Aplicar ao texto",
    "Apply to Visualizer": "Aplicar ao visualizador",
    "Art Cache": "Cache de arte",
    "Audio Output": "Saída de áudio",
    "Audio Output Switcher": "Alternador de saída de áudio",
    "Audio control unavailable": "Controle de áudio indisponível",
    "Auto": "Automático",
    "Auto (Smart Selection)": "Automático (seleção inteligente)",
    "Auto (Smart)": "Automático (inteligente)",
    "Auto-adjust pill width (slider acts as max width)": "Ajustar largura da pílula automaticamente (o controle deslizante define a largura máxima)",
    "Automatically hide the pop-up when you move the cursor away": "Ocultar o pop-up automaticamente ao afastar o cursor",
    "Background Color": "Cor de fundo",
    "Background Opacity": "Opacidade do fundo",
    "Background and Transparency": "Fundo e transparência",
    "Backup & Restore": "Backup e restauração",
    "Beat (Jumpy)": "Batida (saltitante)",
    "Before Text": "Antes do texto",
    "Blacklist (Exclude listed)": "Lista negra (excluir os listados)",
    "Bottom": "Inferior",
    "Buy Me a Coffee": "Buy Me a Coffee",
    "Buy me a coffee on Ko-fi": "Apoie com um café no Ko-fi",
    "Cancel Timer": "Cancelar temporizador",
    "Center": "Centro",
    "Change Track": "Trocar faixa",
    "Change Tracks, Volume or Media Player using scroll wheel or touchpad": "Trocar faixas, volume ou player de mídia com a roda do mouse ou touchpad",
    "Change Volume": "Alterar volume",
    "Choose how to filter media players (e.g. browsers)": "Escolha como filtrar players de mídia (ex.: navegadores)",
    "Choose what scrolling on the pill should do": "Escolha o que a rolagem na pílula deve fazer",
    "Clear": "Limpar",
    "Clear History": "Limpar histórico",
    "Click an active player to add it to the filter list": "Clique em um player ativo para adicioná-lo à lista de filtro",
    "Click here for a quick guide and examples": "Clique aqui para um guia rápido e exemplos",
    "Click on a detected player to automatically fill the mapping.": "Clique em um player detectado para preencher o mapeamento automaticamente.",
    "Click to scan for active players again": "Clique para procurar players ativos novamente",
    "Close Player App": "Fechar aplicativo do player",
    "Close on Mouse Leave": "Fechar ao sair com o mouse",
    "Compact Mode (Hide Text)": "Modo compacto (ocultar texto)",
    "Container Target": "Destino do contêiner",
    "Controls Position": "Posição dos controles",
    "Corner Radius": "Raio dos cantos",
    "Creates a \"moving\" effect by hiding the main pill visualizer": "Cria um efeito de \"movimento\" ocultando o visualizador principal da pílula",
    "Custom Button 1": "Botão personalizado 1",
    "Custom Button 2": "Botão personalizado 2",
    "Custom Colors": "Cores personalizadas",
    "Custom Control Buttons": "Botões de controle personalizados",
    "Custom Width Value": "Valor de largura personalizada",
    "Danger Zone": "Zona de perigo",
    "Delete Mapping": "Excluir mapeamento",
    "Detected Players": "Players detectados",
    "Dimensions (Dock Mode)": "Dimensões (modo dock)",
    "Dimensions (Panel Mode)": "Dimensões (modo painel)",
    "Direction of the jump effect (Natural vs Traditional)": "Direção do efeito de salto (natural vs tradicional)",
    "Disable animations when a fullscreen app is active": "Desativar animações quando um app em tela cheia estiver ativo",
    "Disable dynamic sizing for the pop-up": "Desativar dimensionamento dinâmico do pop-up",
    "Display a subtle border around the main pill": "Exibir uma borda sutil ao redor da pílula principal",
    "Display active player icons in the pop-up": "Exibir ícones dos players ativos no pop-up",
    "Display album name next to the artist (Artist • Album)": "Exibir o álbum ao lado do artista (Artista • Álbum)",
    "Display extra controls in the pop-up": "Exibir controles extras no pop-up",
    "Display hours in the time labels when media is longer than 60 minutes": "Exibir horas nos rótulos de tempo quando a mídia durar mais de 60 minutos",
    "Display the album art in the pop-up": "Exibir a capa no pop-up",
    "Display the cover art of the currently playing song": "Exibir a capa da música em reprodução",
    "Distance between the text and the wave animation": "Distância entre o texto e a animação de onda",
    "Dock": "Dock",
    "Double Click": "Duplo clique",
    "Dynamic Width": "Largura dinâmica",
    "Dynamically change the GNOME Shell accent color to match the album art": "Alterar dinamicamente a cor de destaque do GNOME Shell para combinar com a capa",
    "Edit the target App ID for manually mapped players, or remove them.": "Edite o App ID de destino dos players mapeados manualmente ou remova-os.",
    "Enable Custom Buttons": "Ativar botões personalizados",
    "Enable Scroll Controls": "Ativar controles de rolagem",
    "Enable Shadow": "Ativar sombra",
    "Enable Transparency": "Ativar transparência",
    "Export": "Exportar",
    "Export Settings": "Exportar configurações",
    "Factory Reset": "Restaurar padrões de fábrica",
    "Fade Duration (ms)": "Duração do fade (ms)",
    "Fallback Album Art": "Capa alternativa",
    "Filtered Players (comma separated)": "Players filtrados (separados por vírgula)",
    "First (Start)": "Primeiro (início)",
    "First time? Check settings for custom buttons, scroll actions & more": "Primeira vez? Veja as configurações para botões personalizados, ações de rolagem e mais",
    "Follow Border Radius": "Seguir raio dos cantos",
    "Follow Custom Background Color": "Seguir cor de fundo personalizada",
    "Follow Custom Text Color": "Seguir cor do texto personalizada",
    "Follow Transparency": "Seguir transparência",
    "Freeze Scroll on Pause": "Congelar rolagem ao pausar",
    "Game Mode": "Modo jogo",
    "General Settings": "Configurações gerais",
    "Hide Auto (Smart Selection)": "Ocultar Automático (seleção inteligente)",
    "Hide Default GNOME Player": "Ocultar player padrão do GNOME",
    "Hide Pill Visualizer": "Ocultar visualizador da pílula",
    "Hide title and artist": "Ocultar título e artista",
    "Horizontal Offset (X)": "Deslocamento horizontal (X)",
    "Hover Action": "Ação ao passar o mouse",
    "Hover Delay (ms)": "Atraso ao passar o mouse (ms)",
    "How the widget aligns relative to other items": "Como o widget se alinha em relação aos outros itens",
    "If both buttons are set to Seek, they act directly (Button 1 = −10s, Button 2 = +10s). Otherwise Seek opens a sub-page.": "Se ambos os botões estiverem em Avançar, eles agem diretamente (Botão 1 = −10 s, Botão 2 = +10 s). Caso contrário, Avançar abre uma subpágina.",
    "Import": "Importar",
    "Import Settings": "Importar configurações",
    "Inherit corner roundness from the main pill": "Herdar arredondamento dos cantos da pílula principal",
    "Inherit opacity settings from the main pill": "Herdar configurações de opacidade da pílula principal",
    "Inline Artist": "Artista na mesma linha",
    "Invert Scroll Animation": "Inverter animação de rolagem",
    "Invert Scroll Direction": "Inverter direção da rolagem",
    "Last (End)": "Último (fim)",
    "Left": "Esquerda",
    "Left Click": "Clique esquerdo",
    "Loading...": "Carregando...",
    "Lyrics Display": "Exibição de letras",
    "Lyrics Fade-in Effect": "Efeito de fade-in nas letras",
    "Lyrics language preference": "Preferência de idioma das letras",
    "Main Pill": "Pílula principal",
    "Main Pill Shadow": "Sombra da pílula principal",
    "Manual Index": "Índice manual",
    "Manual Index Position": "Posição do índice manual",
    "Maximum height of the visualizer (auto-clamped to pill height)": "Altura máxima do visualizador (limitada automaticamente à altura da pílula)",
    "Middle Click": "Clique do meio",
    "Mouse Actions": "Ações do mouse",
    "Next Track": "Próxima faixa",
    "No Media": "Sem mídia",
    "No active media": "Nenhuma mídia ativa",
    "No active players detected. Open a music app first!": "Nenhum player ativo detectado. Abra um app de música primeiro!",
    "No audio stream available": "Nenhum fluxo de áudio disponível",
    "No history yet": "Ainda sem histórico",
    "No image selected": "Nenhuma imagem selecionada",
    "No manual mappings saved.": "Nenhum mapeamento manual salvo.",
    "No output devices found": "Nenhum dispositivo de saída encontrado",
    "No players found": "Nenhum player encontrado",
    "None": "Nenhum",
    "Not supported": "Não suportado",
    "Not supported by this player": "Não suportado por este player",
    "Note: 'Real-Time' mode requires the 'cava' package to be installed on your Linux system.": "Nota: o modo 'Tempo real' exige que o pacote 'cava' esteja instalado no seu sistema Linux.",
    "Number of bars displayed in the animation": "Número de barras exibidas na animação",
    "Off": "Desligado",
    "Off (Allow All)": "Desligado (permitir todos)",
    "Off (Disabled)": "Desligado (desativado)",
    "Open": "Abrir",
    "Open Menu": "Abrir menu",
    "Open Player App": "Abrir aplicativo do player",
    "Open Settings": "Abrir configurações",
    "Open Settings Backup": "Abrir backup de configurações",
    "Order in the list (0 is first). Only for Manual mode.": "Ordem na lista (0 é o primeiro). Apenas no modo manual.",
    "Outer Edge Margin": "Margem da borda externa",
    "Override dynamic colors": "Substituir cores dinâmicas",
    "Panel: Center Box": "Painel: caixa central",
    "Panel: Left Box": "Painel: caixa esquerda",
    "Panel: Right Box": "Painel: caixa direita",
    "Placed left of Shuffle.": "Posicionado à esquerda de Aleatório.",
    "Placed right of Loop.": "Posicionado à direita de Repetir.",
    "Play / Pause": "Reproduzir / Pausar",
    "Play/Pause Only": "Somente reproduzir/pausar",
    "Playback Speed": "Velocidade de reprodução",
    "Player": "Player",
    "Player Filter Mode": "Modo de filtro de players",
    "Player Selector Position": "Posição do seletor de player",
    "Player must support MPRIS Rate": "O player deve suportar taxa MPRIS",
    "Please install \"cava\" for real-time mode.": "Instale \"cava\" para o modo em tempo real.",
    "Pop-up Appearance": "Aparência do pop-up",
    "Pop-up Menu": "Menu pop-up",
    "Popup Visualizer Bar Count": "Quantidade de barras do visualizador no pop-up",
    "Popup Visualizer Bar Width": "Largura das barras do visualizador no pop-up",
    "Popup Visualizer Height": "Altura do visualizador no pop-up",
    "Positioning": "Posicionamento",
    "Prefer Latin": "Preferir latim",
    "Prefer original script": "Preferir escrita original",
    "Previous Track": "Faixa anterior",
    "Real-Time (Cava needed)": "Tempo real (requer cava)",
    "Recently Played": "Reproduzidos recentemente",
    "Refresh List": "Atualizar lista",
    "Remove the automatic player selection entry from the player selector menu": "Remover a entrada de seleção automática do menu do seletor de player",
    "Remove the duplicate built-in media controls": "Remover os controles de mídia integrados duplicados",
    "Report bugs or view source on GitHub": "Reportar bugs ou ver o código-fonte no GitHub",
    "Reset All": "Redefinir tudo",
    "Retain last known track and keep pill visible after closing the player": "Manter a última faixa conhecida e a pílula visível após fechar o player",
    "Right": "Direita",
    "Right Click": "Clique direito",
    "Rotate Vinyl": "Girar vinil",
    "Rotation Speed": "Velocidade de rotação",
    "Roundness of the widget edges (0 = Square, 25 = Pill)": "Arredondamento das bordas do widget (0 = quadrado, 25 = pílula)",
    "Running Players Detection": "Detecção de players em execução",
    "Runs inside the shell — works on lock screen": "Executa dentro do shell — funciona na tela de bloqueio",
    "Save App ID": "Salvar App ID",
    "Save Settings": "Salvar configurações",
    "Saved App Mappings": "Mapeamentos de app salvos",
    "Scroll Action": "Ação de rolagem",
    "Scroll Only on Hover": "Rolar somente ao passar o mouse",
    "Scrolling Text": "Texto com rolagem",
    "Seek": "Avançar",
    "Seek ±10 Seconds": "Avançar/voltar ±10 segundos",
    "Seek ±10s": "Avançar/voltar ±10 s",
    "Select Fallback Image": "Selecionar imagem alternativa",
    "Select Media Player": "Selecionar player de mídia",
    "Select Player": "Selecionar player",
    "Select a player to help the extension identify it:": "Selecione um player para ajudar a extensão a identificá-lo:",
    "Select the style of the audio reaction bars": "Selecione o estilo das barras de reação ao áudio",
    "Select which UI element should host the music pill": "Selecione qual elemento da interface deve abrigar a pílula de música",
    "Shadow Blur": "Desfoque da sombra",
    "Shadow Intensity": "Intensidade da sombra",
    "Shift Left (-) or Right (+)": "Deslocar para esquerda (−) ou direita (+)",
    "Shift Up (-) or Down (+)": "Deslocar para cima (−) ou para baixo (+)",
    "Show Album Art": "Mostrar capa do álbum",
    "Show Album Title": "Mostrar título do álbum",
    "Show Artist": "Mostrar artista",
    "Show HH:MM:SS": "Mostrar HH:MM:SS",
    "Show Pill Outline": "Mostrar contorno da pílula",
    "Show Player Selector": "Mostrar seletor de player",
    "Show Shuffle and Loop": "Mostrar aleatório e repetir",
    "Show Vinyl": "Mostrar vinil",
    "Show Visualizer in Pop-up": "Mostrar visualizador no pop-up",
    "Show \"Title • Artist\" when the widget is squeezed": "Mostrar \"Título • Artista\" quando o widget estiver comprimido",
    "Show additional action buttons next to Shuffle and Loop": "Mostrar botões de ação extras ao lado de Aleatório e Repetir",
    "Show drop shadow behind the pop-up menu": "Mostrar sombra projetada atrás do menu pop-up",
    "Show media buttons directly on the pill": "Mostrar botões de mídia diretamente na pílula",
    "Show real-time synchronized lyrics for current track.": "Mostrar letras sincronizadas em tempo real da faixa atual.",
    "Show the artist name in the main music pill": "Mostrar o nome do artista na pílula principal de música",
    "Skip Only": "Somente pular",
    "Sleep Timer": "Temporizador de sono",
    "Slow Player Workaround": "Contorno para players lentos",
    "Smoothly fade in new lyric lines": "Aplicar fade suave em novas linhas de letra",
    "Source Code": "Código-fonte",
    "Spacing before the album art and after the visualizer": "Espaçamento antes da capa e depois do visualizador",
    "Spin the album art when playing": "Girar a capa durante a reprodução",
    "Square Vinyl Image": "Imagem de vinil quadrada",
    "Stop the text scrolling animation when the media player is paused": "Parar a animação de rolagem do texto quando o player estiver pausado",
    "Style & Layout": "Estilo e layout",
    "Support on Ko-fi": "Apoie no Ko-fi",
    "Support the Project": "Apoie o projeto",
    "Support via BuyMeACoffee": "Apoie via BuyMeACoffee",
    "Swap up/down scrolling for track and volume actions": "Inverter rolagem para cima/baixo nas ações de faixa e volume",
    "Switch Player": "Trocar player",
    "Switch between a solid theme background and a custom transparent look": "Alternar entre fundo sólido do tema e aparência transparente personalizada",
    "Sync GNOME Accent Color": "Sincronizar cor de destaque do GNOME",
    "System": "Sistema",
    "System & Reset": "Sistema e redefinição",
    "System Volume": "Volume do sistema",
    "Tablet Mode Controls": "Controles no modo tablet",
    "Text Color": "Cor do texto",
    "Text stays still until you hover the pill": "O texto permanece parado até você passar o mouse sobre a pílula",
    "Thickness of individual bars (pixels)": "Espessura das barras individuais (pixels)",
    "This player does not support playback speed": "Este player não suporta velocidade de reprodução",
    "This player does not support seeking": "Este player não suporta avanço na faixa",
    "Toggle Mute All": "Alternar silenciar tudo",
    "Top": "Superior",
    "Track History": "Histórico de faixas",
    "Type the correct App ID, then hit Enter or click the Save icon!": "Digite o App ID correto e pressione Enter ou clique no ícone Salvar!",
    "Unknown": "Desconhecido",
    "Unknown Artist": "Artista desconhecido",
    "Unknown Device": "Dispositivo desconhecido",
    "Unknown Player": "Player desconhecido",
    "Unknown Title": "Título desconhecido",
    "Use Custom Colors": "Usar cores personalizadas",
    "Use Custom Width": "Usar largura personalizada",
    "Use This": "Usar este",
    "Use a square album art (disables rotation)": "Usar capa quadrada (desativa a rotação)",
    "Use the custom background color for the pop-up (if active)": "Usar a cor de fundo personalizada no pop-up (se ativa)",
    "Use the custom text color for the pop-up (if active)": "Usar a cor do texto personalizada no pop-up (se ativa)",
    "Vertical Offset (Y)": "Deslocamento vertical (Y)",
    "Visualizer Animation": "Animação do visualizador",
    "Visualizer Bar Count": "Quantidade de barras do visualizador",
    "Visualizer Bar Width": "Largura das barras do visualizador",
    "Visualizer Height": "Altura do visualizador",
    "Visualizer Margin": "Margem do visualizador",
    "Visualizer and Shape": "Visualizador e forma",
    "Volume": "Volume",
    "Volume Control": "Controle de volume",
    "Waiting for playback...": "Aguardando reprodução...",
    "Wave (Smooth)": "Onda (suave)",
    "What's New": "Novidades",
    "When multiple versions exist": "Quando existirem várias versões",
    "Where to place the player icons inside the pop-up": "Onde posicionar os ícones de player dentro do pop-up",
    "Where to place the tablet controls on the pill": "Onde posicionar os controles de tablet na pílula",
    "Whitelist (Only allow listed)": "Lista branca (permitir somente os listados)",
    "Widget Height": "Altura do widget",
    "Widget Width": "Largura do widget",
    "covers cached": "capas em cache",
    "min left": "mín. restante",
    "💡 How to find the correct App ID?": "💡 Como encontrar o App ID correto?",
    "To allow the extension to open/close your player, you need to provide its exact window name (App ID).\n\n<b>Common Examples:</b>\n• Spotify (Flatpak): <b>com.spotify.Client</b>\n• VLC: <b>vlc</b>\n• YouTube Music (Web App): <b>youtube-music</b>\n• High Tide: <b>io.github.nokse22.high-tide</b>\n• Browsers: <b>chromium</b>, <b>firefox</b>, <b>brave-browser</b>\n\n<b>How to find it manually:</b>\n1. Press <b>Alt + F2</b>, type <b>lg</b>, and press Enter.\n2. Click on the <b>Windows</b> tab in the top right corner.\n3. Find your music player in the list.\n4. Look at the <b>wmclass:</b> or <b>app:</b> field. That is your App ID! <i>(Remove the .desktop part)</i>\n5. Press Esc to close the debugger.": "Para permitir que a extensão abra/feche seu player, informe o nome exato da janela (App ID).\n\n<b>Exemplos comuns:</b>\n• Spotify (Flatpak): <b>com.spotify.Client</b>\n• VLC: <b>vlc</b>\n• YouTube Music (Web App): <b>youtube-music</b>\n• High Tide: <b>io.github.nokse22.high-tide</b>\n• Navegadores: <b>chromium</b>, <b>firefox</b>, <b>brave-browser</b>\n\n<b>Como encontrar manualmente:</b>\n1. Pressione <b>Alt + F2</b>, digite <b>lg</b> e pressione Enter.\n2. Clique na aba <b>Windows</b> no canto superior direito.\n3. Encontre seu player de música na lista.\n4. Veja o campo <b>wmclass:</b> ou <b>app:</b>. Esse é o seu App ID! <i>(Remova a parte .desktop)</i>\n5. Pressione Esc para fechar o depurador."
}

def decode_po_string(lines: list[str]) -> str:
    parts: list[str] = []
    for line in lines:
        if line.startswith("msgid ") or line.startswith("msgstr "):
            line = line.split(" ", 1)[1].strip()
        elif line.startswith("msgstr["):
            line = line.split(" ", 1)[1].strip()
        chunk = line[1:-1]
        chunk = (
            chunk.replace("\\n", "\n")
            .replace("\\t", "\t")
            .replace('\\"', '"')
            .replace("\\\\", "\\")
        )
        parts.append(chunk)
    return "".join(parts)


def encode_po_string(text: str, prefix: str = "msgstr") -> list[str]:
    if text == "":
        return [f'{prefix} ""']

    escaped = (
        text.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\t", "\\t")
        .replace("\n", "\\n")
    )

    if len(escaped) <= 77:
        return [f'{prefix} "{escaped}"']

    lines_out = [f'{prefix} "{escaped[:77]}"']
    pos = 77
    while pos < len(escaped):
        lines_out.append(f'"{escaped[pos : pos + 77]}"')
        pos += 77
    return lines_out


def format_msgstr_lines(msgid_lines: list[str], msgstr: str) -> list[str]:
    if len(msgid_lines) <= 1:
        return encode_po_string(msgstr)

    msgid_text = decode_po_string(msgid_lines)
    if "\n" not in msgid_text:
        return encode_po_string(msgstr)

    out = ['msgstr ""']
    segments = msgstr.split("\n")
    for idx, seg in enumerate(segments):
        e = (
            seg.replace("\\", "\\\\")
            .replace('"', '\\"')
            .replace("\t", "\\t")
        )
        suffix = "\\n" if idx < len(segments) - 1 else ""
        out.append(f'"{e}{suffix}"')
    return out


def parse_pot_entries(text: str) -> list[tuple[list[str], list[str], str]]:
    entries: list[tuple[list[str], list[str], str]] = []
    lines = text.split("\n")
    i = 0
    while i < len(lines):
        refs: list[str] = []
        while i < len(lines) and (lines[i].startswith("#") or lines[i].strip() == ""):
            if lines[i].startswith("#"):
                refs.append(lines[i])
            i += 1
        if i >= len(lines):
            break
        if not lines[i].startswith("msgid "):
            i += 1
            continue
        msgid_lines: list[str] = []
        while i < len(lines) and (
            lines[i].startswith("msgid ")
            or (msgid_lines and lines[i].startswith('"') and not lines[i].startswith("msgstr"))
        ):
            msgid_lines.append(lines[i])
            i += 1
        while i < len(lines) and (
            lines[i].startswith("msgstr")
            or (lines[i].startswith('"') and not lines[i].startswith("msgid"))
        ):
            i += 1
        msgid_text = decode_po_string(msgid_lines)
        entries.append((refs, msgid_lines, msgid_text))
    return entries


def build_po(pot_text: str) -> tuple[str, int]:
    entries = parse_pot_entries(pot_text)
    translated = 0
    blocks: list[str] = [PO_HEADER_COMMENTS, PO_HEADER_MSGSTR.rstrip("\n")]

    for refs, msgid_lines, msgid_text in entries:
        if msgid_text == "":
            continue

        if msgid_text not in TRANSLATIONS:
            raise KeyError(f"Missing translation for msgid: {msgid_text!r}")

        msgstr = TRANSLATIONS[msgid_text]
        if not msgstr:
            raise ValueError(f"Empty msgstr for msgid: {msgid_text!r}")

        block_lines: list[str] = []
        block_lines.extend(refs)
        block_lines.extend(msgid_lines)
        block_lines.extend(format_msgstr_lines(msgid_lines, msgstr))
        blocks.append("\n".join(block_lines))
        translated += 1

    return "\n\n".join(blocks) + "\n", translated


def main() -> int:
    pot_text = POT_PATH.read_text(encoding="utf-8")
    po_text, count = build_po(pot_text)
    PO_PATH.write_text(po_text, encoding="utf-8")
    print(f"Wrote {PO_PATH} ({count} translated entries)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
