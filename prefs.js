var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
import Adw95 from "gi://Adw";
import GObject95 from "gi://GObject";

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
import Adw71 from "gi://Adw";
import GObject71 from "gi://GObject";

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

// src/ui/preferences/style-page/background-transparency/components/text-transparency-row.ts
import Adw69 from "gi://Adw";
import Gtk59 from "gi://Gtk";
import GObject69 from "gi://GObject";
var _TextTransparencyRow = class _TextTransparencyRow extends Adw69.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const textTransparencyRow = new Gtk59.Switch({
      active: settings.style.textTransparency,
      valign: Gtk59.Align.CENTER
    });
    settings.style.bind("textTransparency", textTransparencyRow, "active");
    settings.style.bind("enableTransparency", this, "sensitive");
    this.add_suffix(textTransparencyRow);
  }
};
GObject69.registerClass(_TextTransparencyRow);
var TextTransparencyRow = _TextTransparencyRow;

// src/ui/preferences/style-page/background-transparency/components/visualizer-transparency-row.ts
import Adw70 from "gi://Adw";
import Gtk60 from "gi://Gtk";
import GObject70 from "gi://GObject";
var _VisualizerTransparencyRow = class _VisualizerTransparencyRow extends Adw70.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const visualizerTransparencyRow = new Gtk60.Switch({
      active: settings.style.visualizerTransparency,
      valign: Gtk60.Align.CENTER
    });
    settings.style.bind("visualizerTransparency", visualizerTransparencyRow, "active");
    settings.style.bind("enableTransparency", this, "sensitive");
    this.add_suffix(visualizerTransparencyRow);
  }
};
GObject70.registerClass(_VisualizerTransparencyRow);
var VisualizerTransparencyRow = _VisualizerTransparencyRow;

// src/ui/preferences/style-page/background-transparency/index.ts
var _BackgroundTransparencyGroup = class _BackgroundTransparencyGroup extends Adw71.PreferencesGroup {
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
  }
};
GObject71.registerClass(_BackgroundTransparencyGroup);
var BackgroundTransparencyGroup = _BackgroundTransparencyGroup;

// src/ui/preferences/style-page/shadow-group/index.ts
import Adw75 from "gi://Adw";
import GObject75 from "gi://GObject";

// src/ui/preferences/style-page/shadow-group/components/enable-shadow-row.ts
import Adw72 from "gi://Adw";
import Gtk61 from "gi://Gtk";
import GObject72 from "gi://GObject";
var _EnableShadowRow = class _EnableShadowRow extends Adw72.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const enableShadowRow = new Gtk61.Switch({
      active: settings.pill.enableShadow,
      valign: Gtk61.Align.CENTER
    });
    settings.pill.bind("enableShadow", enableShadowRow, "active");
    this.add_suffix(enableShadowRow);
  }
};
GObject72.registerClass(_EnableShadowRow);
var EnableShadowRow = _EnableShadowRow;

// src/ui/preferences/style-page/shadow-group/components/shadow-intensity-row.ts
import Adw73 from "gi://Adw";
import Gtk62 from "gi://Gtk";
import GObject73 from "gi://GObject";
var _ShadowIntensityRow = class _ShadowIntensityRow extends Adw73.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const shadowIntensityRow = new Adw73.SpinRow({
      adjustment: new Gtk62.Adjustment({ lower: 0, upper: 100, step_increment: 5 })
    });
    settings.pill.bind("shadowOpacity", shadowIntensityRow, "value");
    this.add_suffix(shadowIntensityRow);
    settings.pill.bind("enableShadow", this, "sensitive");
  }
};
GObject73.registerClass(_ShadowIntensityRow);
var ShadowIntensityRow = _ShadowIntensityRow;

// src/ui/preferences/style-page/shadow-group/components/shadow-blur-row.ts
import Adw74 from "gi://Adw";
import Gtk63 from "gi://Gtk";
import GObject74 from "gi://GObject";
var _ShadowBlurRow = class _ShadowBlurRow extends Adw74.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const shadowBlurRow = new Adw74.SpinRow({
      adjustment: new Gtk63.Adjustment({ lower: 0, upper: 50, step_increment: 1 })
    });
    settings.pill.bind("shadowBlur", shadowBlurRow, "value");
    this.add_suffix(shadowBlurRow);
    settings.pill.bind("enableShadow", this, "sensitive");
  }
};
GObject74.registerClass(_ShadowBlurRow);
var ShadowBlurRow = _ShadowBlurRow;

// src/ui/preferences/style-page/shadow-group/index.ts
var _ShadowGroup = class _ShadowGroup extends Adw75.PreferencesGroup {
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
GObject75.registerClass(_ShadowGroup);
var ShadowGroup = _ShadowGroup;

// src/ui/preferences/style-page/positioning-group/index.ts
import Adw82 from "gi://Adw";
import GObject82 from "gi://GObject";

// src/ui/preferences/style-page/positioning-group/components/container-target-row.ts
import Adw76 from "gi://Adw";
import Gtk64 from "gi://Gtk";
import GObject76 from "gi://GObject";
var _ContainerTargetRow = class _ContainerTargetRow extends Adw76.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const targetModel = new Gtk64.StringList();
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
GObject76.registerClass(_ContainerTargetRow);
var ContainerTargetRow = _ContainerTargetRow;

// src/ui/preferences/style-page/positioning-group/components/dynamic-width-row.ts
import Adw77 from "gi://Adw";
import Gtk65 from "gi://Gtk";
import GObject77 from "gi://GObject";
var _DynamicWidthRow = class _DynamicWidthRow extends Adw77.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const dynamicWidthRow = new Gtk65.Switch({
      active: settings.pill.dynamicWidth,
      valign: Gtk65.Align.CENTER
    });
    settings.pill.bind("dynamicWidth", dynamicWidthRow, "active");
    this.add_suffix(dynamicWidthRow);
  }
};
GObject77.registerClass(_DynamicWidthRow);
var DynamicWidthRow = _DynamicWidthRow;

// src/ui/preferences/style-page/positioning-group/components/alignment-preset-row.ts
import Adw78 from "gi://Adw";
import Gtk66 from "gi://Gtk";
import GObject78 from "gi://GObject";
var _AlignmentPresetRow = class _AlignmentPresetRow extends Adw78.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const alignmentPresetRow = new Gtk66.StringList();
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
GObject78.registerClass(_AlignmentPresetRow);
var AlignmentPresetRow = _AlignmentPresetRow;

// src/ui/preferences/style-page/positioning-group/components/manual-index-row.ts
import Adw79 from "gi://Adw";
import Gtk67 from "gi://Gtk";
import GObject79 from "gi://GObject";
var _ManualIndexRow = class _ManualIndexRow extends Adw79.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const manualIndexRow = new Adw79.SpinRow({ adjustment: new Gtk67.Adjustment({ lower: 0, upper: 20, step_increment: 1 }) });
    settings.pill.bind("manualIndex", manualIndexRow, "value");
    this.add_suffix(manualIndexRow);
  }
};
GObject79.registerClass(_ManualIndexRow);
var ManualIndexRow = _ManualIndexRow;

// src/ui/preferences/style-page/positioning-group/components/vertical-offset-row.ts
import Adw80 from "gi://Adw";
import Gtk68 from "gi://Gtk";
import GObject80 from "gi://GObject";
var _VerticalOffsetRow = class _VerticalOffsetRow extends Adw80.ActionRow {
  constructor(settings, props) {
    super(props);
    const vOffsetRow = new Adw80.SpinRow({
      adjustment: new Gtk68.Adjustment({ lower: -30, upper: 30, step_increment: 1 })
    });
    settings.pill.bind("verticalOffset", vOffsetRow, "value");
    this.add_suffix(vOffsetRow);
  }
};
GObject80.registerClass(_VerticalOffsetRow);
var VerticalOffsetRow = _VerticalOffsetRow;

// src/ui/preferences/style-page/positioning-group/components/horizontal-offset-row.ts
import Adw81 from "gi://Adw";
import Gtk69 from "gi://Gtk";
import GObject81 from "gi://GObject";
var _HorizontalOffsetRow = class _HorizontalOffsetRow extends Adw81.ActionRow {
  constructor(settings, props) {
    super(props);
    const hOffsetRow = new Adw81.SpinRow({
      adjustment: new Gtk69.Adjustment({ lower: -50, upper: 50, step_increment: 1 })
    });
    settings.pill.bind("horizontalOffset", hOffsetRow, "value");
    this.add_suffix(hOffsetRow);
  }
};
GObject81.registerClass(_HorizontalOffsetRow);
var HorizontalOffsetRow = _HorizontalOffsetRow;

// src/ui/preferences/style-page/positioning-group/index.ts
var _PositioningGroup = class _PositioningGroup extends Adw82.PreferencesGroup {
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
    const verticalOffsetRow = new VerticalOffsetRow(settings, {
      title: t("Vertical Offset (Y)"),
      subtitle: t("Shift Up (-) or Down (+)")
    });
    this.add(verticalOffsetRow);
    const horizontalOffsetRow = new HorizontalOffsetRow(settings, {
      title: t("Horizontal Offset (X)"),
      subtitle: t("Shift Left (-) or Right (+)")
    });
    this.add(horizontalOffsetRow);
  }
};
GObject82.registerClass(_PositioningGroup);
var PositioningGroup = _PositioningGroup;

// src/ui/preferences/style-page/dimensions-group/index.ts
import Adw86 from "gi://Adw";
import GObject86 from "gi://GObject";

