var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/.pnpm/@girs+gnome-shell@50.0.1/node_modules/@girs/gnome-shell/dist/extensions/prefs.js
var prefs_exports = {};
__reExport(prefs_exports, prefs_star);
import * as prefs_star from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

// src/ui/preferences/main-page/index.ts
import Adw28 from "gi://Adw";
import GObject28 from "gi://GObject";

// src/ui/preferences/main-page/general-actions/index.ts
import Adw20 from "gi://Adw";
import GObject20 from "gi://GObject";

// src/ui/preferences/main-page/general-actions/components/always-show-row.ts
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import Adw from "gi://Adw";
var _AlwaysShowRow = class _AlwaysShowRow extends Adw.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const alwaysShowToggle = new Gtk.Switch({
      active: settings.pill.alwaysShow,
      valign: Gtk.Align.CENTER
    });
    this.add_suffix(alwaysShowToggle);
    settings.pill.bind("alwaysShow", alwaysShowToggle, "active");
    this.add_suffix(alwaysShowToggle);
  }
};
GObject.registerClass(_AlwaysShowRow);
var AlwaysShowRow = _AlwaysShowRow;

// src/ui/preferences/main-page/general-actions/components/art-row.ts
import Adw2 from "gi://Adw";
import Gtk2 from "gi://Gtk";
import GObject2 from "gi://GObject";
var _ArtRow = class _ArtRow extends Adw2.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const artToggle = new Gtk2.Switch({
      active: settings.pill.showAlbumArt,
      valign: Gtk2.Align.CENTER
    });
    this.add_suffix(artToggle);
    settings.pill.bind("showAlbumArt", artToggle, "active");
  }
};
GObject2.registerClass(_ArtRow);
var ArtRow = _ArtRow;

// src/ui/preferences/main-page/general-actions/components/fallback-row.ts
import Adw3 from "gi://Adw";
import Gtk3 from "gi://Gtk";
import GObject3 from "gi://GObject";
import Gio from "gi://Gio";

// src/utils/translate.ts
function t(key) {
  return (0, prefs_exports.gettext)(key);
}

// src/ui/preferences/main-page/general-actions/components/fallback-row.ts
var _FallbackRow = class _FallbackRow extends Adw3.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const fallbackBtn = new Gtk3.Button({
      icon_name: "document-open-symbolic",
      valign: Gtk3.Align.CENTER,
      css_classes: ["center"]
    });
    fallbackBtn.connect("clicked", () => {
      let dialog = new Gtk3.FileDialog({
        title: t("Select Fallback Image")
      });
      let filter = new Gtk3.FileFilter({
        name: "Images",
        mime_types: ["image/png", "image/jpeg"]
      });
      let filterList = new Gio.ListStore({
        itemType: Gtk3.FileFilter
      });
      filterList.append(filter);
      dialog.set_filters(filterList);
      try {
        dialog.open(null, null, (dlg, res) => {
          let file = dlg == null ? void 0 : dlg.open_finish(res);
          if (file) {
            let path = file.get_path();
            if (path) {
              settings.fallbackArt.artPath = path;
              this.subtitle = path;
            }
          }
        });
      } catch (e) {
        logError(e);
      }
    });
    const clearFallbackBtn = new Gtk3.Button({
      icon_name: "edit-clear-symbolic",
      valign: Gtk3.Align.CENTER,
      css_classes: ["flat", "error"]
    });
    clearFallbackBtn.connect("clicked", () => {
      settings.fallbackArt.artPath = "";
      this.subtitle = t("No image selected");
    });
    const btnBox = new Gtk3.Box({
      spacing: 6,
      valign: Gtk3.Align.CENTER
    });
    btnBox.append(fallbackBtn);
    btnBox.append(clearFallbackBtn);
    this.add_suffix(btnBox);
    settings.pill.bind("showAlbumArt", this, "sensitive");
  }
};
GObject3.registerClass(_FallbackRow);
var FallbackRow = _FallbackRow;

// src/ui/preferences/main-page/general-actions/components/scroll-ctrl-row.ts
import Adw4 from "gi://Adw";
import Gtk4 from "gi://Gtk";
import GObject4 from "gi://GObject";
var _ScrollCtrlRow = class _ScrollCtrlRow extends Adw4.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const scrollCtrlToggle = new Gtk4.Switch({
      active: settings.scrollControls.enabled,
      valign: Gtk4.Align.CENTER
    });
    settings.scrollControls.bind("enabled", scrollCtrlToggle, "active");
    this.add_suffix(scrollCtrlToggle);
  }
};
GObject4.registerClass(_ScrollCtrlRow);
var ScrollCtrlRow = _ScrollCtrlRow;

// src/ui/preferences/main-page/general-actions/components/scroll-action-row.ts
import Adw5 from "gi://Adw";
import GObject5 from "gi://GObject";
import Gtk5 from "gi://Gtk";
var ActionIdMap = {
  "volume": 1,
  "player": 2,
  "seek": 3
};
var _ScrollActionRow = class _ScrollActionRow extends Adw5.ComboRow {
  constructor(settings, properties, ...args) {
    var _a;
    super(properties, args);
    const scrollActionModel = new Gtk5.StringList();
    scrollActionModel.append(t("Change Track"));
    scrollActionModel.append(t("Change Volume"));
    scrollActionModel.append(t("Switch Player"));
    scrollActionModel.append(t("Seek \xB110s"));
    let currentAction = settings.scrollControls.action;
    let selectedIdx = (_a = ActionIdMap[currentAction]) != null ? _a : 0;
    this.set_model(scrollActionModel);
    this.set_selected(selectedIdx);
    settings.connect("changed::scroll-action", () => {
      var _a2;
      const action = settings.scrollControls.action;
      this.selected = (_a2 = ActionIdMap[action]) != null ? _a2 : 0;
    });
    this.connect("notify::selected", () => {
      let val = "track";
      if (this.selected === 1)
        val = "volume";
      else if (this.selected === 2)
        val = "player";
      else if (this.selected === 3)
        val = "seek";
      settings.scrollControls.action = val;
    });
    settings.scrollControls.bind("enabled", this, "sensitive");
  }
};
GObject5.registerClass(_ScrollActionRow);
var ScrollActionRow = _ScrollActionRow;

// src/ui/preferences/main-page/general-actions/components/invert-row.ts
import Adw6 from "gi://Adw";
import Gtk6 from "gi://Gtk";
import GObject6 from "gi://GObject";
var _InvertRow = class _InvertRow extends Adw6.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const invertToggle = new Gtk6.Switch({
      active: settings.scrollControls.invert,
      valign: Gtk6.Align.CENTER
    });
    this.add_suffix(invertToggle);
    settings.scrollControls.bind("invert", invertToggle, "active");
    this.add_suffix(invertToggle);
  }
};
GObject6.registerClass(_InvertRow);
var InvertRow = _InvertRow;

// src/ui/preferences/main-page/general-actions/components/invert-dir-row.ts
import Adw7 from "gi://Adw";
import Gtk7 from "gi://Gtk";
import GObject7 from "gi://GObject";
var _InvertDirRow = class _InvertDirRow extends Adw7.ActionRow {
  constructor(settings, props, ...args) {
    super(props, args);
    const invertDirToggle = new Gtk7.Switch({
      active: settings.scrollControls.invertScrollDirection,
      valign: Gtk7.Align.CENTER
    });
    settings.scrollControls.bind("invertScrollDirection", invertDirToggle, "active");
    this.add_suffix(invertDirToggle);
  }
};
GObject7.registerClass(_InvertDirRow);
var InvertDirRow = _InvertDirRow;

// src/ui/preferences/main-page/general-actions/components/scroll-text-row.ts
import Adw8 from "gi://Adw";
import GObject8 from "gi://GObject";
import Gtk8 from "gi://Gtk";
var _ScrollTextRow = class _ScrollTextRow extends Adw8.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const scrollTextToggle = new Gtk8.Switch({
      active: settings.scrollControls.scrollText,
      valign: Gtk8.Align.CENTER
    });
    settings.scrollControls.bind("scrollText", scrollTextToggle, "active");
    this.add_suffix(scrollTextToggle);
  }
};
GObject8.registerClass(_ScrollTextRow);
var ScrollTextRow = _ScrollTextRow;

// src/ui/preferences/main-page/general-actions/components/scroll-hover-row.ts
import Adw9 from "gi://Adw";
import Gtk9 from "gi://Gtk";
import GObject9 from "gi://GObject";
var _ScrollHoverRow = class _ScrollHoverRow extends Adw9.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const scrollHoverToggle = new Gtk9.Switch({
      active: settings.scrollControls.onHoverOnly,
      valign: Gtk9.Align.CENTER
    });
    settings.scrollControls.bind("onHoverOnly", scrollHoverToggle, "active");
    settings.scrollControls.bind("scrollText", this, "sensitive");
    this.add_suffix(scrollHoverToggle);
  }
};
GObject9.registerClass(_ScrollHoverRow);
var ScrollHoverRow = _ScrollHoverRow;

// src/ui/preferences/main-page/general-actions/components/scroll-pause-row.ts
import Adw10 from "gi://Adw";
import Gtk10 from "gi://Gtk";
import GObject10 from "gi://GObject";
var _ScrollPauseRow = class _ScrollPauseRow extends Adw10.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const scrollPauseToggle = new Gtk10.Switch({
      active: settings.scrollControls.freezeOnPause,
      valign: Gtk10.Align.CENTER
    });
    settings.scrollControls.bind("freezeOnPause", scrollPauseToggle, "active");
    settings.scrollControls.bind("scrollText", this, "sensitive");
    this.add_suffix(scrollPauseToggle);
  }
};
GObject10.registerClass(_ScrollPauseRow);
var ScrollPauseRow = _ScrollPauseRow;

// src/ui/preferences/main-page/general-actions/components/lyrics-row.ts
import Adw11 from "gi://Adw";
import Gtk11 from "gi://Gtk";
import GObject11 from "gi://GObject";
var _LyricsRow = class _LyricsRow extends Adw11.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const lyricsToggle = new Gtk11.Switch({
      active: settings.lyrics.enable,
      valign: Gtk11.Align.CENTER
    });
    settings.lyrics.bind("enable", lyricsToggle, "active");
    this.add_suffix(lyricsToggle);
  }
};
GObject11.registerClass(_LyricsRow);
var LyricsRow = _LyricsRow;

// src/ui/preferences/main-page/general-actions/components/lang-pref-row.ts
import Adw12 from "gi://Adw";
import Gtk12 from "gi://Gtk";
import GObject12 from "gi://GObject";
var _LangPrefRow = class _LangPrefRow extends Adw12.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const model = Gtk12.StringList.new([
      t("Auto"),
      t("Prefer original script"),
      t("Prefer Latin")
    ]);
    this.set_model(model);
    this.set_selected(settings.lyrics.preferedLanguage);
    this.connect("notify::selected", () => {
      settings.lyrics.preferedLanguage = this.get_selected();
    });
  }
};
GObject12.registerClass(_LangPrefRow);
var LangPrefRow = _LangPrefRow;