// src/ui/preferences/style-page/dimensions-group/components/album-art-size-row.ts
import Adw83 from "gi://Adw";
import Gtk70 from "gi://Gtk";
import GObject83 from "gi://GObject";
var _AlbumArtSizeRow = class _AlbumArtSizeRow extends Adw83.ActionRow {
  constructor(settings, props) {
    super(props);
    const albumArtSizeRow = new Adw83.SpinRow({
      adjustment: new Gtk70.Adjustment({ lower: 16, upper: 48, step_increment: 1 })
    });
    settings.pill.bind("albumArtSize", albumArtSizeRow, "value");
    this.add_suffix(albumArtSizeRow);
  }
};
GObject83.registerClass(_AlbumArtSizeRow);
var AlbumArtSizeRow = _AlbumArtSizeRow;

// src/ui/preferences/style-page/dimensions-group/components/widget-width-row.ts
import Adw84 from "gi://Adw";
import Gtk71 from "gi://Gtk";
import GObject84 from "gi://GObject";
var _WidgetWidthRow = class _WidgetWidthRow extends Adw84.ActionRow {
  constructor(settings, props) {
    super(props);
    const dockWidthRow = new Adw84.SpinRow({
      adjustment: new Gtk71.Adjustment({ lower: 100, upper: 600, step_increment: 10 })
    });
    settings.pill.bind("dockWidth", dockWidthRow, "value");
    this.add_suffix(dockWidthRow);
  }
};
GObject84.registerClass(_WidgetWidthRow);
var WidgetWidthRow = _WidgetWidthRow;

// src/ui/preferences/style-page/dimensions-group/components/widget-height-row.ts
import Adw85 from "gi://Adw";
import Gtk72 from "gi://Gtk";
import GObject85 from "gi://GObject";
var _WidgetHeightRow = class _WidgetHeightRow extends Adw85.ActionRow {
  constructor(settings, props) {
    super(props);
    const dockHeightRow = new Adw85.SpinRow({
      adjustment: new Gtk72.Adjustment({ lower: 32, upper: 100, step_increment: 4 })
    });
    settings.pill.bind("dockHeight", dockHeightRow, "value");
    this.add_suffix(dockHeightRow);
  }
};
GObject85.registerClass(_WidgetHeightRow);
var WidgetHeightRow = _WidgetHeightRow;

// src/ui/preferences/style-page/dimensions-group/index.ts
var _DimensionsGroup = class _DimensionsGroup extends Adw86.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const albumArtSizeRow = new AlbumArtSizeRow(settings, {
      title: t("Album Art Size")
    });
    this.add(albumArtSizeRow);
    const widgetWidthRow = new WidgetWidthRow(settings, {
      title: t("Widget Width")
    });
    this.add(widgetWidthRow);
    const widgetHeightRow = new WidgetHeightRow(settings, {
      title: t("Widget Height")
    });
    this.add(widgetHeightRow);
    settings.style.connect("changed::target-container", () => {
      this.set_visible(settings.style.targetContainer === 0);
    });
    this.set_visible(settings.style.targetContainer === 0);
  }
};
GObject86.registerClass(_DimensionsGroup);
var DimensionsGroup = _DimensionsGroup;

// src/ui/preferences/style-page/custom-colors/index.ts
import Adw90 from "gi://Adw";
import GObject90 from "gi://GObject";

// src/ui/preferences/style-page/custom-colors/components/sync-accent-row.ts
import Adw87 from "gi://Adw";
import Gtk73 from "gi://Gtk";
import GObject87 from "gi://GObject";
var _SyncAccentRow = class _SyncAccentRow extends Adw87.ActionRow {
  constructor(settings, props, ...args) {
    super(props, args);
    const syncAccentRow = new Gtk73.Switch({
      active: settings.style.syncAccentColor,
      valign: Gtk73.Align.CENTER
    });
    settings.style.bind("syncAccentColor", syncAccentRow, "active");
    this.add_suffix(syncAccentRow);
  }
};
GObject87.registerClass(_SyncAccentRow);
var SyncAccentRow = _SyncAccentRow;

// src/ui/preferences/style-page/custom-colors/components/use-custom-colors-row.ts
import Adw88 from "gi://Adw";
import Gtk74 from "gi://Gtk";
import Gio2 from "gi://Gio";
import GObject88 from "gi://GObject";
var _UseCustomColorsRow = class _UseCustomColorsRow extends Adw88.ActionRow {
  constructor(settings, props, ...args) {
    super(props, args);
    const useCustomColorsRow = new Gtk74.Switch({
      active: settings.style.useCustomColors,
      valign: Gtk74.Align.CENTER
    });
    settings.style.bind("useCustomColors", useCustomColorsRow, "active");
    settings.style.bind("syncAccentColor", this, "sensitive", Gio2.SettingsBindFlags.DEFAULT | Gio2.SettingsBindFlags.INVERT_BOOLEAN);
    this.add_suffix(useCustomColorsRow);
  }
};
GObject88.registerClass(_UseCustomColorsRow);
var UseCustomColorsRow = _UseCustomColorsRow;

// src/ui/preferences/style-page/custom-colors/components/color-button-row.ts
import Adw89 from "gi://Adw";
import Gtk75 from "gi://Gtk";
import Gdk from "gi://Gdk";
import GObject89 from "gi://GObject";
var _ColorButtonRow = class _ColorButtonRow extends Adw89.ActionRow {
  constructor(settings, settingsKey, props, ...args) {
    super(props, args);
    const cStr = settings.style[settingsKey].split(",");
    const c = new Gdk.RGBA();
    c.parse(`rgb(${cStr[0] || 40},${cStr[1] || 40},${cStr[2] || 40})`);
    const btn = new Gtk75.ColorButton({
      rgba: c,
      use_alpha: false,
      valign: Gtk75.Align.CENTER
    });
    btn.connect("color-set", () => {
      const rgba = btn.get_rgba();
      const colorStr = `${Math.round(rgba.red * 255)},${Math.round(rgba.green * 255)},${Math.round(rgba.blue * 255)}`;
      settings.style[settingsKey] = colorStr;
    });
    settings.style.connect(`changed::${settingsKey}`, () => {
      const cStr2 = settings.style[settingsKey].split(",");
      const c2 = new Gdk.RGBA();
      c2.parse(`rgb(${cStr2[0] || 40},${cStr2[1] || 40},${cStr2[2] || 40})`);
      btn.set_rgba(c2);
    });
    this.add_suffix(btn);
    settings.style.bind("syncAccentColor", this, "sensitive");
    settings.style.bind("useCustomColors", this, "sensitive");
  }
};
GObject89.registerClass(_ColorButtonRow);
var ColorButtonRow = _ColorButtonRow;

// src/ui/preferences/style-page/custom-colors/index.ts
var _CustomColorsGroup = class _CustomColorsGroup extends Adw90.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const syncAccentRow = new SyncAccentRow(settings, {
      title: t("Sync GNOME Accent Color"),
      subtitle: t("Dynamically change the GNOME Shell accent color to match the album art")
    });
    this.add(syncAccentRow);
    const useCustomColorsRow = new UseCustomColorsRow(settings, {
      title: t("Use Custom Colors"),
      subtitle: t("Override dynamic colors")
    });
    this.add(useCustomColorsRow);
    const customBgColorRow = new ColorButtonRow(settings, "customBgColor", {
      title: t("Background Color")
    });
    this.add(customBgColorRow);
    const customTextColorRow = new ColorButtonRow(settings, "customTextColor", {
      title: t("Text Color")
    });
    this.add(customTextColorRow);
  }
};
GObject90.registerClass(_CustomColorsGroup);
var CustomColorsGroup = _CustomColorsGroup;

// src/ui/preferences/style-page/panel-group/index.ts
import Adw94 from "gi://Adw";
import GObject94 from "gi://GObject";

// src/ui/preferences/style-page/panel-group/components.ts/art-size-row.ts
import Adw91 from "gi://Adw";
import GObject91 from "gi://GObject";
import Gtk76 from "gi://Gtk";
var _ArtSizeRow = class _ArtSizeRow extends Adw91.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const artSizeRow = new Adw91.SpinRow({
      adjustment: new Gtk76.Adjustment({ lower: 14, upper: 32, step_increment: 1 })
    });
    this.add_suffix(artSizeRow);
    settings.style.connect("changed::panel-art-size", () => {
      artSizeRow.set_value(settings.style.panelArtSize);
    });
    artSizeRow.set_value(settings.style.panelArtSize);
  }
};
GObject91.registerClass(_ArtSizeRow);
var ArtSizeRow = _ArtSizeRow;

// src/ui/preferences/style-page/panel-group/components.ts/widget-width-row.ts
import Adw92 from "gi://Adw";
import GObject92 from "gi://GObject";
import Gtk77 from "gi://Gtk";
var _WidgetWidthRow2 = class _WidgetWidthRow2 extends Adw92.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const widgetWidthRow = new Adw92.SpinRow({
      adjustment: new Gtk77.Adjustment({ lower: 100, upper: 600, step_increment: 10 })
    });
    this.add_suffix(widgetWidthRow);
    settings.style.connect("changed::panel-pill-width", () => {
      widgetWidthRow.set_value(settings.style.panelWidth);
    });
    widgetWidthRow.set_value(settings.style.panelWidth);
  }
};
GObject92.registerClass(_WidgetWidthRow2);
var WidgetWidthRow2 = _WidgetWidthRow2;

// src/ui/preferences/style-page/panel-group/components.ts/widget-height-row.ts
import Adw93 from "gi://Adw";
import GObject93 from "gi://GObject";
import Gtk78 from "gi://Gtk";
var _WidgetHeightRow2 = class _WidgetHeightRow2 extends Adw93.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const widgetHeightRow = new Adw93.SpinRow({
      adjustment: new Gtk78.Adjustment({ lower: 20, upper: 60, step_increment: 2 })
    });
    this.add_suffix(widgetHeightRow);
    settings.style.connect("changed::panel-pill-height", () => {
      widgetHeightRow.set_value(settings.style.panelHeight);
    });
    widgetHeightRow.set_value(settings.style.panelHeight);
  }
};
GObject93.registerClass(_WidgetHeightRow2);
var WidgetHeightRow2 = _WidgetHeightRow2;

// src/ui/preferences/style-page/panel-group/index.ts
var _PanelGroup = class _PanelGroup extends Adw94.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const artSizeRow = new ArtSizeRow(settings, {
      title: t("Album Art Size")
    });
    this.add(artSizeRow);
    const widgetWidthRow = new WidgetWidthRow2(settings, {
      title: t("Widget Width")
    });
    this.add(widgetWidthRow);
    const widgetHeightRow = new WidgetHeightRow2(settings, {
      title: t("Widget Height")
    });
    this.add(widgetHeightRow);
    settings.style.connect("changed::target-container", () => {
      this.set_visible(settings.style.targetContainer !== 0);
    });
    this.set_visible(settings.style.targetContainer !== 0);
  }
};
GObject94.registerClass(_PanelGroup);
var PanelGroup = _PanelGroup;

// src/ui/preferences/style-page/index.ts
var _StylePage = class _StylePage extends Adw95.PreferencesPage {
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
    const dimensionsGroup = new DimensionsGroup(settings, {
      title: t("Dimensions (Dock Mode)")
    });
    this.add(dimensionsGroup);
    const panelGroup = new PanelGroup(settings, {
      title: t("Dimensions (Panel Mode)")
    });
    this.add(panelGroup);
    const customColorsGroup = new CustomColorsGroup(settings, {
      title: t("Custom Colors")
    });
    this.add(customColorsGroup);
  }
};
GObject95.registerClass(_StylePage);
var StylePage = _StylePage;

// src/ui/preferences/system-page/index.ts
import Adw114 from "gi://Adw";
import GObject114 from "gi://GObject";

// src/ui/preferences/system-page/system-group/index.ts
import Adw102 from "gi://Adw";
import GObject102 from "gi://GObject";

// src/ui/preferences/system-page/system-group/components/hide-player-row.ts
import Adw96 from "gi://Adw";
import Gtk79 from "gi://Gtk";
import GObject96 from "gi://GObject";
var _HidePlayerRow = class _HidePlayerRow extends Adw96.ActionRow {
  constructor(settings, props, ...args) {
    super(props, args);
    const hidePlayerSwitch = new Gtk79.Switch({
      active: settings.system.hideDefaultPlayer,
      valign: Gtk79.Align.CENTER
    });
    settings.system.bind("hideDefaultPlayer", hidePlayerSwitch, "active");
    this.add_suffix(hidePlayerSwitch);
  }
};
GObject96.registerClass(_HidePlayerRow);
var HidePlayerRow = _HidePlayerRow;

// src/ui/preferences/system-page/system-group/components/game-mode.row.ts
import Adw97 from "gi://Adw";
import Gtk80 from "gi://Gtk";
import GObject97 from "gi://GObject";
var _GameModeRow = class _GameModeRow extends Adw97.ActionRow {
  constructor(settings, props, ...args) {
    super(props, args);
    const gameModeSwitch = new Gtk80.Switch({
      active: settings.system.gameMode,
      valign: Gtk80.Align.CENTER
    });
    settings.system.bind("gameMode", gameModeSwitch, "active");
    this.add_suffix(gameModeSwitch);
  }
};
GObject97.registerClass(_GameModeRow);
var GameModeRow = _GameModeRow;

// src/ui/preferences/system-page/system-group/components/compatiblity-delay-row.ts
import Adw98 from "gi://Adw";
import Gtk81 from "gi://Gtk";
import GObject98 from "gi://GObject";
var _CompatibilityDelayRow = class _CompatibilityDelayRow extends Adw98.ActionRow {
  constructor(settings, props, ...args) {
    super(props, args);
    const compatibilityDelaySwitch = new Gtk81.Switch({
      active: settings.system.compatibilityDelay,
      valign: Gtk81.Align.CENTER
    });
    settings.system.bind("compatibilityDelay", compatibilityDelaySwitch, "active");
    this.add_suffix(compatibilityDelaySwitch);
  }
};
GObject98.registerClass(_CompatibilityDelayRow);
var CompatibilityDelayRow = _CompatibilityDelayRow;

// src/ui/preferences/system-page/system-group/components/filter-mode-row.ts
import Adw99 from "gi://Adw";
import Gtk82 from "gi://Gtk";
import GObject99 from "gi://GObject";
var _FilterModeRow = class _FilterModeRow extends Adw99.ComboRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const model = new Gtk82.StringList();
    model.append(t("Off (Allow All)"));
    model.append(t("Blacklist (Exclude listed)"));
    model.append(t("Whitelist (Only allow listed)"));
    this.set_model(model);
    this.set_selected(settings.system.playerFilterMode);
    this.connect("notify::selected", () => {
      settings.system.playerFilterMode = this.selected;
    });
  }
};
GObject99.registerClass(_FilterModeRow);
var FilterModeRow = _FilterModeRow;

// src/ui/preferences/system-page/system-group/components/filtered-players-row.ts
import Adw100 from "gi://Adw";
import GObject100 from "gi://GObject";
var _FilteredPlayersRow = class _FilteredPlayersRow extends Adw100.EntryRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    this.set_text(settings.system.filteredPlayers);
    settings.system.bind("filteredPlayers", this, "text");
    settings.system.connect("changed::player-filter-mode", () => {
      this.set_sensitive(settings.system.playerFilterMode !== 0);
    });
    this.set_sensitive(settings.system.playerFilterMode !== 0);
  }
};
GObject100.registerClass(_FilteredPlayersRow);
var FilteredPlayersRow = _FilteredPlayersRow;

// src/ui/preferences/system-page/system-group/components/detected-players-row.ts
import Adw101 from "gi://Adw";
import Gtk83 from "gi://Gtk";
import GObject101 from "gi://GObject";
var _DetectedPlayersRow = class _DetectedPlayersRow extends Adw101.ActionRow {
  constructor(settings, mpris, properties, ...args) {
    super(properties, args);
    const refreshBtn = new Gtk83.Button({
      icon_name: "view-refresh-symbolic",
      valign: Gtk83.Align.CENTER,
      margin_end: 10,
      css_classes: ["flat"]
    });
    this.add_prefix(refreshBtn);
    const playerBox = new Gtk83.Box({ spacing: 6, valign: Gtk83.Align.CENTER });
    this.add_suffix(playerBox);
    const updateDetected = () => {
      let child = playerBox.get_first_child();
      while (child) {
        let next = child.get_next_sibling();
        playerBox.remove(child);
        child = next;
      }
      try {
        const mprisNames = mpris.listPlayers();
        let apps = mprisNames.map((n) => n.replace("org.mpris.MediaPlayer2.", "").split(".")[0]);
        if (apps.length === 0) {
          playerBox.append(new Gtk83.Label({ label: t("No players found") }));
        } else {
          for (const app of apps) {
            let btn = new Gtk83.Button({ label: app, css_classes: ["suggested-action"] });
            btn.connect("clicked", () => {
              let current = settings.system.filteredPlayers;
              let list = current.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
              if (!list.includes(app)) {
                list.push(app);
                settings.system.filteredPlayers = list.join(",");
              }
            });
            playerBox.append(btn);
          }
        }
      } catch (e) {
        logError(e);
      }
    };
    refreshBtn.connect("clicked", updateDetected);
    updateDetected();
    settings.system.connect("changed::player-filter-mode", () => {
      this.set_sensitive(settings.system.playerFilterMode !== 0);
    });
    this.set_sensitive(settings.system.playerFilterMode !== 0);
    this.add_suffix(playerBox);
  }
};
GObject101.registerClass(_DetectedPlayersRow);
var DetectedPlayersRow = _DetectedPlayersRow;

// src/ui/preferences/system-page/system-group/index.ts
var _SystemGroup = class _SystemGroup extends Adw102.PreferencesGroup {
  constructor(settings, mpris, properties, ...args) {
    super(properties, args);
    const hidePlayerRow = new HidePlayerRow(settings, {
      title: t("Hide Default GNOME Player"),
      subtitle: t("Remove the duplicate built-in media controls")
    });
    this.add(hidePlayerRow);
    const gameModeRow = new GameModeRow(settings, {
      title: t("Game Mode"),
      subtitle: t("Disable animations when a fullscreen app is active")
    });
    this.add(gameModeRow);
    const compatibilityDelayRow = new CompatibilityDelayRow(settings, {
      title: t("Slow Player Workaround"),
      subtitle: t("Adds a slight delay to track changes (fixes sync issues)")
    });
    this.add(compatibilityDelayRow);
    const filterModeRow = new FilterModeRow(settings, {
      title: t("Player Filter Mode"),
      subtitle: t("Choose how to filter media players (e.g. browsers)")
    });
    this.add(filterModeRow);
    const filterListRow = new FilteredPlayersRow(settings, {
      title: t("Filtered Players (comma separated)")
    });
    this.add(filterListRow);
    const detectedPlayersRow = new DetectedPlayersRow(settings, mpris, {
      title: t("Detected Players"),
      subtitle: t("Click an active player to add it to the filter list")
    });
    this.add(detectedPlayersRow);
  }
};
GObject102.registerClass(_SystemGroup);
var SystemGroup = _SystemGroup;

// src/ui/preferences/system-page/mapping-help/index.ts
import Adw104 from "gi://Adw";
import GObject104 from "gi://GObject";