// src/ui/preferences/main-page/general-actions/components/lyric-fade-row.ts
import Adw13 from "gi://Adw";
import Gtk13 from "gi://Gtk";
import GObject13 from "gi://GObject";
var _LyricFadeRow = class _LyricFadeRow extends Adw13.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const lyricFadeToggle = new Gtk13.Switch({
      active: settings.lyrics.fade,
      valign: Gtk13.Align.CENTER
    });
    settings.lyrics.bind("fade", lyricFadeToggle, "active");
    settings.lyrics.bind("enable", this, "sensitive");
    this.add_suffix(lyricFadeToggle);
  }
};
GObject13.registerClass(_LyricFadeRow);
var LyricFadeRow = _LyricFadeRow;

// src/ui/preferences/main-page/general-actions/components/lyric-fade-duration-row.ts
import Adw14 from "gi://Adw";
import Gtk14 from "gi://Gtk";
import GObject14 from "gi://GObject";
var _LyricFadeDurationRow = class _LyricFadeDurationRow extends Adw14.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    var lyricFadeDurationRow = new Adw14.SpinRow({
      adjustment: new Gtk14.Adjustment({ lower: 50, upper: 2e3, step_increment: 50 })
    });
    settings.lyrics.bind("fadeDuration", lyricFadeDurationRow, "value");
    settings.lyrics.bind("enable", lyricFadeDurationRow, "sensitive");
    this.add_suffix(lyricFadeDurationRow);
  }
};
GObject14.registerClass(_LyricFadeDurationRow);
var LyricFadeDurationRow = _LyricFadeDurationRow;

// src/ui/preferences/main-page/general-actions/components/tablet-mode-row.ts
import Adw15 from "gi://Adw";
import Gtk15 from "gi://Gtk";
import GObject15 from "gi://GObject";
var _TabletModeRow = class _TabletModeRow extends Adw15.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const model = new Gtk15.StringList({
      strings: [t("Off"), t("Skip Only"), t("Play/Pause Only"), t("All Controls")]
    });
    this.set_model(model);
    this.set_selected(settings.pill.tabletMode);
    settings.pill.bind("tabletMode", this, "selected");
  }
};
GObject15.registerClass(_TabletModeRow);
var TabletModeRow = _TabletModeRow;

// src/ui/preferences/main-page/general-actions/components/control-pos-row.ts
import Adw16 from "gi://Adw";
import Gtk16 from "gi://Gtk";
import GObject16 from "gi://GObject";
var _ControlPosRow = class _ControlPosRow extends Adw16.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const model = new Gtk16.StringList({
      strings: [t("Before Text"), t("After Text"), t("After Visualizer")]
    });
    this.set_model(model);
    this.set_selected(settings.pill.controlsPosition);
    this.connect("notify::selected", () => {
      settings.pill.controlsPosition = this.get_selected();
    });
    settings.pill.bind("controlsPosition", this, "selected");
    this.sensitive = settings.pill.tabletMode > 0;
    settings.pill.bind("tabletMode", this, "sensitive");
  }
};
GObject16.registerClass(_ControlPosRow);
var ControlPosRow = _ControlPosRow;

// src/ui/preferences/main-page/general-actions/components/inline-artist-row.ts
import Adw17 from "gi://Adw";
import Gtk17 from "gi://Gtk";
import GObject17 from "gi://GObject";
var _InlineArtistRow = class _InlineArtistRow extends Adw17.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const inlineArtistToggle = new Gtk17.Switch({
      active: settings.pill.inlineArtist,
      valign: Gtk17.Align.CENTER
    });
    settings.pill.bind("inlineArtist", inlineArtistToggle, "active");
    settings.pill.connect("changed::show-artist", () => {
      this.sensitive = settings.pill.showArtist;
    });
    this.add_suffix(inlineArtistToggle);
  }
};
GObject17.registerClass(_InlineArtistRow);
var InlineArtistRow = _InlineArtistRow;

// src/ui/preferences/main-page/general-actions/components/show-artist-row.ts
import Adw18 from "gi://Adw";
import Gtk18 from "gi://Gtk";
import GObject18 from "gi://GObject";
var _ShowArtistRow = class _ShowArtistRow extends Adw18.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const showArtistToggle = new Gtk18.Switch({
      active: settings.pill.showArtist,
      valign: Gtk18.Align.CENTER
    });
    settings.pill.bind("showArtist", this, "active");
    this.add_suffix(showArtistToggle);
  }
};
GObject18.registerClass(_ShowArtistRow);
var ShowArtistRow = _ShowArtistRow;

// src/ui/preferences/main-page/general-actions/components/hide-text.row.ts
import Adw19 from "gi://Adw";
import GObject19 from "gi://GObject";
import Gtk19 from "gi://Gtk";
var _HideTextRow = class _HideTextRow extends Adw19.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const hideTextToggle = new Gtk19.Switch({
      active: settings.pill.hideText,
      valign: Gtk19.Align.CENTER
    });
    settings.pill.bind("hideText", hideTextToggle, "active");
    this.add_suffix(hideTextToggle);
  }
};
GObject19.registerClass(_HideTextRow);
var HideTextRow = _HideTextRow;

// src/ui/preferences/main-page/general-actions/index.ts
var _GeneralTab = class _GeneralTab extends Adw20.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const alwaysShowRow = new AlwaysShowRow(settings, {
      title: t("Always ON"),
      subtitle: t("Retain last known track and keep pill visible after closing the player")
    });
    this.add(alwaysShowRow);
    const artRow = new ArtRow(settings, {
      title: t("Show Album Art"),
      subtitle: t("Displa the cover art of the currently playing song")
    });
    this.add(artRow);
    const fallbackRow = new FallbackRow(settings, {
      title: t("Fallback Album Art"),
      subtitle: settings.fallbackArt.artPath || t("No image selected")
    });
    this.add(fallbackRow);
    const scrollCtrlRow = new ScrollCtrlRow(settings, {
      title: t("Enable Scroll Controls"),
      subtitle: t("Change Tracks, Volume or Media Player using scroll wheel or touchpad")
    });
    this.add(scrollCtrlRow);
    const scrollActionRow = new ScrollActionRow(settings, {
      title: t("Scroll Action"),
      subtitle: t("Choose what scrolling on the pill should do")
    });
    this.add(scrollActionRow);
    const invertRow = new InvertRow(settings, {
      title: t("Invert Scroll Animation"),
      subtitle: t("Direction of the jump effect (Natural vs Traditional)")
    });
    this.add(invertRow);
    const invertDirRow = new InvertDirRow(settings, {
      title: t("Invert Scroll Direction"),
      subtitle: t("Swap up/down scrolling for track and volume actions")
    });
    this.add(invertDirRow);
    const scrollTextRow = new ScrollTextRow(settings, {
      title: t("Scrolling Text"),
      subtitle: t("Animate long track titles and artist names")
    });
    this.add(scrollTextRow);
    const scrollHoverRow = new ScrollHoverRow(settings, {
      title: t("Scroll Only on Hover"),
      subtitle: t("Text stays still until you hover the pill")
    });
    this.add(scrollHoverRow);
    const scrollPauseRow = new ScrollPauseRow(settings, {
      title: t("Freeze Scroll on Pause"),
      subtitle: t("Stop the text scrolling animation when the media player is paused")
    });
    this.add(scrollPauseRow);
    const lyricsRow = new LyricsRow(settings, {
      title: t("Lyrics Display"),
      subtitle: t("Show real-time synchronized lyrics for current track.")
    });
    this.add(lyricsRow);
    const langPrefRow = new LangPrefRow(settings, {
      title: t("Lyrics language preference"),
      subtitle: t("When multiple versions exist")
    });
    this.add(langPrefRow);
    const lyricFadeRow = new LyricFadeRow(settings, {
      title: t("Lyrics Fade-in Effect"),
      subtitle: t("Smoothly fade in new lyric lines")
    });
    this.add(lyricFadeRow);
    const lyricFadeDurationRow = new LyricFadeDurationRow(settings, {
      title: t("Fade Duration (ms)")
    });
    this.add(lyricFadeDurationRow);
    const tabletModeRow = new TabletModeRow(settings, {
      title: t("Tablet Mode Controls"),
      subtitle: t("Show media buttons directly on the pill")
    });
    this.add(tabletModeRow);
    const controlPosRow = new ControlPosRow(settings, {
      title: t("Controls Position"),
      subtitle: t("Where to place the tablet controls on the pill")
    });
    this.add(controlPosRow);
    const inlineArtistRow = new InlineArtistRow(settings, {
      title: t("Inline Artist"),
      subtitle: t('Show "Title \u2022 Artist" when the widget is squeezed')
    });
    this.add(inlineArtistRow);
    const showArtistRow = new ShowArtistRow(settings, {
      title: t("Show Artist"),
      subtitle: t("Show the artist name in the main music pill")
    });
    this.add(showArtistRow);
    const hideTextRow = new HideTextRow(settings, {
      title: t("Compact Mode (Hide Text)"),
      subtitle: t("Hide title and artist")
    });
    this.add(hideTextRow);
  }
};
GObject20.registerClass(_GeneralTab);
var GeneralTab = _GeneralTab;

// src/ui/preferences/main-page/mouse-actions/index.ts
import Adw27 from "gi://Adw";
import GObject27 from "gi://GObject";
import Gtk21 from "gi://Gtk";

// src/ui/preferences/main-page/mouse-actions/components/left-click-row.ts
import Adw21 from "gi://Adw";
import GObject21 from "gi://GObject";
var _LeftClickRow = class _LeftClickRow extends Adw21.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    this.set_selected(MouseActionsTab.ACTION_VALUES.indexOf(settings.mouseActions.leftClick));
    this.connect("notify::selected", () => {
      settings.mouseActions.leftClick = MouseActionsTab.ACTION_VALUES[this.get_selected()];
    });
  }
};
GObject21.registerClass(_LeftClickRow);
var LeftClickRow = _LeftClickRow;

// src/ui/preferences/main-page/mouse-actions/components/double-click-row.ts
import Adw22 from "gi://Adw";
import GObject22 from "gi://GObject";
var _DoubleClickRow = class _DoubleClickRow extends Adw22.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    this.set_selected(MouseActionsTab.ACTION_VALUES.indexOf(settings.mouseActions.doubleClick));
    this.connect("notify::selected", () => {
      settings.mouseActions.doubleClick = MouseActionsTab.ACTION_VALUES[this.get_selected()];
    });
  }
};
GObject22.registerClass(_DoubleClickRow);
var DoubleClickRow = _DoubleClickRow;