// src/ui/preferences/system-page/mapping-help/components/help-expander-row.ts
import Adw103 from "gi://Adw";
import Gtk84 from "gi://Gtk";
import GObject103 from "gi://GObject";
var _HelpExpanderRow = class _HelpExpanderRow extends Adw103.ExpanderRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    let label = "To allow the extension to open/close your player, you need to provide its ";
    label += "exact window name (App ID).\n";
    label += "\n";
    label += "<b>Common Examples:</b>\n";
    label += "\u2022 Spotify (Flatpak): <b>com.spotify.Client</b>\n";
    label += "\u2022 VLC: <b>vlc</b>\n";
    label += "\u2022 YouTube Music (Web App): <b>youtube-music</b>\n";
    label += "\u2022 High Tide: <b>io.github.nokse22.high-tide</b>\n";
    label += "\u2022 Browsers: <b>chromium</b>, <b>firefox</b>, <b>brave-browser</b>\n";
    label += "\n";
    label += "<b>How to find it manually:</b>\n";
    label += "1. Press <b>Alt + F2</b>, type <b>lg</b>, and press Enter.\n";
    label += "2. Click on the <b>Windows</b> tab in the top right corner.\n";
    label += "3. Find your music player in the list.\n";
    label += "4. Look at the <b>wmclass:</b> or <b>app:</b> field. That is your App ID! ";
    label += "<i>(Remove the .desktop part)</i>\n";
    label += "5. Press Esc to close the debugger.";
    const helpLabel = new Gtk84.Label({
      label,
      use_markup: true,
      justify: Gtk84.Justification.LEFT,
      xalign: 0,
      wrap: true,
      margin_top: 15,
      margin_bottom: 15,
      margin_start: 15,
      margin_end: 15
    });
    this.add_row(helpLabel);
  }
};
GObject103.registerClass(_HelpExpanderRow);
var HelpExpanderRow = _HelpExpanderRow;

// src/ui/preferences/system-page/mapping-help/index.ts
var _MappingHelpGroup = class _MappingHelpGroup extends Adw104.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const helpExpander = new HelpExpanderRow(settings, {
      title: t("\u{1F4A1} How to find the correct App ID?"),
      subtitle: t("Click here for a quick guide and examples")
    });
    this.add(helpExpander);
  }
};
GObject104.registerClass(_MappingHelpGroup);
var MappingHelpGroup = _MappingHelpGroup;

// src/ui/preferences/system-page/aps-mapping-group/index.ts
import Adw105 from "gi://Adw";
import GObject105 from "gi://GObject";
import Gtk85 from "gi://Gtk";
import GLib from "gi://GLib";
var _AppMappingGroup = class _AppMappingGroup extends Adw105.PreferencesGroup {
  constructor(properties, ...args) {
    const _a = properties, { settings, systemPage } = _a, props = __objRest(_a, ["settings", "systemPage"]);
    super(props, args);
    __publicField(this, "rows", []);
    __publicField(this, "settings");
    __publicField(this, "systemPage");
    this.settings = settings;
    this.systemPage = systemPage;
    this.settings.system.connect("changed::app-name-mapping", () => this.refreshAppMappings());
    this.refreshAppMappings();
  }
  clearRows() {
    for (const row of this.rows) {
      this.remove(row);
    }
    this.rows = [];
  }
  refreshAppMappings() {
    const { settings, systemPage } = this;
    if (systemPage.isRefreshingPlayers) {
      return;
    }
    systemPage.isRefreshingPlayers = true;
    this.clearRows();
    const pairs = this.settings.system.appNameMapping.split(",").filter((p) => p.trim() !== "");
    if (pairs.length === 0) {
      this.set_description(t("No manual mappings saved."));
      systemPage.isRefreshingPlayers = false;
      return;
    }
    this.set_description(t("Type the correct App ID, then hit Enter or click the Save icon!"));
    for (const pair of pairs) {
      const parts = pair.split(":");
      if (parts.length >= 2) {
        const mprisName = parts[0].trim();
        const targetId = parts.slice(1).join(":").trim();
        const row = new Adw105.EntryRow({
          title: mprisName,
          text: targetId
        });
        const btnBox = new Gtk85.Box({
          spacing: 6,
          valign: Gtk85.Align.CENTER
        });
        const saveBtn = new Gtk85.Button({
          icon_name: "document-save-symbolic",
          valign: Gtk85.Align.CENTER,
          css_classes: ["flat", "suggested-action"],
          tooltip_text: t("Save App ID")
        });
        const saveAction = () => {
          const newId = row.text.trim();
          if (newId === "") return;
          const currentPairs = settings.system.appNameMapping.split(",").filter((p) => p.trim() !== "");
          const newPairs = currentPairs.map((p) => {
            if (p.startsWith(`${mprisName}:`)) {
              return `${mprisName}:${newId}`;
            }
            return p;
          });
          settings.system.appNameMapping = newPairs.join(",");
          saveBtn.set_icon_name("object-select-symbolic");
          GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1500, () => {
            if (saveBtn) {
              saveBtn.set_icon_name("document-save-symbolic");
            }
            return GLib.SOURCE_REMOVE;
          });
        };
        saveBtn.connect("clicked", saveAction);
        row.connect("apply", saveAction);
        const deleteBtn = new Gtk85.Button({
          icon_name: "user-trash-symbolic",
          valign: Gtk85.Align.CENTER,
          css_classes: ["flat", "destructive-action"],
          tooltip_text: t("Delete Mapping")
        });
        deleteBtn.connect("clicked", () => {
          const currentPairs = settings.system.appNameMapping.split(",").filter((p) => p.trim() !== "");
          const newPairs = currentPairs.filter((p) => !p.startsWith(`${mprisName}:`));
          settings.system.appNameMapping = newPairs.join(",");
        });
        btnBox.append(saveBtn);
        btnBox.append(deleteBtn);
        row.add_suffix(btnBox);
        this.rows.push(row);
        this.add(row);
      }
    }
    systemPage.isRefreshingPlayers = false;
  }
};
GObject105.registerClass(_AppMappingGroup);
var AppMappingGroup = _AppMappingGroup;

// src/ui/preferences/system-page/running-players-group/index.ts
import Adw106 from "gi://Adw";
import GObject106 from "gi://GObject";
import Gtk86 from "gi://Gtk";

// src/constants/mpris-constants.ts
var PLAYER_INTERFACE = "org.mpris.MediaPlayer2";
var MPRIS_INTERFACE = `${PLAYER_INTERFACE}.Player`;
var MPRIS_OBJECT = "/org/mpris/MediaPlayer2";

// src/ui/preferences/system-page/running-players-group/index.ts
var _RunningPlayersGroup = class _RunningPlayersGroup extends Adw106.PreferencesGroup {
  constructor(properties, ...args) {
    const _a = properties, { settings, mpris, systemPage } = _a, props = __objRest(_a, ["settings", "mpris", "systemPage"]);
    super(props, args);
    __publicField(this, "settings");
    __publicField(this, "mpris");
    __publicField(this, "systemPage");
    __publicField(this, "rows", []);
    this.settings = settings;
    this.mpris = mpris;
    this.systemPage = systemPage;
    const refreshMappingRow = new Adw106.ActionRow({
      title: t("Refresh List"),
      subtitle: t("Click to scan for active players again")
    });
    const refreshMappingBtn = new Gtk86.Button({
      icon_name: "view-refresh-symbolic",
      valign: Gtk86.Align.CENTER,
      css_classes: ["flat"]
    });
    refreshMappingBtn.connect("clicked", () => this.refreshPlayers());
    refreshMappingRow.add_suffix(refreshMappingBtn);
    this.add(refreshMappingRow);
    settings.system.connect("changed::app-name-mapping", () => this.refreshPlayers());
    this.refreshPlayers();
  }
  clearRows() {
    for (const row of this.rows) {
      this.remove(row);
    }
    this.rows = [];
  }
  refreshPlayers() {
    if (this.systemPage.isRefreshingPlayers) {
      return;
    }
    this.systemPage.isRefreshingPlayers = true;
    this.clearRows();
    const currentAppMapping = this.settings.system.appNameMapping;
    const mprisNames = this.mpris.listPlayers();
    if (mprisNames.length === 0) {
      this.set_description(t("No active players detected. Open a music app first!"));
    } else {
      this.set_description(t("Select a player to help the extension identify it:"));
      for (const fullBusName of mprisNames) {
        let shortName = fullBusName.replace(`${PLAYER_INTERFACE}.`, "");
        if (shortName.includes(".instance")) {
          shortName = shortName.split(".instance")[0];
        }
        const row = new Adw106.ActionRow({
          title: shortName,
          subtitle: `Bus: ${fullBusName}`
        });
        const btn = new Gtk86.Button({
          label: t("Use This"),
          css_classes: ["suggested-action"],
          valign: Gtk86.Align.CENTER,
          sensitive: !currentAppMapping.includes(`${shortName}:`)
        });
        btn.connect("clicked", () => {
          if (currentAppMapping.includes(`${shortName}:`)) {
            return;
          }
          const newVal = currentAppMapping ? `${currentAppMapping},${shortName}:ENTER_APP_ID_HERE` : `${shortName}:ENTER_APP_ID_HERE`;
          this.settings.system.appNameMapping = newVal;
        });
        this.rows.push(row);
        row.add_suffix(btn);
        this.add(row);
      }
    }
    this.systemPage.isRefreshingPlayers = false;
  }
};
GObject106.registerClass(_RunningPlayersGroup);
var RunningPlayersGroup = _RunningPlayersGroup;

// src/ui/preferences/system-page/backup-group/index.ts
import Adw109 from "gi://Adw";
import GObject109 from "gi://GObject";

// src/ui/preferences/system-page/backup-group/components/export-row.ts
import Adw107 from "gi://Adw";
import Gtk87 from "gi://Gtk";
import Gio4 from "gi://Gio";
import GObject107 from "gi://GObject";

// src/providers/settings-provider/utils.ts
import Gio3 from "gi://Gio";
function createSettingsMap(map9) {
  return map9;
}
function getSettingsKeys(map9) {
  return Object.values(map9).map((entry) => entry.key);
}
function createSettingsGroup(settings, map9) {
  const methods = {
    bind(prop, object, property, flags2 = Gio3.SettingsBindFlags.DEFAULT) {
      settings.bind(
        map9[prop].key,
        object,
        property,
        flags2
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
      const entry = map9[prop];
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
      const entry = map9[prop];
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
var ScrollControlSettingsKeys = getSettingsKeys(map);
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
var FallbackArtSettingsKeys = getSettingsKeys(map2);
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
  },
  albumArtSize: {
    key: "dock-art-size",
    default: 16
  },
  dockWidth: {
    key: "pill-width",
    default: 100
  },
  dockHeight: {
    key: "pill-height",
    default: 32
  }
});
var PillSettingsKeys = getSettingsKeys(map3);
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
var LyricsSettingsKeys = getSettingsKeys(map4);
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
var MouseActionsKeys = getSettingsKeys(map5);
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
var PopupSettingsKeys = getSettingsKeys(map6);
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
  },
  syncAccentColor: {
    key: "sync-accent-color",
    default: false
  },
  useCustomColors: {
    key: "use-custom-colors",
    default: false
  },
  customBgColor: {
    key: "custom-bg-color",
    default: "40,40,40"
  },
  customTextColor: {
    key: "custom-text-color",
    default: "40,40,40"
  },
  panelArtSize: {
    key: "panel-art-size",
    default: 14
  },
  panelWidth: {
    key: "panel-pill-width",
    default: 100
  },
  panelHeight: {
    key: "panel-pill-height",
    default: 100
  }
});
var StyleSettingsKeys = getSettingsKeys(map7);
function createStyleSettings(settings) {
  return createSettingsGroup(settings, map7);
}

// src/providers/settings-provider/system.ts
var map8 = createSettingsMap({
  hideDefaultPlayer: {
    key: "hide-default-player",
    default: false
  },
  gameMode: {
    key: "enable-gamemode",
    default: false
  },
  compatibilityDelay: {
    key: "compatibility-delay",
    default: false
  },
  playerFilterMode: {
    key: "player-filter-mode",
    default: 0
  },
  filteredPlayers: {
    key: "player-filter-list",
    default: ""
  },
  appNameMapping: {
    key: "app-name-mapping",
    default: ""
  }
});
var SystemSettingsKeys = getSettingsKeys(map8);
function createSystemSettings(settings) {
  return createSettingsGroup(settings, map8);
}

// src/providers/settings-provider/index.ts
var SettingsKeys = [
  ...ScrollControlSettingsKeys,
  ...FallbackArtSettingsKeys,
  ...PillSettingsKeys,
  ...LyricsSettingsKeys,
  ...MouseActionsKeys,
  ...PopupSettingsKeys,
  ...StyleSettingsKeys,
  ...SystemSettingsKeys
];
function createSettingsProvider(settings) {
  const scrollControls = createScrollControlsSettings(settings);
  const fallbackArt = createFallbackArtsSettings(settings);
  const pill = createPillSettings(settings);
  const lyrics = createLyricsSettings(settings);
  const mouseActions = createMouseActions(settings);
  const popup = createPopupSettings(settings);
  const style = createStyleSettings(settings);
  const system = createSystemSettings(settings);
  function connect(signal, callback) {
    return settings.connect(signal, callback);
  }
  function emit(signal, ...args) {
    settings.emit(signal, ...args);
  }
  return {
    gioInternal: settings,
    connect,
    emit,
    scrollControls,
    fallbackArt,
    pill,
    lyrics,
    mouseActions,
    popup,
    style,
    system
  };
}

// node_modules/.pnpm/@girs+glib-2.0@2.88.0-4.0.4/node_modules/@girs/glib-2.0/glib-2.0.js
import GLib2 from "gi://GLib?version=2.0";
var glib_2_0_default = GLib2;

// node_modules/.pnpm/@girs+glib-2.0@2.88.0-4.0.4/node_modules/@girs/glib-2.0/index.js
var glib_2_default = glib_2_0_default;

// src/utils/packing.ts
function smartUnpack(object) {
  if (object === null || object === void 0) {
    return null;
  }
  if (object instanceof glib_2_default.Variant || typeof object === "object") {
    let unpacked = object.deepUnpack ? object.deepUnpack() : object;
    if (!unpacked) {
      return unpacked;
    }
    if (Array.isArray(unpacked)) {
      return unpacked.map(smartUnpack);
    }
    const entries = Object.entries(unpacked);
    if (entries.length === 0) {
      return unpacked;
    }
    for (const [key, value] of entries) {
      if (value instanceof glib_2_default.Variant) {
        unpacked[key] = smartUnpack(value);
      }
    }
    return unpacked;
  }
  return object;
}

// src/utils/log.ts
import GLib3 from "gi://GLib";

// src/constants/log-constants.ts
var log_constants_exports = {};
__export(log_constants_exports, {
  LOG_PREFIX: () => LOG_PREFIX
});
var LOG_PREFIX = "[DMP]";

// src/utils/log.ts
var PREFIX = log_constants_exports.LOG_PREFIX;
function logInfo(message) {
  console.log(`${PREFIX} [INFO] ${message}`);
}
function logDebug(message) {
  console.log(`${PREFIX} [DEBUG] ${message}`);
}
function logError2(message) {
  console.error(`${PREFIX} [ERROR] ${message}`);
  if (message instanceof Error) {
    console.error(`${PREFIX} Stack trace: ${message.stack}`);
  }
}
function logTrace(message) {
  console.trace(`${PREFIX} [TRACE] ${message}`);
}
function logObject(object, options = { trace: false, json: false, treeLevel: 0 }) {
  const { trace = false, json = false, treeLevel = 0 } = options;
  const level = "-".repeat(treeLevel);
  const nextLevel = `${level}-`;
  const logFn = trace ? logTrace : logInfo;
  if (object === null) {
    logFn(`${nextLevel} Object is null`);
    return;
  }
  if (object === void 0) {
    logFn(`${nextLevel} Object is undefined`);
    return;
  }
  if (object instanceof GLib3.Variant) {
    const unpacked = smartUnpack(object);
    if (json) {
      logFn(`${nextLevel} Variant as JSON: ${JSON.stringify(unpacked)}`);
      return;
    }
    logInfo(`${nextLevel} Variant`);
    logObject(unpacked, __spreadProps(__spreadValues({}, options), { treeLevel: treeLevel + 1 }));
    return;
  }
  if (typeof object === "string") {
    logFn(`${nextLevel} String ${object}`);
    return;
  }
  if (typeof object === "number") {
    logFn(`${nextLevel} Number ${object}`);
    return;
  }
  if (typeof object === "boolean") {
    logFn(`${nextLevel} Boolean ${object}`);
    return;
  }
  if (Array.isArray(object)) {
    logInfo(`${nextLevel} Array`);
    for (const item of object) {
      logObject(item, __spreadProps(__spreadValues({}, options), { treeLevel: treeLevel + 1 }));
    }
    return;
  }
  const variant = object.deep_unpack ? smartUnpack(object) : object;
  if (json) {
    logFn(`${nextLevel} Object as JSON: ${JSON.stringify(variant)}`);
  } else {
    const keys = Object.keys(variant);
    keys.forEach((key) => {
      const child = variant[key];
      logFn(`${nextLevel} ${key} - ${typeof child}`);
      logObject(child, __spreadProps(__spreadValues({}, options), { treeLevel: treeLevel + 1 }));
    });
  }
}

// src/ui/preferences/system-page/backup-group/components/export-row.ts
var _ExportRow = class _ExportRow extends Adw107.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const exportBtn = new Gtk87.Button({
      label: t("Export"),
      valign: Gtk87.Align.CENTER,
      css_classes: ["suggested-action"]
    });
    exportBtn.connect("clicked", () => {
      let data = {};
      for (const k of SettingsKeys) {
        const value = smartUnpack(settings.gioInternal.get_value(k));
        data = Object.assign(data, { [k]: value });
      }
      const dialog = new Gtk87.FileDialog({
        title: t("Save Settings"),
        initial_name: "music-pill-backup.json"
      });
      dialog.save(null, null, (dlg, res) => {
        if (!dlg) {
          return;
        }
        try {
          const file = dlg.save_finish(res);
          if (file) {
            const encoder = new TextEncoder();
            const json = JSON.stringify(data, null, 2);
            const buffer = encoder.encode(json);
            file.replace_contents_bytes_async(buffer, null, false, Gio4.FileCreateFlags.REPLACE_DESTINATION, null, null);
          }
        } catch (error) {
          logError2(error);
        }
      });
    });
    this.add_suffix(exportBtn);
  }
};
GObject107.registerClass(_ExportRow);
var ExportRow = _ExportRow;