// src/ui/preferences/main-page/mouse-actions/components/mid-click-row.ts
import Adw23 from "gi://Adw";
import GObject23 from "gi://GObject";
var _MidClickRow = class _MidClickRow extends Adw23.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    this.set_selected(MouseActionsTab.ACTION_VALUES.indexOf(settings.mouseActions.middleClick));
    this.connect("notify::selected", () => {
      settings.mouseActions.middleClick = MouseActionsTab.ACTION_VALUES[this.get_selected()];
    });
  }
};
GObject23.registerClass(_MidClickRow);
var MidClickRow = _MidClickRow;

// src/ui/preferences/main-page/mouse-actions/components/right-click-row.ts
import Adw24 from "gi://Adw";
import GObject24 from "gi://GObject";
var _RightClickRow = class _RightClickRow extends Adw24.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    this.set_selected(MouseActionsTab.ACTION_VALUES.indexOf(settings.mouseActions.rightClick));
    this.connect("notify::selected", () => {
      settings.mouseActions.rightClick = MouseActionsTab.ACTION_VALUES[this.get_selected()];
    });
  }
};
GObject24.registerClass(_RightClickRow);
var RightClickRow = _RightClickRow;

// src/ui/preferences/main-page/mouse-actions/components/hover-row.ts
import Adw25 from "gi://Adw";
import GObject25 from "gi://GObject";
var _HoverRow = class _HoverRow extends Adw25.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    this.set_selected(MouseActionsTab.ACTION_VALUES.indexOf(settings.mouseActions.hoverAction));
    this.connect("notify::selected", () => {
      settings.mouseActions.hoverAction = MouseActionsTab.ACTION_VALUES[this.get_selected()];
    });
    settings.mouseActions.connect("changed::action-hover", () => {
      this.set_selected(MouseActionsTab.ACTION_VALUES.indexOf(settings.mouseActions.hoverAction));
    });
  }
};
GObject25.registerClass(_HoverRow);
var HoverRow = _HoverRow;

// src/ui/preferences/main-page/mouse-actions/components/hover-delay-row.ts
import Adw26 from "gi://Adw";
import GObject26 from "gi://GObject";
import Gtk20 from "gi://Gtk";
var _HoverDelayRow = class _HoverDelayRow extends Adw26.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    var hoverDelayRow = new Adw26.SpinRow({
      adjustment: new Gtk20.Adjustment({ lower: 0, upper: 3e3, step_increment: 100 })
    });
    settings.mouseActions.bind("hoverDelay", hoverDelayRow, "value");
    this.add_suffix(hoverDelayRow);
  }
};
GObject26.registerClass(_HoverDelayRow);
var HoverDelayRow = _HoverDelayRow;

// src/ui/preferences/main-page/mouse-actions/index.ts
var _MouseActionsTab = class _MouseActionsTab extends Adw27.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const actionModel = new Gtk21.StringList({ strings: [
      t("None"),
      t("Play / Pause"),
      t("Next Track"),
      t("Previous Track"),
      t("Open Player App"),
      t("Open Menu"),
      t("Select Player"),
      t("Open Settings"),
      t("Close Player App")
    ] });
    const leftClickRow = new LeftClickRow(settings, {
      title: t("Left Click"),
      model: actionModel
    });
    this.add(leftClickRow);
    const doubleClickRow = new DoubleClickRow(settings, {
      title: t("Double Click"),
      model: actionModel
    });
    this.add(doubleClickRow);
    const midClickRow = new MidClickRow(settings, {
      title: t("Middle Click"),
      model: actionModel
    });
    this.add(midClickRow);
    const rightClickRow = new RightClickRow(settings, {
      title: t("Right Click"),
      model: actionModel
    });
    this.add(rightClickRow);
    const hoverRow = new HoverRow(settings, {
      title: t("Hover Action"),
      model: actionModel
    });
    this.add(hoverRow);
    const hoverDelayRow = new HoverDelayRow(settings, {
      title: t("Hover Delay (ms)")
    });
    this.add(hoverDelayRow);
  }
};
GObject27.registerClass(_MouseActionsTab);
__publicField(_MouseActionsTab, "ACTION_VALUES", ["none", "play_pause", "next", "previous", "open_app", "toggle_menu", "open_player_menu", "open_settings", "close_app"]);
var MouseActionsTab = _MouseActionsTab;

// src/ui/preferences/main-page/index.ts
var _MainPage = class _MainPage extends Adw28.PreferencesPage {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const generalTab = new GeneralTab(settings, {
      title: t("General Settings")
    });
    this.add(generalTab);
    const mouseActionsTab = new MouseActionsTab(settings, {
      title: t("Mouse Actions")
    });
    this.add(mouseActionsTab);
  }
};
GObject28.registerClass(_MainPage);
var MainPage = _MainPage;

// src/ui/preferences/popup-page/index.ts
import Adw56 from "gi://Adw";
import GObject56 from "gi://GObject";

// src/ui/preferences/popup-page/popup-appearance/index.ts
import Adw52 from "gi://Adw";
import GObject52 from "gi://GObject";

// src/ui/preferences/popup-page/popup-appearance/components/popup-rotate-row.ts
import Adw29 from "gi://Adw";
import GObject29 from "gi://GObject";
import Gtk22 from "gi://Gtk";
var _PopupRotateRow = class _PopupRotateRow extends Adw29.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const popRotateToggle = new Gtk22.Switch({
      active: settings.popup.vinylRotate,
      valign: Gtk22.Align.CENTER
    });
    settings.popup.bind("vinylRotate", popRotateToggle, "active");
    this.add_suffix(popRotateToggle);
  }
};
GObject29.registerClass(_PopupRotateRow);
var PopupRotateRow = _PopupRotateRow;

// src/ui/preferences/popup-page/popup-appearance/components/popup-rotate-speed-row.ts
import Adw30 from "gi://Adw";
import GObject30 from "gi://GObject";
import Gtk23 from "gi://Gtk";
var _PopupRotateSpeedRow = class _PopupRotateSpeedRow extends Adw30.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const popRotateSpeedRow = new Adw30.SpinRow({
      adjustment: new Gtk23.Adjustment({ lower: 1, upper: 50, step_increment: 1 })
    });
    settings.popup.bind("vinylSpeed", popRotateSpeedRow, "value");
    settings.popup.bind("vinylRotate", popRotateSpeedRow, "sensitive");
    this.add_suffix(popRotateSpeedRow);
  }
};
GObject30.registerClass(_PopupRotateSpeedRow);
var PopupRotateSpeedRow = _PopupRotateSpeedRow;

// src/ui/preferences/popup-page/popup-appearance/components/popup-shadow-row.ts
import Adw31 from "gi://Adw";
import GObject31 from "gi://GObject";
import Gtk24 from "gi://Gtk";
var _PopupShadowRow = class _PopupShadowRow extends Adw31.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const popShadowToggle = new Gtk24.Switch({
      active: settings.popup.enableShadow,
      valign: Gtk24.Align.CENTER
    });
    settings.popup.bind("enableShadow", popShadowToggle, "active");
    this.add_suffix(popShadowToggle);
  }
};
GObject31.registerClass(_PopupShadowRow);
var PopupShadowRow = _PopupShadowRow;

// src/ui/preferences/popup-page/popup-appearance/components/hide-on-leave-row.ts
import Adw32 from "gi://Adw";
import GObject32 from "gi://GObject";
import Gtk25 from "gi://Gtk";
var _HideOnLeaveRow = class _HideOnLeaveRow extends Adw32.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const hideOnLeaveToggle = new Gtk25.Switch({
      active: settings.popup.hideOnLeave,
      valign: Gtk25.Align.CENTER
    });
    settings.popup.bind("hideOnLeave", hideOnLeaveToggle, "active");
    this.add_suffix(hideOnLeaveToggle);
  }
};
GObject32.registerClass(_HideOnLeaveRow);
var HideOnLeaveRow = _HideOnLeaveRow;

// src/ui/preferences/popup-page/popup-appearance/components/custom-bg-row.ts
import Adw33 from "gi://Adw";
import GObject33 from "gi://GObject";
import Gtk26 from "gi://Gtk";
var _CustomBgRow = class _CustomBgRow extends Adw33.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const customBgToggle = new Gtk26.Switch({
      active: settings.popup.followCustomBg,
      valign: Gtk26.Align.CENTER
    });
    settings.popup.bind("followCustomBg", customBgToggle, "active");
    settings.popup.bind("useCustomColors", customBgToggle, "sensitive");
    this.add_suffix(customBgToggle);
  }
};
GObject33.registerClass(_CustomBgRow);
var CustomBgRow = _CustomBgRow;

// src/ui/preferences/popup-page/popup-appearance/components/custom-text-row.ts
import Adw34 from "gi://Adw";
import GObject34 from "gi://GObject";
import Gtk27 from "gi://Gtk";
var _CustomTextRow = class _CustomTextRow extends Adw34.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const customTextToggle = new Gtk27.Switch({
      active: settings.popup.followCustomText,
      valign: Gtk27.Align.CENTER
    });
    settings.popup.bind("followCustomText", customTextToggle, "active");
    settings.popup.bind("useCustomColors", customTextToggle, "sensitive");
    this.add_suffix(customTextToggle);
  }
};
GObject34.registerClass(_CustomTextRow);
var CustomTextRow = _CustomTextRow;

// src/ui/preferences/popup-page/popup-appearance/components/follow-transparency-row.ts
import Adw35 from "gi://Adw";
import GObject35 from "gi://GObject";
import Gtk28 from "gi://Gtk";
var _FollowTransparencyRow = class _FollowTransparencyRow extends Adw35.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const followTransparencyToggle = new Gtk28.Switch({
      active: settings.popup.followTransparency,
      valign: Gtk28.Align.CENTER
    });
    settings.popup.bind("followTransparency", followTransparencyToggle, "active");
    this.add_suffix(followTransparencyToggle);
  }
};
GObject35.registerClass(_FollowTransparencyRow);
var FollowTransparencyRow = _FollowTransparencyRow;

// src/ui/preferences/popup-page/popup-appearance/components/follow-border-radius-row.ts
import Adw36 from "gi://Adw";
import GObject36 from "gi://GObject";
import Gtk29 from "gi://Gtk";
var _FollowBorderRadiusRow = class _FollowBorderRadiusRow extends Adw36.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const followBorderRadiusToggle = new Gtk29.Switch({
      active: settings.popup.followBorderRadius,
      valign: Gtk29.Align.CENTER
    });
    settings.popup.bind("followBorderRadius", followBorderRadiusToggle, "active");
    this.add_suffix(followBorderRadiusToggle);
  }
};
GObject36.registerClass(_FollowBorderRadiusRow);
var FollowBorderRadiusRow = _FollowBorderRadiusRow;