// src/ui/preferences/system-page/backup-group/components/import-row.ts
import Adw108 from "gi://Adw";
import Gtk88 from "gi://Gtk";
import GLib4 from "gi://GLib";
import GObject108 from "gi://GObject";
var _ImportRow = class _ImportRow extends Adw108.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const importBtn = new Gtk88.Button({
      label: t("Import"),
      valign: Gtk88.Align.CENTER
    });
    importBtn.connect("clicked", () => {
      const dialog = new Gtk88.FileDialog({ title: t("Open Settings Backup") });
      dialog.open(null, null, (dlg, res) => {
        var _a;
        if (!dlg) {
          return;
        }
        try {
          const file = dlg.open_finish(res);
          if (file) {
            const [ok, contents] = file.load_contents(null);
            if (ok) {
              const decoder = new TextDecoder();
              const json = decoder.decode(contents);
              const data = JSON.parse(json);
              for (const k of SettingsKeys) {
                const type = (_a = settings.gioInternal.get_default_value(k)) == null ? void 0 : _a.get_type_string();
                const value = data[k];
                if (type && value !== void 0) {
                  settings.gioInternal.set_value(k, new GLib4.Variant(type, value));
                }
              }
            }
          }
        } catch (error) {
          logError2(error);
        }
      });
    });
    this.add_suffix(importBtn);
  }
};
GObject108.registerClass(_ImportRow);
var ImportRow = _ImportRow;

// src/ui/preferences/system-page/backup-group/index.ts
var _BackupGroup = class _BackupGroup extends Adw109.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const exportRow = new ExportRow(settings, {
      title: t("Export Settings")
    });
    this.add(exportRow);
    const importRow = new ImportRow(settings, {
      title: t("Import Settings")
    });
    this.add(importRow);
  }
};
GObject109.registerClass(_BackupGroup);
var BackupGroup = _BackupGroup;

// src/ui/preferences/system-page/cache-group/index.ts
import Adw111 from "gi://Adw";
import GObject111 from "gi://GObject";
import GLib5 from "gi://GLib";

// src/ui/preferences/system-page/cache-group/components/cache-row.ts
import Adw110 from "gi://Adw";
import GObject110 from "gi://GObject";
import Gtk89 from "gi://Gtk";
import Gio5 from "gi://Gio";
var _CacheRow = class _CacheRow extends Adw110.ActionRow {
  constructor(ownCacheDir, properties, ...args) {
    super(properties, args);
    __publicField(this, "_ownCacheDir");
    this._ownCacheDir = ownCacheDir;
    const cacheBtn = new Gtk89.Button({
      label: t("Clear"),
      valign: Gtk89.Align.CENTER,
      css_classes: ["destructive-action"]
    });
    cacheBtn.connect("clicked", () => {
      this.clearCache();
    });
    this.add_suffix(cacheBtn);
    this.subtitle = this.buildSubtitle(this.getCacheInfo());
  }
  clearCache() {
    let en = null;
    try {
      const dir = Gio5.File.new_for_path(this._ownCacheDir);
      if (!dir.query_exists(null)) {
        return;
      }
      en = dir.enumerate_children("standard::name", Gio5.FileQueryInfoFlags.NONE, null);
      let fi;
      while ((fi = en.next_file(null)) !== null) {
        dir.get_child(fi.get_name()).delete(null);
      }
    } catch (error) {
      logError2(error);
    } finally {
      en == null ? void 0 : en.close(null);
    }
    this.subtitle = this.buildSubtitle(this.getCacheInfo());
  }
  getCacheInfo() {
    let en = null;
    try {
      const dir = Gio5.File.new_for_path(this._ownCacheDir);
      if (!dir.query_exists(null)) {
        return { count: 0, size: 0 };
      }
      en = dir.enumerate_children("standard::size", Gio5.FileQueryInfoFlags.NONE, null);
      let count = 0, size = 0, fi;
      while ((fi = en.next_file(null)) !== null) {
        count++;
        size += fi.get_size();
      }
      en.close(null);
      return { count, size };
    } catch (error) {
      logError2(error);
      return { count: 0, size: 0 };
    } finally {
      en == null ? void 0 : en.close(null);
    }
  }
  kiloPow(power) {
    return Math.pow(1024, power);
  }
  formatSize(size) {
    if (size < this.kiloPow(1)) {
      return `${size} B`;
    }
    if (size < this.kiloPow(2)) {
      return `${(size / this.kiloPow(1)).toFixed(1)} KB`;
    } else if (size < this.kiloPow(3)) {
      return `${(size / this.kiloPow(2)).toFixed(1)} MB`;
    } else {
      return `${(size / this.kiloPow(3)).toFixed(1)} GB`;
    }
  }
  buildSubtitle(info) {
    return `${info.count} ${t("covers cached")}  \u2014  ${this.formatSize(info.size)}`;
  }
};
GObject110.registerClass(_CacheRow);
var CacheRow = _CacheRow;

// src/ui/preferences/system-page/cache-group/index.ts
var _CacheGroup = class _CacheGroup extends Adw111.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const ownCacheDir = GLib5.build_filenamev([GLib5.get_user_cache_dir(), "music-pill", "art"]);
    const cacheRow = new CacheRow(ownCacheDir, {
      title: t("Album Art Cache")
    });
    this.add(cacheRow);
  }
};
GObject111.registerClass(_CacheGroup);
var CacheGroup = _CacheGroup;

// src/ui/preferences/system-page/danger-group/index.ts
import Adw113 from "gi://Adw";
import GObject113 from "gi://GObject";

// src/ui/preferences/system-page/danger-group/components/factory-reset-row.ts
import Adw112 from "gi://Adw";
import GObject112 from "gi://GObject";
import Gtk90 from "gi://Gtk";
var _FactoryResetRow = class _FactoryResetRow extends Adw112.ActionRow {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const resetBtn = new Gtk90.Button({
      label: t("Reset All"),
      valign: Gtk90.Align.CENTER,
      css_classes: ["destructive-action"]
    });
    resetBtn.connect("clicked", () => {
      for (const key of SettingsKeys) {
        settings.gioInternal.reset(key);
      }
    });
    this.add_suffix(resetBtn);
  }
};
GObject112.registerClass(_FactoryResetRow);
var FactoryResetRow = _FactoryResetRow;

// src/ui/preferences/system-page/danger-group/index.ts
var _DangerGroup = class _DangerGroup extends Adw113.PreferencesGroup {
  constructor(settings, properties, ...args) {
    super(properties, args);
    const factoryResetRow = new FactoryResetRow(settings, {
      title: t("Factory Reset")
    });
    this.add(factoryResetRow);
  }
};
GObject113.registerClass(_DangerGroup);
var DangerGroup = _DangerGroup;

// src/ui/preferences/system-page/index.ts
var _SystemPage = class _SystemPage extends Adw114.PreferencesPage {
  constructor(settings, mpris, properties, ...args) {
    super(properties, args);
    __publicField(this, "_isRefreshingPlayers", false);
    const systemGroup = new SystemGroup(settings, mpris, {
      title: t("System")
    });
    this.add(systemGroup);
    const mappingHelpGroup = new MappingHelpGroup(settings);
    this.add(mappingHelpGroup);
    const appMappingGroup = new AppMappingGroup({
      systemPage: this,
      settings,
      title: t("Saved App Mappings"),
      description: t("Edit the target App ID for manually mapped players, or remove them.")
    });
    this.add(appMappingGroup);
    const activePlayersGroup = new RunningPlayersGroup({
      systemPage: this,
      settings,
      mpris,
      title: t("Running Players Detection"),
      description: t("Click on a detected player to automatically fill the mapping.")
    });
    this.add(activePlayersGroup);
    const backupGroup = new BackupGroup(settings, {
      title: t("Backup & Restore")
    });
    this.add(backupGroup);
    const cacheGroup = new CacheGroup(settings, {
      title: t("Album Art Cache")
    });
    this.add(cacheGroup);
    const dangerGroup = new DangerGroup(settings, {
      title: t("Danger Zone")
    });
    this.add(dangerGroup);
  }
  get isRefreshingPlayers() {
    return this._isRefreshingPlayers;
  }
  set isRefreshingPlayers(isRefreshing) {
    this._isRefreshingPlayers = isRefreshing;
  }
};
GObject114.registerClass(_SystemPage);
var SystemPage = _SystemPage;

// src/ui/preferences/about-page/index.ts
import Adw116 from "gi://Adw";
import GObject116 from "gi://GObject";

// src/ui/preferences/about-page/components/whats-new/index.ts
import Adw115 from "gi://Adw";
import Gio6 from "gi://Gio";
import Gtk91 from "gi://Gtk";
import GLib6 from "gi://GLib";
import GObject115 from "gi://GObject";
var _WhatsNewGroup = class _WhatsNewGroup extends Adw115.PreferencesGroup {
  constructor(extensionDir, properties, ...args) {
    super(properties, args);
    __publicField(this, "extensionDir", extensionDir);
    try {
      const extensionDirPath = extensionDir.get_path();
      if (!extensionDirPath) {
        return;
      }
      const changelogPath = GLib6.build_filenamev([extensionDirPath, "changelog.json"]);
      const changelogFile = Gio6.File.new_for_path(changelogPath);
      if (!changelogFile.query_exists(null)) {
        return;
      }
      const [ok, changelogContent] = changelogFile.load_contents(null);
      if (!ok || changelogContent.length === 0) {
        return;
      }
      const decoder = new TextDecoder();
      const changelogContentString = decoder.decode(changelogContent);
      const changelog = JSON.parse(changelogContentString);
      for (const release of changelog) {
        const row = new Adw115.ExpanderRow({
          title: release.version,
          subtitle: release.subtitle,
          expanded: release.expanded
        });
        for (const section of release.sections) {
          const sectionRow = new Adw115.ExpanderRow({
            title: section.title,
            margin_top: 10,
            margin_bottom: 10,
            margin_start: 15,
            margin_end: 15
          });
          for (const item of section.items) {
            const itemRow = new Gtk91.Label({
              label: `\u2022 ${item}`,
              justify: Gtk91.Justification.LEFT,
              xalign: 0,
              margin_top: 5,
              wrap: true
            });
            sectionRow.add_row(itemRow);
          }
          row.add_row(sectionRow);
        }
        this.add(row);
      }
    } catch (error) {
      logError2(error);
    }
  }
};
GObject115.registerClass(_WhatsNewGroup);
var WhatsNewGroup = _WhatsNewGroup;

// src/ui/preferences/about-page/index.ts
var _AboutPage = class _AboutPage extends Adw116.PreferencesPage {
  constructor(prefs, properties, ...args) {
    super(properties, args);
    const whatsNewGroup = new WhatsNewGroup(prefs.dir, {
      title: t("What's New")
    });
    this.add(whatsNewGroup);
  }
};
GObject116.registerClass(_AboutPage);
var AboutPage = _AboutPage;

// src/utils/env.ts
import GLib7 from "gi://GLib";
import Gio7 from "gi://Gio";
function loadEnv() {
  try {
    const xdgRuntimeDir = GLib7.getenv("XDG_RUNTIME_DIR");
    if (!xdgRuntimeDir) {
      throw new Error("XDG_RUNTIME_DIR is not set");
    }
    const envPath = `${xdgRuntimeDir}/dynamic-music-pill.env`;
    if (!GLib7.file_test(envPath, GLib7.FileTest.EXISTS)) {
      logObject(process.env.NODE_ENV);
      return;
    }
    parseEnvFile(envPath);
  } catch (error) {
    logError(error);
  }
}
function parseEnvFile(envPath) {
  const file = Gio7.File.new_for_path(envPath);
  if (!file) {
    logInfo(`Failed to load env file: ${envPath}`);
    return;
  }
  const fileStream = file.read(null);
  const dataStream = new Gio7.DataInputStream({
    base_stream: fileStream,
    byte_order: Gio7.DataStreamByteOrder.BIG_ENDIAN
  });
  const encoder = new TextDecoder("utf-8");
  while (true) {
    const [buffer, length] = dataStream.read_line(null);
    if (buffer === null || length === 0) {
      break;
    }
    const line = encoder.decode(buffer).trim();
    if (line.startsWith("#") || line.length === 0) {
      continue;
    }
    const firstKeySeparatorIndex = line.indexOf("=");
    if (firstKeySeparatorIndex === -1) {
      continue;
    }
    const key = line.substring(0, firstKeySeparatorIndex);
    const value = line.substring(firstKeySeparatorIndex + 1);
    GLib7.setenv(key, value, true);
  }
  dataStream.close(null);
  fileStream.close(null);
}

// src/providers/mpris-provider/index.ts
import Gio9 from "gi://Gio";
import GObject118 from "gi://GObject";
import GLib9 from "gi://GLib";

// src/utils/development.ts
function getDBusSessionAddress() {
  const dbusParent = glib_2_default.getenv("DBUS_PARENT");
  if (dbusParent) {
    return dbusParent;
  }
  const address = glib_2_default.getenv("DBUS_SESSION_BUS_ADDRESS");
  if (address === null) {
    throw new Error("Failed to find the DBus address");
  }
  return address;
}

// src/providers/mpris-provider/media-player.ts
import Gio8 from "gi://Gio";
import GLib8 from "gi://GLib";
import GObject117 from "gi://GObject";

// src/utils/mapper.ts
function invokeMapper(mapper, key, value, parent) {
  const map9 = mapper[key];
  if (map9) {
    map9(parent, value);
  }
}
function mapObject(object, mapper, parent = {}) {
  for (let [key, value] of Object.entries(object)) {
    value = smartUnpack(value);
    if (!value) {
      continue;
    }
    if (typeof value === "object" && !Array.isArray(value)) {
      mapObject(value, mapper, parent);
      continue;
    }
    invokeMapper(mapper, key, value, parent);
  }
  return parent;
}
function checkChanged(oldValue, newValue, debug = false, tree = []) {
  if (oldValue === void 0 && newValue !== void 0) {
    if (debug) {
      logDebug(`Changed: ${tree.join(" -> ")} is undefined -> defined`);
    }
    return [true, [tree.join(" -> "), oldValue, newValue]];
  }
  if (oldValue !== void 0 && newValue === void 0) {
    if (debug) {
      logDebug(`Changed: ${tree.join(" -> ")} is defined -> undefined`);
    }
    return [true, [tree.join(" -> "), oldValue, newValue]];
  }
  for (let [key, value] of Object.entries(oldValue)) {
    const compareValue = newValue[key];
    const newTree = tree.concat([key]);
    const newTreeString = newTree.join(" -> ");
    if (debug) {
      logDebug(`Comparing: ${newTreeString} ${typeof value} -> ${typeof compareValue}`);
    }
    if (value === null && compareValue !== null) {
      if (debug) {
        logDebug(`Changed: ${newTreeString} value is null -> compareValue is not null`);
      }
      return [true, [newTreeString, value, compareValue]];
    }
    if (value !== null && compareValue === null) {
      if (debug) {
        logDebug(`Changed: ${newTreeString} value is not null -> compareValue is null`);
      }
      return [true, [newTreeString, value, compareValue]];
    }
    if (!Array.isArray(value)) {
      if (typeof value === "object") {
        const [changed, [objectPath, oldCheckValue, newCheckValue]] = checkChanged(value, compareValue, debug, newTree);
        if (changed) {
          if (debug) {
            logDebug(`Changed: ${objectPath} ${typeof oldCheckValue} -> ${typeof newCheckValue}`);
          }
          return [true, [objectPath, oldCheckValue, newCheckValue]];
        } else {
          if (debug) {
            logDebug(`Not changed: ${objectPath} ${typeof oldCheckValue} -> ${typeof newCheckValue}`);
          }
          return [false, [objectPath, oldCheckValue, newCheckValue]];
        }
      }
      if (compareValue !== value) {
        if (debug) {
          logDebug(`Changed: ${newTreeString} ${typeof value} -> ${typeof compareValue}`);
        }
        return [true, [newTreeString, value, compareValue]];
      }
    } else {
      if (!Array.isArray(compareValue)) {
        if (debug) {
          logDebug(`Changed: ${newTreeString} ${typeof value} -> ${typeof compareValue}`);
        }
        return [true, [newTreeString, value, compareValue]];
      }
      if (debug) {
        logDebug(`Comparing object array: ${newTreeString} ${typeof value} -> ${typeof compareValue}`);
      }
      return checkArrayChanged(value, compareValue, newTree, debug);
    }
  }
  if (Array.isArray(oldValue)) {
    if (!Array.isArray(newValue)) {
      if (debug) {
        logDebug(`Changed: ${tree.join(" -> ")} is array -> not array`);
      }
      return [true, [tree.join(" -> "), oldValue, newValue]];
    }
    if (debug) {
      logDebug(`Comparing array: ${tree.join(" -> ")} is array -> array`);
    }
    return checkArrayChanged(oldValue, newValue, tree, debug);
  }
  return [false, ["", void 0, void 0]];
}
function checkArrayChanged(oldValue, newValue, tree, debug = false) {
  if (debug) {
    logDebug(`Comparing array: ${tree.join(" -> ")} is array -> array`);
  }
  if (newValue.length != oldValue.length) {
    if (debug) {
      logDebug(`Changed: ${tree.join(" -> ")} size is different`);
    }
    return [true, [tree.join(" -> "), oldValue, newValue]];
  }
  for (let i = 0; i < newValue.length; i++) {
    const compareValue = newValue[i];
    const value = oldValue[i];
    if (compareValue === void 0 && value !== void 0) {
      if (debug) {
        logDebug(`Changed: ${tree.join(" -> ")}${i} is defined -> undefined`);
      }
      return [true, [tree.join(" -> "), oldValue, newValue]];
    }
    if (compareValue !== void 0 && value === void 0) {
      if (debug) {
        logDebug(`Changed: ${tree.join(" -> ")}${i} is undefined -> defined`);
      }
      return [true, [tree.join(" -> "), oldValue, newValue]];
    }
    if (debug) {
      logDebug(`Comparing: ${tree.join(" -> ")}${i} ${typeof value} -> ${typeof compareValue}`);
    }
    if (!Array.isArray(value)) {
      if (Array.isArray(compareValue)) {
        if (debug) {
          logDebug(`Changed: ${tree.join(" -> ")}${i} is array -> not array`);
        }
        return [true, [tree.join(" -> "), oldValue, newValue]];
      }
    }
    if (compareValue !== value) {
      if (debug) {
        logDebug(`Changed: ${tree.join(" -> ")}${i} is different`);
      }
      return [true, [tree.join(" -> "), oldValue, newValue]];
    }
  }
  return [false, ["", void 0, void 0]];
}

// src/providers/mpris-provider/maps/player-state-map.ts
var PlayerStateMap = {
  "PlaybackStatus": (s, v) => s.playbackStatus = v,
  "CanControl": (s, v) => s.canControl = v,
  "CanGoNext": (s, v) => s.canGoNext = v,
  "CanGoPrevious": (s, v) => s.canGoPrevious = v,
  "CanPause": (s, v) => s.canPause = v,
  "CanPlay": (s, v) => s.canPlay = v,
  "CanSeek": (s, v) => s.canSeek = v,
  "MaximumRate": (s, v) => s.maximumRate = v,
  "MinimumRate": (s, v) => s.minimumRate = v,
  "Volume": (s, v) => s.volume = v,
  "Position": (s, v) => s.position = v
};

// src/providers/mpris-provider/maps/track-info-map.ts
var TrackInfoMap = {
  "xesam:title": (t2, v) => t2.title = v,
  "xesam:artist": (t2, v) => t2.artist = v,
  "xesam:album": (t2, v) => t2.album = v,
  "mpris:artUrl": (t2, v) => t2.artUrl = v,
  "mpris:length": (t2, v) => t2.length = v,
  "mpris:trackid": (t2, v) => t2.trackId = v,
  "rate": (t2, v) => t2.rate = v
};