// src/ui/preferences/popup-page/popup-appearance/components/square-vinyl-row.ts
import Adw37 from "gi://Adw";
import GObject37 from "gi://GObject";
import Gtk30 from "gi://Gtk";
var _SquareVinylRow = class _SquareVinylRow extends Adw37.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const squarteVinylToggle = new Gtk30.Switch({
      active: settings.popup.squareVinyl,
      valign: Gtk30.Align.CENTER
    });
    settings.popup.bind("squareVinyl", squarteVinylToggle, "active");
    this.add_suffix(squarteVinylToggle);
  }
};
GObject37.registerClass(_SquareVinylRow);
var SquareVinylRow = _SquareVinylRow;

// src/ui/preferences/popup-page/popup-appearance/components/show-vinyl-row.ts
import Adw38 from "gi://Adw";
import GObject38 from "gi://GObject";
import Gtk31 from "gi://Gtk";
var _ShowVinylRow = class _ShowVinylRow extends Adw38.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const showVinylToggle = new Gtk31.Switch({
      active: settings.popup.showVinyl,
      valign: Gtk31.Align.CENTER
    });
    settings.popup.bind("showVinyl", showVinylToggle, "active");
    this.add_suffix(showVinylToggle);
  }
};
GObject38.registerClass(_ShowVinylRow);
var ShowVinylRow = _ShowVinylRow;

// src/ui/preferences/popup-page/popup-appearance/components/show-shuffle-row.ts
import Adw39 from "gi://Adw";
import GObject39 from "gi://GObject";
import Gtk32 from "gi://Gtk";
var _ShowShuffleRow = class _ShowShuffleRow extends Adw39.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const showShuffleToggle = new Gtk32.Switch({
      active: settings.popup.showShuffle,
      valign: Gtk32.Align.CENTER
    });
    settings.popup.bind("showShuffle", showShuffleToggle, "active");
    this.add_suffix(showShuffleToggle);
  }
};
GObject39.registerClass(_ShowShuffleRow);
var ShowShuffleRow = _ShowShuffleRow;

// src/ui/preferences/popup-page/popup-appearance/components/custom-width-row.ts
import Adw40 from "gi://Adw";
import GObject40 from "gi://GObject";
import Gtk33 from "gi://Gtk";
var _CustomWidthRow = class _CustomWidthRow extends Adw40.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const customWidthToggle = new Gtk33.Switch({
      active: settings.popup.useCustomWidth,
      valign: Gtk33.Align.CENTER
    });
    settings.popup.bind("useCustomWidth", customWidthToggle, "active");
    this.add_suffix(customWidthToggle);
  }
};
GObject40.registerClass(_CustomWidthRow);
var CustomWidthRow = _CustomWidthRow;

// src/ui/preferences/popup-page/popup-appearance/components/custom-width-spin-row.ts
import Adw41 from "gi://Adw";
import GObject41 from "gi://GObject";
import Gtk34 from "gi://Gtk";
var _CustomWidthSpinRow = class _CustomWidthSpinRow extends Adw41.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const customWidthSpinRow = new Adw41.SpinRow({
      adjustment: new Gtk34.Adjustment({ lower: 260, upper: 800, step_increment: 10 })
    });
    settings.popup.bind("customWidth", customWidthSpinRow, "value");
    settings.popup.bind("useCustomWidth", customWidthSpinRow, "sensitive");
    const updateWidthBound = () => {
      let limit = settings.popup.showShuffle ? 360 : 260;
      customWidthSpinRow.adjustment.lower = limit;
      if (settings.popup.customWidth < limit) {
        settings.popup.customWidth = limit;
      }
    };
    settings.popup.connect("changed::show-shuffle-loop", updateWidthBound);
    updateWidthBound();
    this.add_suffix(customWidthSpinRow);
  }
};
GObject41.registerClass(_CustomWidthSpinRow);
var CustomWidthSpinRow = _CustomWidthSpinRow;

// src/ui/preferences/popup-page/popup-appearance/components/player-selector-row.ts
import Adw42 from "gi://Adw";
import GObject42 from "gi://GObject";
import Gtk35 from "gi://Gtk";
var _PlayerSelectorRow = class _PlayerSelectorRow extends Adw42.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const playerSelectorToggle = new Gtk35.Switch({
      active: settings.popup.showPlayerSelector,
      valign: Gtk35.Align.CENTER
    });
    settings.popup.bind("showPlayerSelector", playerSelectorToggle, "active");
    this.add_suffix(playerSelectorToggle);
  }
};
GObject42.registerClass(_PlayerSelectorRow);
var PlayerSelectorRow = _PlayerSelectorRow;

// src/ui/preferences/popup-page/popup-appearance/components/auto-hide-player-row.ts
import Adw43 from "gi://Adw";
import GObject43 from "gi://GObject";
import Gtk36 from "gi://Gtk";
var _AutoHidePlayerRow = class _AutoHidePlayerRow extends Adw43.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const autoHidePlayerToggle = new Gtk36.Switch({
      active: settings.popup.autoHidePlayer,
      valign: Gtk36.Align.CENTER
    });
    settings.popup.bind("autoHidePlayer", autoHidePlayerToggle, "active");
    this.add_suffix(autoHidePlayerToggle);
  }
};
GObject43.registerClass(_AutoHidePlayerRow);
var AutoHidePlayerRow = _AutoHidePlayerRow;

// src/ui/preferences/popup-page/popup-appearance/components/player-selection-position-row.ts
import Adw44 from "gi://Adw";
import GObject44 from "gi://GObject";
import Gtk37 from "gi://Gtk";
var _PlayerSelectionPositionRow = class _PlayerSelectionPositionRow extends Adw44.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const model = new Gtk37.StringList({ strings: [t("Top"), t("Bottom"), t("Left"), t("Right")] });
    this.set_model(model);
    this.set_selected(settings.popup.playerSelectorPosition);
    settings.popup.bind("playerSelectorPosition", this, "selected");
    settings.popup.connect("changed::player-selector-position", () => {
      this.set_selected(settings.popup.playerSelectorPosition);
    });
    this.connect("notify::selected", () => {
      settings.popup.playerSelectorPosition = this.get_selected();
    });
  }
};
GObject44.registerClass(_PlayerSelectionPositionRow);
var PlayerSelectionPositionRow = _PlayerSelectionPositionRow;

// src/ui/preferences/popup-page/popup-appearance/components/show-album-row.ts
import Adw45 from "gi://Adw";
import GObject45 from "gi://GObject";
import Gtk38 from "gi://Gtk";
var _ShowAlbumRow = class _ShowAlbumRow extends Adw45.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const showAlbumToggle = new Gtk38.Switch({
      active: settings.popup.showAlbumTitle,
      valign: Gtk38.Align.CENTER
    });
    settings.popup.bind("showAlbumTitle", showAlbumToggle, "active");
    this.add_suffix(showAlbumToggle);
  }
};
GObject45.registerClass(_ShowAlbumRow);
var ShowAlbumRow = _ShowAlbumRow;

// src/ui/preferences/popup-page/popup-appearance/components/hours-row.ts
import Adw46 from "gi://Adw";
import GObject46 from "gi://GObject";
import Gtk39 from "gi://Gtk";
var _HoursRow = class _HoursRow extends Adw46.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const hoursToggle = new Gtk39.Switch({
      active: settings.popup.showHoursFormat,
      valign: Gtk39.Align.CENTER
    });
    settings.popup.bind("showHoursFormat", hoursToggle, "active");
    this.add_suffix(hoursToggle);
  }
};
GObject46.registerClass(_HoursRow);
var HoursRow = _HoursRow;

// src/ui/preferences/popup-page/popup-appearance/components/show-visualizer-row.ts
import Adw47 from "gi://Adw";
import GObject47 from "gi://GObject";
import Gtk40 from "gi://Gtk";
var _ShowVisualizerRow = class _ShowVisualizerRow extends Adw47.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const showVisualizerToggle = new Gtk40.Switch({
      active: settings.popup.showVisualizer,
      valign: Gtk40.Align.CENTER
    });
    settings.popup.bind("showVisualizer", showVisualizerToggle, "active");
    this.add_suffix(showVisualizerToggle);
  }
};
GObject47.registerClass(_ShowVisualizerRow);
var ShowVisualizerRow = _ShowVisualizerRow;

// src/ui/preferences/popup-page/popup-appearance/components/hide-pill-visualizer-row.ts
import Adw48 from "gi://Adw";
import GObject48 from "gi://GObject";
import Gtk41 from "gi://Gtk";
var _HidePillVisualizerRow = class _HidePillVisualizerRow extends Adw48.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const hidePillVisualizerToggle = new Gtk41.Switch({
      active: settings.popup.hidePillVisualizer,
      valign: Gtk41.Align.CENTER
    });
    settings.popup.bind("hidePillVisualizer", hidePillVisualizerToggle, "active");
    this.add_suffix(hidePillVisualizerToggle);
    settings.popup.bind("showVisualizer", this, "sensitive");
  }
};
GObject48.registerClass(_HidePillVisualizerRow);
var HidePillVisualizerRow = _HidePillVisualizerRow;

// src/ui/preferences/popup-page/popup-appearance/components/visualizer-bar-count.ts
import Adw49 from "gi://Adw";
import GObject49 from "gi://GObject";
import Gtk42 from "gi://Gtk";
var _VisualizerBarCountRow = class _VisualizerBarCountRow extends Adw49.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const popupVisualizerBarsRow = new Adw49.SpinRow({
      adjustment: new Gtk42.Adjustment({ lower: 2, upper: 64, step_increment: 1 })
    });
    settings.popup.bind("popupVisualizerBars", popupVisualizerBarsRow, "value");
    settings.popup.bind("showVisualizer", popupVisualizerBarsRow, "sensitive");
    this.add_suffix(popupVisualizerBarsRow);
  }
};
GObject49.registerClass(_VisualizerBarCountRow);
var VisualizerBarCountRow = _VisualizerBarCountRow;

// src/ui/preferences/popup-page/popup-appearance/components/visualizer-bar-width.ts
import Adw50 from "gi://Adw";
import GObject50 from "gi://GObject";
import Gtk43 from "gi://Gtk";
var _VisualizerBarWidthRow = class _VisualizerBarWidthRow extends Adw50.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const popupVisualizerBarWidthRow = new Adw50.SpinRow({
      adjustment: new Gtk43.Adjustment({ lower: 1, upper: 20, step_increment: 1 })
    });
    settings.popup.bind("popupVisualizerBarWidth", popupVisualizerBarWidthRow, "value");
    settings.popup.bind("showVisualizer", popupVisualizerBarWidthRow, "sensitive");
    this.add_suffix(popupVisualizerBarWidthRow);
  }
};
GObject50.registerClass(_VisualizerBarWidthRow);
var VisualizerBarWidthRow = _VisualizerBarWidthRow;

// src/ui/preferences/popup-page/popup-appearance/components/visualizer-bar-height.ts
import Adw51 from "gi://Adw";
import GObject51 from "gi://GObject";
import Gtk44 from "gi://Gtk";
var _VisualizerBarHeightRow = class _VisualizerBarHeightRow extends Adw51.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const popupVisualizerHeightRow = new Adw51.SpinRow({
      adjustment: new Gtk44.Adjustment({ lower: 20, upper: 200, step_increment: 5 })
    });
    settings.popup.bind("popupVisualizerHeight", popupVisualizerHeightRow, "value");
    settings.popup.bind("showVisualizer", popupVisualizerHeightRow, "sensitive");
    this.add_suffix(popupVisualizerHeightRow);
  }
};
GObject51.registerClass(_VisualizerBarHeightRow);
var VisualizerBarHeightRow = _VisualizerBarHeightRow;

// src/ui/preferences/popup-page/popup-appearance/index.ts
var _PopupAppearance = class _PopupAppearance extends Adw52.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const popRotateRow = new PopupRotateRow(settings, {
      title: t("Rotate Vinyl"),
      subtitle: t("Spin the album art when playing")
    });
    this.add(popRotateRow);
    const popRotateSpeedRow = new PopupRotateSpeedRow(settings, {
      title: t("Rotation Speed"),
      subtitle: t("Adjust the vinyl spin speed (Lower is slower, Default: 10)")
    });
    this.add(popRotateSpeedRow);
    const popShadowRow = new PopupShadowRow(settings, {
      title: t("Enable Shadow"),
      subtitle: t("Show drop shadow behind the pop-up menu")
    });
    this.add(popShadowRow);
    const hideOnLeaveRow = new HideOnLeaveRow(settings, {
      title: t("Close on Mouse Leave"),
      subtitle: t("Automatically hide the pop-up when you move the cursor away")
    });
    this.add(hideOnLeaveRow);
    const customBgRow = new CustomBgRow(settings, {
      title: t("Follow Custom Background Color"),
      subtitle: t("Use the custom background color for the pop-up (if active)")
    });
    this.add(customBgRow);
    const customTextRow = new CustomTextRow(settings, {
      title: t("Follow Custom Text Color"),
      subtitle: t("Use the custom text color for the pop-up (if active)")
    });
    this.add(customTextRow);
    const followTransparencyRow = new FollowTransparencyRow(settings, {
      title: t("Follow Transparency"),
      subtitle: t("Inherit opacity settings from the main pill")
    });
    this.add(followTransparencyRow);
    const followBorderRadiusRow = new FollowBorderRadiusRow(settings, {
      title: t("Follow Border Radius"),
      subtitle: t("Inherit corner roundness from the main pill")
    });
    this.add(followBorderRadiusRow);
    const showVinylRow = new ShowVinylRow(settings, {
      title: t("Show Vinyl"),
      subtitle: t("Display the album art in the pop-up")
    });
    this.add(showVinylRow);
    const squareVinylRow = new SquareVinylRow(settings, {
      title: t("Square Vinyl Image"),
      subtitle: t("Use a square album art (disables rotation)")
    });
    this.add(squareVinylRow);
    const showShuffleRow = new ShowShuffleRow(settings, {
      title: t("Show Shuffle and Loop"),
      subtitle: t("Display extra controls in the pop-up")
    });
    this.add(showShuffleRow);
    const customWidthRow = new CustomWidthRow(settings, {
      title: t("Use Custom Width"),
      subtitle: t("Disable dynamic sizing for the pop-up")
    });
    this.add(customWidthRow);
    const customWidthSpinRow = new CustomWidthSpinRow(settings, {
      title: t("Custom Width Value"),
      subtitle: t("Set the custom width for the pop-up")
    });
    this.add(customWidthSpinRow);
    const playerSelectorRow = new PlayerSelectorRow(settings, {
      title: t("Show Player Selector"),
      subtitle: t("Display active player icons in the pop-up")
    });
    this.add(playerSelectorRow);
    const autoHidePlayerRow = new AutoHidePlayerRow(settings, {
      title: t("Hide Auto (Smart Selection)"),
      subtitle: t("Remove the automatic player selection entry from the player selector menu")
    });
    this.add(autoHidePlayerRow);
    const playerSelectionPositionRow = new PlayerSelectionPositionRow(settings, {
      title: t("Player Selector Position"),
      subtitle: t("Where to place the player icons inside the pop-up")
    });
    this.add(playerSelectionPositionRow);
    const showAlbumRow = new ShowAlbumRow(settings, {
      title: t("Show Album Title"),
      subtitle: t("Display album name next to the artist (Artist \u2022 Album)")
    });
    this.add(showAlbumRow);
    const hoursRow = new HoursRow(settings, {
      title: t("Show HH:MM:SS"),
      subtitle: t("Display hours in the time labels when media is longer than 60 minutes")
    });
    this.add(hoursRow);
    const showVisualizerRow = new ShowVisualizerRow(settings, {
      title: t("Show Visualizer in Pop-up"),
      subtitle: t("Display the visualizer in the pop-up")
    });
    this.add(showVisualizerRow);
    const hidePillVisualizerRow = new HidePillVisualizerRow(settings, {
      title: t("Hide Pill Visualizer"),
      subtitle: t('Creates a "moving" effect by hiding the main pill visualizer')
    });
    this.add(hidePillVisualizerRow);
    const visualizerBarCountRow = new VisualizerBarCountRow(settings, {
      title: t("Popup Visualizer Bar Count")
    });
    this.add(visualizerBarCountRow);
    const visualizerBarWidthRow = new VisualizerBarWidthRow(settings, {
      title: t("Popup Visualizer Bar Width")
    });
    this.add(visualizerBarWidthRow);
    const visualizerBarHeightRow = new VisualizerBarHeightRow(settings, {
      title: t("Popup Visualizer Height")
    });
    this.add(visualizerBarHeightRow);
  }
};
GObject52.registerClass(_PopupAppearance);
var PopupAppearance = _PopupAppearance;

// src/ui/preferences/popup-page/custom-controls/index.ts
import Adw55 from "gi://Adw";
import GObject55 from "gi://GObject";
import Gtk46 from "gi://Gtk";

// src/ui/preferences/popup-page/custom-controls/components/enable-buttons-row.ts
import Adw53 from "gi://Adw";
import GObject53 from "gi://GObject";
import Gtk45 from "gi://Gtk";
var _EnableButtonsRow = class _EnableButtonsRow extends Adw53.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const enableButtonsToggle = new Gtk45.Switch({
      active: settings.popup.enableCustomButtons,
      valign: Gtk45.Align.CENTER
    });
    settings.popup.bind("enableCustomButtons", enableButtonsToggle, "active");
    this.add_suffix(enableButtonsToggle);
  }
};
GObject53.registerClass(_EnableButtonsRow);
var EnableButtonsRow = _EnableButtonsRow;

// src/ui/preferences/popup-page/custom-controls/components/button-action-row.ts
import Adw54 from "gi://Adw";
import GObject54 from "gi://GObject";
var _ButtonActionRow = class _ButtonActionRow extends Adw54.ComboRow {
  constructor(title, subtitle, settingsKey, settings, properties, ...args) {
    super(properties, args);
    const currentValue = settings.popup[settingsKey];
    const currentIndex = CustomControls.ACTION_VALUES.indexOf(currentValue);
    this.set_title(title);
    this.set_subtitle(subtitle);
    this.set_selected(currentIndex);
    settings.popup.connect(`changed::${settingsKey}`, () => {
      const currentValue2 = settings.popup[settingsKey];
      const currentIndex2 = CustomControls.ACTION_VALUES.indexOf(currentValue2);
      this.set_selected(currentIndex2);
    });
    this.connect("notify::selected", () => {
      settings.popup[settingsKey] = CustomControls.ACTION_VALUES[this.selected];
    });
    settings.popup.bind("enableCustomButtons", this, "sensitive");
  }
};
GObject54.registerClass(_ButtonActionRow);
var ButtonActionRow = _ButtonActionRow;

// src/ui/preferences/popup-page/custom-controls/index.ts
var _CustomControls = class _CustomControls extends Adw55.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const buttonActionModel = new Gtk46.StringList({ strings: [
      t("None"),
      t("Volume Control"),
      t("Seek \xB110 Seconds"),
      t("Audio Output Switcher"),
      t("Sleep Timer"),
      t("Playback Speed"),
      t("Track History")
    ] });
    const enableButtonsRow = new EnableButtonsRow(settings, {
      title: t("Enable Custom Buttons"),
      subtitle: t("Show additional action buttons next to Shuffle and Loop")
    });
    this.add(enableButtonsRow);
    this.set_description(t("If both buttons are set to Seek, they act directly (Button 1 = \u221210s, Button 2 = +10s). Otherwise Seek opens a sub-page."));
    const buttonActionRow = new ButtonActionRow(t("Custom Button 1"), t("Placed left of Shuffle."), "customButton1", settings, {
      model: buttonActionModel
    });
    this.add(buttonActionRow);
    const buttonActionRow2 = new ButtonActionRow(t("Custom Button 2"), t("Placed right of Loop."), "customButton2", settings, {
      model: buttonActionModel
    });
    this.add(buttonActionRow2);
  }
};
GObject55.registerClass(_CustomControls);
__publicField(_CustomControls, "ACTION_VALUES", ["none", "volume", "seek_step", "output_switch", "sleep_timer", "playback_speed", "history"]);
var CustomControls = _CustomControls;

// src/ui/preferences/popup-page/index.ts
var _PopupPage = class _PopupPage extends Adw56.PreferencesPage {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const appearanceTab = new PopupAppearance(settings, {
      title: t("Pop-up Appearance")
    });
    this.add(appearanceTab);
    const customControlsTab = new CustomControls(settings, {
      title: t("Custom Control Buttons"),
      description: t("Add up to two extra buttons in the expanded player's controls row.")
    });
    this.add(customControlsTab);
  }
};
GObject56.registerClass(_PopupPage);
var PopupPage = _PopupPage;

// src/ui/preferences/style-page/index.ts
import Adw82 from "gi://Adw";
import GObject82 from "gi://GObject";

// src/ui/preferences/style-page/look-group/index.ts
import Adw65 from "gi://Adw";
import GObject65 from "gi://GObject";
import Gtk55 from "gi://Gtk";