// src/providers/mpris-provider/media-player.ts
var DEFAULT_PLAYER_STATE = {
  playbackStatus: "Stopped",
  canControl: false,
  canGoNext: false,
  canGoPrevious: false,
  canPause: false,
  canPlay: false,
  canSeek: false,
  volume: 1,
  minimumRate: 1,
  maximumRate: 1,
  position: 0
};
var _MediaPlayer = class _MediaPlayer extends GObject117.Object {
  constructor(name, owner, mpris) {
    super();
    __publicField(this, "_name");
    __publicField(this, "_owner");
    __publicField(this, "_mpris");
    __publicField(this, "_connection");
    __publicField(this, "_playerPropertiesTimer", null);
    __publicField(this, "_state");
    logDebug(`Creating MediaPlayer for ${name}`);
    this._name = name;
    this._owner = owner;
    this._mpris = mpris;
    this._connection = mpris.getConnection();
    this._state = {
      player: __spreadValues({}, DEFAULT_PLAYER_STATE),
      trackInfo: void 0
    };
    this._playerPropertiesTimer = GLib8.timeout_add(GLib8.PRIORITY_DEFAULT, 1e3, this._playerTimerCallback.bind(this));
    this._mpris.emit("player-added", this._name, this);
  }
  getPlayerState() {
    if (this._connection === null) {
      return this._state;
    }
    const [result] = smartUnpack(this._connection.call_sync(
      this._name,
      MPRIS_OBJECT,
      "org.freedesktop.DBus.Properties",
      "GetAll",
      new GLib8.Variant("(s)", [MPRIS_INTERFACE]),
      null,
      Gio8.DBusCallFlags.NONE,
      -1,
      null
    ));
    if (!result) {
      return this._state;
    }
    const playerState = mapObject(result, PlayerStateMap);
    const trackInfo = mapObject(result, TrackInfoMap);
    const state = {
      player: playerState,
      trackInfo
    };
    return state;
  }
  getTrackInfo() {
    return this._state.trackInfo;
  }
  getPlayerInfo() {
    return this._state.player;
  }
  getName() {
    return this._name;
  }
  getOwner() {
    return this._owner;
  }
  removePlayer() {
    logDebug(`Removing MediaPlayer for ${this._name}`);
    this._mpris.emit("player-removed", this._name, this);
    if (this._playerPropertiesTimer !== null) {
      GLib8.source_remove(this._playerPropertiesTimer);
      this._playerPropertiesTimer = null;
    }
    this._state = {
      player: __spreadValues({}, DEFAULT_PLAYER_STATE),
      trackInfo: void 0
    };
  }
  _playerTimerCallback() {
    const newState = this.getPlayerState();
    const oldState = this._state;
    const [playerChanged, [playerPath, oldPlayerValue, newPlayerValue]] = checkChanged(oldState.player, newState.player);
    const [trackChanged, [trackPath, oldTrackValue, newTrackValue]] = checkChanged(oldState.trackInfo, newState.trackInfo);
    if (playerChanged) {
      this._state.player = newState.player;
      this._mpris.emit("player-state-changed", this._name, this);
      if (newState.player.playbackStatus !== oldState.player.playbackStatus) {
        this._mpris.emit("player-status-changed", this._name, newState.player.playbackStatus);
      }
    }
    if (trackChanged) {
      this._state.trackInfo = newState.trackInfo;
      this._mpris.emit("player-track-changed", this._name, this);
    }
    return GLib8.SOURCE_CONTINUE;
  }
};
GObject117.registerClass(_MediaPlayer);
var MediaPlayer = _MediaPlayer;

// src/providers/mpris-provider/index.ts
var flags = Gio9.DBusConnectionFlags.AUTHENTICATION_CLIENT | Gio9.DBusConnectionFlags.MESSAGE_BUS_CONNECTION;
var _MPRISProvider = class _MPRISProvider extends GObject118.Object {
  constructor() {
    super();
    __publicField(this, "_address", getDBusSessionAddress());
    __publicField(this, "_connection", null);
    __publicField(this, "_nameOwnerChangedSignal", null);
    __publicField(this, "_players", /* @__PURE__ */ new Map());
  }
  start() {
    logDebug(`Creating DBus connection for address: ${this._address}`);
    this._connection = Gio9.DBusConnection.new_for_address_sync(this._address, flags, null, null);
    this._nameOwnerChangedSignal = this._connection.signal_subscribe(
      "org.freedesktop.DBus",
      "org.freedesktop.DBus",
      "NameOwnerChanged",
      "/org/freedesktop/DBus",
      null,
      Gio9.DBusSignalFlags.NONE,
      this._nameOwnerChanged.bind(this)
    );
    const names = this.listPlayers();
    for (const name of names) {
      const owner = this.getPlayerOwner(name);
      if (!owner) {
        continue;
      }
      const player = new MediaPlayer(name, owner, this);
      this._players.set(owner, player);
    }
  }
  stop() {
    if (this._connection === null) {
      return;
    }
    for (const player of this._players.values()) {
      player.removePlayer();
    }
    this._players.clear();
    logDebug("Stopping DBus connection");
    if (this._nameOwnerChangedSignal !== null) {
      this._connection.signal_unsubscribe(this._nameOwnerChangedSignal);
      this._nameOwnerChangedSignal = null;
    }
    this._connection.close_sync(null);
    this._connection = null;
  }
  getConnection() {
    if (this._connection === null) {
      throw new Error("DBus connection not initialized");
    }
    return this._connection;
  }
  getPlayerOwner(name) {
    if (!this._connection) {
      return void 0;
    }
    logDebug(`Getting owner for player: ${name}`);
    const result = this._connection.call_sync(
      "org.freedesktop.DBus",
      "/org/freedesktop/DBus",
      "org.freedesktop.DBus",
      "GetNameOwner",
      new GLib9.Variant("(s)", [name]),
      null,
      Gio9.DBusCallFlags.NONE,
      -1,
      null
    );
    const [owner] = smartUnpack(result);
    return owner || void 0;
  }
  listPlayers() {
    if (this._connection === null) {
      return [];
    }
    const result = this._connection.call_sync(
      "org.freedesktop.DBus",
      "/org/freedesktop/DBus",
      "org.freedesktop.DBus",
      "ListNames",
      null,
      null,
      Gio9.DBusCallFlags.NONE,
      -1,
      null
    );
    const names = smartUnpack(result)[0];
    return names.filter((name) => name.startsWith(`${PLAYER_INTERFACE}.`));
  }
  getPlayer(name) {
    return this._players.get(name);
  }
  _nameOwnerChanged(connection, sender_name, object_path, interface_name, signal_name, parameters) {
    const [name, oldOwner, newOwner] = smartUnpack(parameters);
    if (!(name == null ? void 0 : name.startsWith(PLAYER_INTERFACE))) {
      return;
    }
    logDebug(`NameOwnerChanged: ${sender_name} ${object_path} ${interface_name} ${signal_name}`);
    logObject(parameters, { json: true });
    if (name === void 0 || oldOwner === void 0 || newOwner === void 0) {
      return;
    }
    if (oldOwner === newOwner || oldOwner.length === 0 && this._players.has(newOwner)) {
      return;
    }
    if (newOwner.length === 0 && this._players.has(oldOwner)) {
      const player = this._players.get(oldOwner);
      if (player) {
        player.removePlayer();
        this._players.delete(oldOwner);
      }
      return;
    }
    if (newOwner.length > 0 && !this._players.has(newOwner)) {
      const player = new MediaPlayer(name, newOwner, this);
      this._players.set(newOwner, player);
    }
  }
};
GObject118.registerClass({
  Signals: {
    "player-added": {
      param_types: [GObject118.TYPE_STRING, GObject118.TYPE_OBJECT]
    },
    "player-removed": {
      param_types: [GObject118.TYPE_STRING, GObject118.TYPE_OBJECT]
    },
    "player-status-changed": {
      param_types: [GObject118.TYPE_STRING, GObject118.TYPE_STRING]
    },
    "player-rate-changed": {
      param_types: [GObject118.TYPE_STRING, GObject118.TYPE_FLOAT]
    },
    "player-state-changed": {
      param_types: [GObject118.TYPE_STRING, GObject118.TYPE_OBJECT]
    },
    "player-track-changed": {
      param_types: [GObject118.TYPE_STRING, GObject118.TYPE_OBJECT]
    },
    "player-volume-changed": {
      param_types: [GObject118.TYPE_STRING, GObject118.TYPE_FLOAT]
    }
  }
}, _MPRISProvider);
var MPRISProvider = _MPRISProvider;

// src/prefs.ts
var DynamicMusicPillPrefs = class extends prefs_exports.ExtensionPreferences {
  static updateGroupVisibility(positioning) {
  }
  async fillPreferencesWindow(window) {
    window.search_enabled = true;
    pkg.initGettext();
    loadEnv();
    const settings = this.getSettings();
    const settingsProvider = createSettingsProvider(settings);
    const mpris = new MPRISProvider();
    mpris.start();
    window.connect("destroy", () => {
      mpris.stop();
    });
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
    const systemPage = new SystemPage(settingsProvider, mpris, {
      title: t("System & Reset"),
      icon_name: "utilities-terminal-symbolic"
    });
    window.add(systemPage);
    const aboutPage = new AboutPage(this, {
      title: t("About"),
      icon_name: "help-about-symbolic"
    });
    window.add(aboutPage);
  }
};
export {
  DynamicMusicPillPrefs as default
};
//# sourceMappingURL=prefs.js.map