// src/ui/preferences/style-page/look-group/components/visualizer-animation-row.ts
import Adw57 from "gi://Adw";
import GObject57 from "gi://GObject";
import Gtk47 from "gi://Gtk";
var _VisualizerAnimationRow = class _VisualizerAnimationRow extends Adw57.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const visualizerAnimationModel = new Gtk47.StringList({ strings: [
      t("Off (Disabled)"),
      t("Wave (Smooth)"),
      t("Beat (Jumpy)"),
      t("Real-Time (Cava needed)")
    ] });
    this.set_model(visualizerAnimationModel);
    this.set_selected(settings.style.visualizerAnimation);
    this.connect("notify::selected", () => {
      settings.style.visualizerAnimation = this.selected;
    });
  }
};
GObject57.registerClass(_VisualizerAnimationRow);
var VisualizerAnimationRow = _VisualizerAnimationRow;

// src/ui/preferences/style-page/look-group/components/visualizer-bar-count-row.ts
import Adw58 from "gi://Adw";
import GObject58 from "gi://GObject";
import Gtk48 from "gi://Gtk";
var _VisualizeBarCountRow = class _VisualizeBarCountRow extends Adw58.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const visualizerBarRow = new Adw58.SpinRow({
      adjustment: new Gtk48.Adjustment({ lower: 2, upper: 32, step_increment: 1 })
    });
    this.add_suffix(visualizerBarRow);
    visualizerBarRow.value = settings.style.visualizerBarCount;
    visualizerBarRow.connect("notify::selected", () => {
      settings.style.visualizerBarCount = visualizerBarRow.value;
    });
  }
};
GObject58.registerClass(_VisualizeBarCountRow);
var VisualizeBarCountRow = _VisualizeBarCountRow;

// src/ui/preferences/style-page/look-group/components/visualizer-bar-width-row.ts
import Adw59 from "gi://Adw";
import GObject59 from "gi://GObject";
import Gtk49 from "gi://Gtk";
var _VisualizeBarWidthRow = class _VisualizeBarWidthRow extends Adw59.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const visualizerBarWidthRow = new Adw59.SpinRow({
      adjustment: new Gtk49.Adjustment({ lower: 1, upper: 10, step_increment: 1 })
    });
    settings.style.bind("visualizerBarWidth", visualizerBarWidthRow, "value");
    this.add_suffix(visualizerBarWidthRow);
  }
};
GObject59.registerClass(_VisualizeBarWidthRow);
var VisualizeBarWidthRow = _VisualizeBarWidthRow;

// src/ui/preferences/style-page/look-group/components/visualizer-bar-height-row.ts
import Adw60 from "gi://Adw";
import GObject60 from "gi://GObject";
import Gtk50 from "gi://Gtk";
var _VisualizerBarHeightRow2 = class _VisualizerBarHeightRow2 extends Adw60.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const visualizerBarHeightRow = new Adw60.SpinRow({
      adjustment: new Gtk50.Adjustment({ lower: 10, upper: 100, step_increment: 2 })
    });
    settings.style.bind("visualizerHeight", visualizerBarHeightRow, "value");
    this.add_suffix(visualizerBarHeightRow);
  }
};
GObject60.registerClass(_VisualizerBarHeightRow2);
var VisualizerBarHeightRow2 = _VisualizerBarHeightRow2;

// src/ui/preferences/style-page/look-group/components/visualizer-margin-row.ts
import Adw61 from "gi://Adw";
import Gtk51 from "gi://Gtk";
import GObject61 from "gi://GObject";
var _VisualizerMarginRow = class _VisualizerMarginRow extends Adw61.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const visualizerMarginRow = new Adw61.SpinRow({
      adjustment: new Gtk51.Adjustment({ lower: 0, upper: 50, step_increment: 1 })
    });
    settings.style.bind("visualizerMargin", visualizerMarginRow, "value");
    this.add_suffix(visualizerMarginRow);
  }
};
GObject61.registerClass(_VisualizerMarginRow);
var VisualizerMarginRow = _VisualizerMarginRow;

// src/ui/preferences/style-page/look-group/components/outer-edge-margin-row.ts
import Adw62 from "gi://Adw";
import Gtk52 from "gi://Gtk";
import GObject62 from "gi://GObject";
var _OuterEdgeMarginRow = class _OuterEdgeMarginRow extends Adw62.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const outerEdgeMarginRow = new Adw62.SpinRow({
      adjustment: new Gtk52.Adjustment({ lower: 0, upper: 50, step_increment: 1 })
    });
    settings.style.bind("outerEdgeMargin", outerEdgeMarginRow, "value");
    this.add_suffix(outerEdgeMarginRow);
  }
};
GObject62.registerClass(_OuterEdgeMarginRow);
var OuterEdgeMarginRow = _OuterEdgeMarginRow;

// src/ui/preferences/style-page/look-group/components/corder-radius-row.ts
import Adw63 from "gi://Adw";
import Gtk53 from "gi://Gtk";
import GObject63 from "gi://GObject";
var _CorderRadiusRow = class _CorderRadiusRow extends Adw63.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const corderRadiusRow = new Adw63.SpinRow({
      adjustment: new Gtk53.Adjustment({ lower: 0, upper: 50, step_increment: 1 })
    });
    settings.style.bind("corderRadius", corderRadiusRow, "value");
    this.add_suffix(corderRadiusRow);
  }
};
GObject63.registerClass(_CorderRadiusRow);
var CorderRadiusRow = _CorderRadiusRow;

// src/ui/preferences/style-page/look-group/components/pill-outline-row.ts
import Adw64 from "gi://Adw";
import Gtk54 from "gi://Gtk";
import GObject64 from "gi://GObject";
var _PillOutlineRow = class _PillOutlineRow extends Adw64.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const pillOutlineRow = new Gtk54.Switch({
      active: settings.style.showPillOutline,
      valign: Gtk54.Align.CENTER
    });
    settings.style.bind("showPillOutline", pillOutlineRow, "active");
    this.add_suffix(pillOutlineRow);
  }
};
GObject64.registerClass(_PillOutlineRow);
var PillOutlineRow = _PillOutlineRow;

// src/ui/preferences/style-page/look-group/index.ts
var _LookGroup = class _LookGroup extends Adw65.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const visualizerAnimationRow = new VisualizerAnimationRow(settings, {
      title: t("Visualizer Animation"),
      subtitle: t("Select the style of the audio reaction bars")
    });
    this.add(visualizerAnimationRow);
    const cavaNote = new Gtk55.Label({
      label: t("Note: 'Real-Time' mode requires the 'cava' package to be installed on your Linux system."),
      wrap: true,
      xalign: 0,
      css_classes: ["dim-label"],
      margin_top: 6,
      margin_bottom: 6,
      margin_start: 12,
      margin_end: 12
    });
    this.add(cavaNote);
    const visualizeBarCountRow = new VisualizeBarCountRow(settings, {
      title: t("Visualizer Bar Count"),
      subtitle: t("Number of bars displayed in the animation")
    });
    this.add(visualizeBarCountRow);
    const visualizeBarWidthRow = new VisualizeBarWidthRow(settings, {
      title: t("Visualizer Bar Width"),
      subtitle: t("Thickness of individual bars (pixels)")
    });
    this.add(visualizeBarWidthRow);
    const visualizeBarHeightRow = new VisualizerBarHeightRow2(settings, {
      title: t("Visualizer Height"),
      subtitle: t("Maximum height of the visualizer (auto-clamped to pill height)")
    });
    this.add(visualizeBarHeightRow);
    const visualizerMarginRow = new VisualizerMarginRow(settings, {
      title: t("Visualizer Margin"),
      subtitle: t("Distance between the text and the visualizer animation")
    });
    this.add(visualizerMarginRow);
    const outerEdgeMarginRow = new OuterEdgeMarginRow(settings, {
      title: t("Outer Edge Margin"),
      subtitle: t("Spacing before the album art and after the visualizer")
    });
    this.add(outerEdgeMarginRow);
    const corderRadiusRow = new CorderRadiusRow(settings, {
      title: t("Corner Radius"),
      subtitle: t("Roundness of the widget edges (0 = Square, 25 = Pill)")
    });
    this.add(corderRadiusRow);
    const pillOutlineRow = new PillOutlineRow(settings, {
      title: t("Show Pill Outline"),
      subtitle: t("Display a subtle border around the main pill")
    });
    this.add(pillOutlineRow);
  }
};
GObject65.registerClass(_LookGroup);
var LookGroup = _LookGroup;

// src/ui/preferences/style-page/background-transparency/index.ts
import Adw72 from "gi://Adw";
import GObject72 from "gi://GObject";

// src/ui/preferences/style-page/background-transparency/components/enable-transparency-row.ts
import Adw66 from "gi://Adw";
import Gtk56 from "gi://Gtk";
import GObject66 from "gi://GObject";
var _EnableTransparencyRow = class _EnableTransparencyRow extends Adw66.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const enableTransparencyRow = new Gtk56.Switch({
      active: settings.style.enableTransparency,
      valign: Gtk56.Align.CENTER
    });
    settings.style.bind("enableTransparency", enableTransparencyRow, "active");
    this.add_suffix(enableTransparencyRow);
  }
};
GObject66.registerClass(_EnableTransparencyRow);
var EnableTransparencyRow = _EnableTransparencyRow;

// src/ui/preferences/style-page/background-transparency/components/art-transparency-row.ts
import Adw67 from "gi://Adw";
import Gtk57 from "gi://Gtk";
import GObject67 from "gi://GObject";
var _ArtTransparencyRow = class _ArtTransparencyRow extends Adw67.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const artTransparencyRow = new Gtk57.Switch({
      active: settings.style.artTransparency,
      valign: Gtk57.Align.CENTER
    });
    settings.style.bind("artTransparency", artTransparencyRow, "active");
    settings.style.bind("enableTransparency", this, "sensitive");
    this.add_suffix(artTransparencyRow);
  }
};
GObject67.registerClass(_ArtTransparencyRow);
var ArtTransparencyRow = _ArtTransparencyRow;

// src/ui/preferences/style-page/background-transparency/components/background-opacity-row.ts
import Adw68 from "gi://Adw";
import Gtk58 from "gi://Gtk";
import GObject68 from "gi://GObject";
var _BackgroundOpacityRow = class _BackgroundOpacityRow extends Adw68.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const backgroundOpacityRow = new Adw68.SpinRow({
      adjustment: new Gtk58.Adjustment({ lower: 0, upper: 100, step_increment: 5 })
    });
    settings.style.bind("transparencyStrength", backgroundOpacityRow, "value");
    settings.style.bind("enableTransparency", this, "sensitive");
    this.add_suffix(backgroundOpacityRow);
  }
};
GObject68.registerClass(_BackgroundOpacityRow);
var BackgroundOpacityRow = _BackgroundOpacityRow;

// src/ui/preferences/style-page/background-transparency/components/main-pill-shadow-row.ts
import Adw69 from "gi://Adw";
import Gtk59 from "gi://Gtk";
import GObject69 from "gi://GObject";
var _MainPillShadowRow = class _MainPillShadowRow extends Adw69.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const mainPillShadowRow = new Gtk59.Switch({
      active: settings.pill.enableShadow,
      valign: Gtk59.Align.CENTER
    });
    settings.pill.bind("enableShadow", mainPillShadowRow, "active");
    this.add_suffix(mainPillShadowRow);
  }
};
GObject69.registerClass(_MainPillShadowRow);
var MainPillShadowRow = _MainPillShadowRow;

// src/ui/preferences/style-page/background-transparency/components/text-transparency-row.ts
import Adw70 from "gi://Adw";
import Gtk60 from "gi://Gtk";
import GObject70 from "gi://GObject";
var _TextTransparencyRow = class _TextTransparencyRow extends Adw70.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const textTransparencyRow = new Gtk60.Switch({
      active: settings.style.textTransparency,
      valign: Gtk60.Align.CENTER
    });
    settings.style.bind("textTransparency", textTransparencyRow, "active");
    settings.style.bind("enableTransparency", this, "sensitive");
    this.add_suffix(textTransparencyRow);
  }
};
GObject70.registerClass(_TextTransparencyRow);
var TextTransparencyRow = _TextTransparencyRow;

// src/ui/preferences/style-page/background-transparency/components/visualizer-transparency-row.ts
import Adw71 from "gi://Adw";
import Gtk61 from "gi://Gtk";
import GObject71 from "gi://GObject";
var _VisualizerTransparencyRow = class _VisualizerTransparencyRow extends Adw71.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const visualizerTransparencyRow = new Gtk61.Switch({
      active: settings.style.visualizerTransparency,
      valign: Gtk61.Align.CENTER
    });
    settings.style.bind("visualizerTransparency", visualizerTransparencyRow, "active");
    settings.style.bind("enableTransparency", this, "sensitive");
    this.add_suffix(visualizerTransparencyRow);
  }
};
GObject71.registerClass(_VisualizerTransparencyRow);
var VisualizerTransparencyRow = _VisualizerTransparencyRow;

// src/ui/preferences/style-page/background-transparency/index.ts
var _BackgroundTransparencyGroup = class _BackgroundTransparencyGroup extends Adw72.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const enableTransparencyRow = new EnableTransparencyRow(settings, {
      title: t("Enable Transparency"),
      subtitle: t("Switch between a solid theme background and a custom transparent look")
    });
    this.add(enableTransparencyRow);
    const backgroundOpacityRow = new BackgroundOpacityRow(settings, {
      title: t("Background Opacity"),
      subtitle: t("Adjust transparency level")
    });
    this.add(backgroundOpacityRow);
    const artTransparencyRow = new ArtTransparencyRow(settings, {
      title: t("Apply to Album Art")
    });
    this.add(artTransparencyRow);
    const textTransparencyRow = new TextTransparencyRow(settings, {
      title: t("Apply to Text")
    });
    this.add(textTransparencyRow);
    const visualizerTransparencyRow = new VisualizerTransparencyRow(settings, {
      title: t("Apply to Visualizer")
    });
    this.add(visualizerTransparencyRow);
    const mainPillShadowRow = new MainPillShadowRow(settings, {
      title: t("Main Pill Shadow")
    });
    this.add(mainPillShadowRow);
  }
};
GObject72.registerClass(_BackgroundTransparencyGroup);
var BackgroundTransparencyGroup = _BackgroundTransparencyGroup;

// src/ui/preferences/style-page/shadow-group/index.ts
import Adw76 from "gi://Adw";
import GObject76 from "gi://GObject";

// src/ui/preferences/style-page/shadow-group/components/enable-shadow-row.ts
import Adw73 from "gi://Adw";
import Gtk62 from "gi://Gtk";
import GObject73 from "gi://GObject";
var _EnableShadowRow = class _EnableShadowRow extends Adw73.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const enableShadowRow = new Gtk62.Switch({
      active: settings.pill.enableShadow,
      valign: Gtk62.Align.CENTER
    });
    settings.pill.bind("enableShadow", enableShadowRow, "active");
    this.add_suffix(enableShadowRow);
  }
};
GObject73.registerClass(_EnableShadowRow);
var EnableShadowRow = _EnableShadowRow;

// src/ui/preferences/style-page/shadow-group/components/shadow-intensity-row.ts
import Adw74 from "gi://Adw";
import Gtk63 from "gi://Gtk";
import GObject74 from "gi://GObject";
var _ShadowIntensityRow = class _ShadowIntensityRow extends Adw74.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const shadowIntensityRow = new Adw74.SpinRow({
      adjustment: new Gtk63.Adjustment({ lower: 0, upper: 100, step_increment: 5 })
    });
    settings.pill.bind("shadowOpacity", shadowIntensityRow, "value");
    this.add_suffix(shadowIntensityRow);
  }
};
GObject74.registerClass(_ShadowIntensityRow);
var ShadowIntensityRow = _ShadowIntensityRow;

// src/ui/preferences/style-page/shadow-group/components/shadow-blur-row.ts
import Adw75 from "gi://Adw";
import Gtk64 from "gi://Gtk";
import GObject75 from "gi://GObject";
var _ShadowBlurRow = class _ShadowBlurRow extends Adw75.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const shadowBlurRow = new Adw75.SpinRow({
      adjustment: new Gtk64.Adjustment({ lower: 0, upper: 50, step_increment: 1 })
    });
    settings.pill.bind("shadowBlur", shadowBlurRow, "value");
    this.add_suffix(shadowBlurRow);
  }
};
GObject75.registerClass(_ShadowBlurRow);
var ShadowBlurRow = _ShadowBlurRow;

// src/ui/preferences/style-page/shadow-group/index.ts
var _ShadowGroup = class _ShadowGroup extends Adw76.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const enableShadowRow = new EnableShadowRow(settings, {
      title: t("Enable Shadow")
    });
    this.add(enableShadowRow);
    const shadowIntensityRow = new ShadowIntensityRow(settings, {
      title: t("Shadow Intensity")
    });
    this.add(shadowIntensityRow);
    const shadowBlurRow = new ShadowBlurRow(settings, {
      title: t("Shadow Blur")
    });
    this.add(shadowBlurRow);
  }
};
GObject76.registerClass(_ShadowGroup);
var ShadowGroup = _ShadowGroup;

// src/ui/preferences/style-page/positioning-group/index.ts
import Adw81 from "gi://Adw";
import GObject81 from "gi://GObject";

// src/ui/preferences/style-page/positioning-group/components/container-target-row.ts
import Adw77 from "gi://Adw";
import Gtk65 from "gi://Gtk";
import GObject77 from "gi://GObject";
var _ContainerTargetRow = class _ContainerTargetRow extends Adw77.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const targetModel = new Gtk65.StringList();
    targetModel.append(t("Dock"));
    targetModel.append(t("Panel: Left Box"));
    targetModel.append(t("Panel: Center Box"));
    targetModel.append(t("Panel: Right Box"));
    this.set_model(targetModel);
    this.set_selected(settings.style.targetContainer);
    this.connect("notify::selected", () => {
      settings.style.targetContainer = this.selected;
    });
    settings.style.connect("changed::target-container", () => {
      this.set_selected(settings.style.targetContainer);
    });
  }
};
GObject77.registerClass(_ContainerTargetRow);
var ContainerTargetRow = _ContainerTargetRow;

// src/ui/preferences/style-page/positioning-group/components/dynamic-width-row.ts
import Adw78 from "gi://Adw";
import Gtk66 from "gi://Gtk";
import GObject78 from "gi://GObject";
var _DynamicWidthRow = class _DynamicWidthRow extends Adw78.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const dynamicWidthRow = new Gtk66.Switch({
      active: settings.pill.dynamicWidth,
      valign: Gtk66.Align.CENTER
    });
    settings.pill.bind("dynamicWidth", dynamicWidthRow, "active");
    this.add_suffix(dynamicWidthRow);
  }
};
GObject78.registerClass(_DynamicWidthRow);
var DynamicWidthRow = _DynamicWidthRow;

// src/ui/preferences/style-page/positioning-group/components/alignment-preset-row.ts
import Adw79 from "gi://Adw";
import Gtk67 from "gi://Gtk";
import GObject79 from "gi://GObject";
var _AlignmentPresetRow = class _AlignmentPresetRow extends Adw79.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const alignmentPresetRow = new Gtk67.StringList();
    alignmentPresetRow.append(t("Manual Index"));
    alignmentPresetRow.append(t("First (Start)"));
    alignmentPresetRow.append(t("Center"));
    alignmentPresetRow.append(t("Last (End)"));
    this.set_model(alignmentPresetRow);
    this.set_selected(settings.pill.alignmentPreset);
    this.connect("notify::selected", () => {
      settings.pill.alignmentPreset = this.selected;
    });
  }
};
GObject79.registerClass(_AlignmentPresetRow);
var AlignmentPresetRow = _AlignmentPresetRow;

// src/ui/preferences/style-page/positioning-group/components/manual-index-row.ts
import Adw80 from "gi://Adw";
import Gtk68 from "gi://Gtk";
import GObject80 from "gi://GObject";
var _ManualIndexRow = class _ManualIndexRow extends Adw80.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const manualIndexRow = new Adw80.SpinRow({ adjustment: new Gtk68.Adjustment({ lower: 0, upper: 20, step_increment: 1 }) });
    settings.pill.bind("manualIndex", manualIndexRow, "value");
    this.add_suffix(manualIndexRow);
  }
};
GObject80.registerClass(_ManualIndexRow);
var ManualIndexRow = _ManualIndexRow;

// src/ui/preferences/style-page/positioning-group/index.ts
var _PositioningGroup = class _PositioningGroup extends Adw81.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const positioningRow = new ContainerTargetRow(settings, {
      title: t("Container Target"),
      subtitle: t("Select which UI element should host the music pill")
    });
    this.add(positioningRow);
    const dynamicWidthRow = new DynamicWidthRow(settings, {
      title: t("Dynamic Width"),
      subtitle: t("Auto-adjust pill width (slider acts as max width)")
    });
    this.add(dynamicWidthRow);
    const alignmentPresetRow = new AlignmentPresetRow(settings, {
      title: t("Alignment Preset"),
      subtitle: t("How the widget aligns relative to other items")
    });
    this.add(alignmentPresetRow);
    const manualIndexRow = new ManualIndexRow(settings, {
      title: t("Manual Index Position"),
      subtitle: t("Order in the list (0 is first). Only for Manual mode.")
    });
    this.add(manualIndexRow);
  }
};
GObject81.registerClass(_PositioningGroup);
var PositioningGroup = _PositioningGroup;

// src/ui/preferences/style-page/index.ts
var _StylePage = class _StylePage extends Adw82.PreferencesPage {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const lookGroup = new LookGroup(settings, {
      title: t("Visualizer and Shape")
    });
    this.add(lookGroup);
    const backgroundTransparencyGroup = new BackgroundTransparencyGroup(settings, {
      title: t("Background and Transparency")
    });
    this.add(backgroundTransparencyGroup);
    const shadowGroup = new ShadowGroup(settings, {
      title: t("Main Pill Shadow")
    });
    this.add(shadowGroup);
    const positioningGroup = new PositioningGroup(settings, {
      title: t("Positioning")
    });
    this.add(positioningGroup);
  }
};
GObject82.registerClass(_StylePage);
var StylePage = _StylePage;

// src/providers/settings-provider/utils.ts
import Gio2 from "gi://Gio";
function createSettingsMap(map8) {
  return map8;
}
function createSettingsGroup(settings, map8) {
  const methods = {
    bind(prop, object, property, flags = Gio2.SettingsBindFlags.DEFAULT) {
      settings.bind(
        map8[prop].key,
        object,
        property,
        flags
      );
    },
    connect(signal, callback) {
      return settings.connect(signal, callback);
    }
  };
  return new Proxy(methods, {
    get(target, prop) {
      if (prop in target)
        return target[prop];
      const entry = map8[prop];
      const type = typeof entry.default;
      switch (type) {
        case "boolean":
          return settings.get_boolean(entry.key);
        case "number":
          return settings.get_int(entry.key);
        case "string":
          return settings.get_string(entry.key);
      }
    },
    set(_2, prop, value) {
      const entry = map8[prop];
      const type = typeof entry.default;
      switch (type) {
        case "boolean":
          settings.set_boolean(entry.key, value);
          return true;
        case "number":
          settings.set_int(entry.key, value);
          return true;
        case "string":
          settings.set_string(entry.key, value);
          return true;
      }
      return false;
    }
  });
}

// src/providers/settings-provider/scroll-controls.ts
var map = createSettingsMap({
  enabled: {
    key: "enable-scroll-controls",
    default: false
  },
  action: {
    key: "scroll-action",
    default: ""
  },
  onHoverOnly: {
    key: "scroll-on-hover-only",
    default: false
  },
  invert: {
    key: "invert-scroll-animation",
    default: false
  },
  invertScrollDirection: {
    key: "invert-scroll-direction",
    default: false
  },
  scrollText: {
    key: "scroll-text",
    default: true
  },
  freezeOnPause: {
    key: "freeze-scroll-on-pause",
    default: true
  }
});
function createScrollControlsSettings(settings) {
  return createSettingsGroup(settings, map);
}

// src/providers/settings-provider/fallback-art.ts
var map2 = createSettingsMap({
  artPath: {
    key: "fallback-art-path",
    default: ""
  }
});
function createFallbackArtsSettings(settings) {
  return createSettingsGroup(settings, map2);
}

// src/providers/settings-provider/pill.ts
var map3 = createSettingsMap({
  alwaysShow: {
    key: "always-show-pill",
    default: false
  },
  showAlbumArt: {
    key: "show-album-art",
    default: true
  },
  tabletMode: {
    key: "tablet-mode",
    default: 0
  },
  controlsPosition: {
    key: "pill-controls-position",
    default: 0
  },
  inlineArtist: {
    key: "inline-artist",
    default: false
  },
  showArtist: {
    key: "show-artist",
    default: true
  },
  hideText: {
    key: "hide-text",
    default: false
  },
  enableShadow: {
    key: "enable-shadow",
    default: false
  },
  shadowOpacity: {
    key: "shadow-opacity",
    default: 50
  },
  shadowBlur: {
    key: "shadow-blur",
    default: 0
  },
  dynamicWidth: {
    key: "pill-dynamic-width",
    default: false
  },
  alignmentPreset: {
    key: "position-mode",
    default: 0
  },
  manualIndex: {
    key: "dock-position",
    default: 0
  },
  verticalOffset: {
    key: "vertical-offset",
    default: 0
  },
  horizontalOffset: {
    key: "horizontal-offset",
    default: 0
  }
});
function createPillSettings(settings) {
  return createSettingsGroup(settings, map3);
}

// src/providers/settings-provider/lyrics.ts
var map4 = createSettingsMap({
  enable: {
    key: "enable-lyrics",
    default: false
  },
  preferedLanguage: {
    key: "lyrics-language-preference",
    default: 0
  },
  fade: {
    key: "lyric-fade-enable",
    default: false
  },
  fadeDuration: {
    key: "lyric-fade-duration",
    default: 50
  }
});
function createLyricsSettings(settings) {
  return createSettingsGroup(settings, map4);
}

// src/providers/settings-provider/mouse-actions.ts
var map5 = createSettingsMap({
  leftClick: {
    key: "action-left-click",
    default: "none"
  },
  doubleClick: {
    key: "action-double-click",
    default: "none"
  },
  middleClick: {
    key: "action-middle-click",
    default: "none"
  },
  rightClick: {
    key: "action-right-click",
    default: "none"
  },
  hoverAction: {
    key: "action-hover",
    default: "none"
  },
  hoverDelay: {
    key: "hover-delay",
    default: 0
  }
});
function createMouseActions(settings) {
  return createSettingsGroup(settings, map5);
}

// src/providers/settings-provider/popup.ts
var map6 = createSettingsMap({
  vinylRotate: {
    key: "popup-vinyl-rotate",
    default: false
  },
  vinylSpeed: {
    key: "popup-vinyl-speed",
    default: 10
  },
  enableShadow: {
    key: "popup-enable-shadow",
    default: true
  },
  hideOnLeave: {
    key: "popup-hide-on-leave",
    default: false
  },
  followCustomBg: {
    key: "popup-follow-custom-bg",
    default: false
  },
  useCustomColors: {
    key: "use-custom-colors",
    default: false
  },
  followCustomText: {
    key: "popup-follow-custom-text",
    default: false
  },
  followTransparency: {
    key: "popup-follow-transparency",
    default: false
  },
  followBorderRadius: {
    key: "popup-follow-radius",
    default: false
  },
  showVinyl: {
    key: "popup-show-vinyl",
    default: true
  },
  squareVinyl: {
    key: "popup-vinyl-square",
    default: false
  },
  showShuffle: {
    key: "show-shuffle-loop",
    default: false
  },
  useCustomWidth: {
    key: "popup-use-custom-width",
    default: false
  },
  customWidth: {
    key: "popup-custom-width",
    default: 320
  },
  showPlayerSelector: {
    key: "popup-show-player-selector",
    default: false
  },
  playerSelectorPosition: {
    key: "popup-player-selector-position",
    default: 0
  },
  autoHidePlayer: {
    key: "hide-auto-smart-selection",
    default: false
  },
  showAlbumTitle: {
    key: "popup-show-album-title",
    default: false
  },
  showHoursFormat: {
    key: "show-hours-format",
    default: true
  },
  showVisualizer: {
    key: "popup-show-visualizer",
    default: true
  },
  hidePillVisualizer: {
    key: "popup-hide-pill-visualizer",
    default: false
  },
  popupVisualizerBars: {
    key: "popup-visualizer-bars",
    default: 10
  },
  popupVisualizerBarWidth: {
    key: "popup-visualizer-bar-width",
    default: 10
  },
  popupVisualizerHeight: {
    key: "popup-visualizer-height",
    default: 100
  },
  enableCustomButtons: {
    key: "enable-custom-buttons",
    default: false
  },
  customButton1: {
    key: "custom-button-1",
    default: "none"
  },
  customButton2: {
    key: "custom-button-2",
    default: "none"
  }
});
function createPopupSettings(settings) {
  return createSettingsGroup(settings, map6);
}

// src/providers/settings-provider/style.ts
var map7 = createSettingsMap({
  visualizerAnimation: {
    key: "visualizer-style",
    default: 0
  },
  visualizerBarCount: {
    key: "visualizer-bars",
    default: 10
  },
  visualizerBarWidth: {
    key: "visualizer-bar-width",
    default: 10
  },
  visualizerHeight: {
    key: "visualizer-height",
    default: 100
  },
  visualizerMargin: {
    key: "visualizer-padding",
    default: 10
  },
  outerEdgeMargin: {
    key: "edge-margin",
    default: 10
  },
  corderRadius: {
    key: "border-radius",
    default: 0
  },
  showPillOutline: {
    key: "show-pill-border",
    default: false
  },
  enableTransparency: {
    key: "enable-transparency",
    default: false
  },
  transparencyStrength: {
    key: "transparency-strength",
    default: 50
  },
  artTransparency: {
    key: "transparency-art",
    default: false
  },
  textTransparency: {
    key: "transparency-text",
    default: false
  },
  visualizerTransparency: {
    key: "transparency-vis",
    default: false
  },
  targetContainer: {
    key: "target-container",
    default: 0
  }
});
function createStyleSettings(settings) {
  return createSettingsGroup(settings, map7);
}

// src/providers/settings-provider/index.ts
function createSettingsProvider(settings) {
  const scrollControls = createScrollControlsSettings(settings);
  const fallbackArt = createFallbackArtsSettings(settings);
  const pill = createPillSettings(settings);
  const lyrics = createLyricsSettings(settings);
  const mouseActions = createMouseActions(settings);
  const popup = createPopupSettings(settings);
  const style = createStyleSettings(settings);
  function connect(signal, callback) {
    return settings.connect(signal, callback);
  }
  return {
    connect,
    scrollControls,
    fallbackArt,
    pill,
    lyrics,
    mouseActions,
    popup,
    style
  };
}

// src/prefs.ts
var DynamicMusicPillPrefs = class extends prefs_exports.ExtensionPreferences {
  static updateGroupVisibility(positioning) {
  }
  async fillPreferencesWindow(window) {
    window.search_enabled = true;
    pkg.initGettext();
    const settings = this.getSettings();
    const settingsProvider = createSettingsProvider(settings);
    const mainPage = new MainPage(settingsProvider, {
      title: t("Main Pill"),
      icon_name: "preferences-system-symbolic"
    });
    window.add(mainPage);
    const popupPage = new PopupPage(settingsProvider, {
      title: t("Pop-up Menu"),
      icon_name: "view-more-symbolic"
    });
    window.add(popupPage);
    const stylePage = new StylePage(settingsProvider, {
      title: t("Style & Layout"),
      icon_name: "applications-graphics-symbolic"
    });
    window.add(stylePage);
  }
};
export {
  DynamicMusicPillPrefs as default
};
//# sourceMappingURL=prefs.js.map
