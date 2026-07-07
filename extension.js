var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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

// src/constants/mpris-constants.ts
var mpris_constants_exports = {};
__export(mpris_constants_exports, {
  DefaultTrackInfo: () => DefaultTrackInfo,
  MPRIS_INTERFACE: () => MPRIS_INTERFACE,
  MPRIS_OBJECT: () => MPRIS_OBJECT
});
var MPRIS_INTERFACE = "org.mpris.MediaPlayer2.Player";
var MPRIS_OBJECT = "/org/mpris/MediaPlayer2";
var DefaultTrackInfo = { length: 0, canGoNext: false, canGoPrevious: false, canPause: false, canPlay: false, canSeek: false, rate: 1 };

// src/constants/log-constants.ts
var log_constants_exports = {};
__export(log_constants_exports, {
  LOG_PREFIX: () => LOG_PREFIX
});
var LOG_PREFIX = "[DMP]";

// src/utils/log.ts
var PREFIX = log_constants_exports.LOG_PREFIX;
function logInfo(message) {
  console.log(`${PREFIX} ${message}`);
}
function logWarning(message) {
  console.warn(`${PREFIX} ${message}`);
}
function logDebug(message) {
  console.log(`${PREFIX} [DEBUG] ${message}`);
}
function logTrace(message) {
  console.trace(`${PREFIX} ${message}`);
}
function logObject(object) {
  if (object === null) {
    logTrace("Object is null");
    return;
  }
  if (object === void 0) {
    logTrace("Object is undefined");
    return;
  }
  let inspected = JSON.stringify(object, (key, value) => {
    if (value && value.deep_unpack) {
      return value.deep_unpack();
    }
    return value;
  });
  logInfo(`Inspecting object ${inspected}`);
}

// node_modules/.pnpm/@girs+glib-2.0@2.88.0-4.0.4/node_modules/@girs/glib-2.0/glib-2.0.js
import GLib from "gi://GLib?version=2.0";
var glib_2_0_default = GLib;

// node_modules/.pnpm/@girs+glib-2.0@2.88.0-4.0.4/node_modules/@girs/glib-2.0/index.js
var glib_2_default = glib_2_0_default;

// src/utils/development.ts
function isDevelopment() {
  const devMode = Number(glib_2_default.getenv("DEV_MODE"));
  return !!devMode && !isNaN(devMode) && devMode == 1;
}
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

// node_modules/.pnpm/@girs+gnome-shell@50.0.1/node_modules/@girs/gnome-shell/dist/extensions/extension.js
var extension_exports = {};
__reExport(extension_exports, extension_star);
import * as extension_star from "resource:///org/gnome/shell/extensions/extension.js";

// node_modules/.pnpm/@girs+gio-2.0@2.88.0-4.0.4/node_modules/@girs/gio-2.0/gio-2.0.js
import Gio from "gi://Gio?version=2.0";
var gio_2_0_default = Gio;

// node_modules/.pnpm/@girs+gio-2.0@2.88.0-4.0.4/node_modules/@girs/gio-2.0/index.js
var gio_2_default = gio_2_0_default;

// src/utils/packing.ts
function smartUnpack(object) {
  if (object === null || object === void 0) {
    return null;
  }
  if (object instanceof glib_2_default.Variant) {
    return object.deepUnpack();
  }
  if (Array.isArray(object)) {
    return object.map(smartUnpack);
  }
  return object;
}

// src/utils/mapper.ts
function invokeMapper(mapper, key, value, parent) {
  logInfo(`Mapping ${key}`);
  const map8 = mapper[key];
  if (map8) {
    map8(parent, value);
  } else {
    logDebug(`Map for key ${key} to type ${typeof parent} hasn't been found!`);
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

// src/providers/mpris-provider.ts
var MTRISMap = {
  "PlaybackStatus": (s, v) => s.playbackStatus = v,
  "xesam:title": (s, v) => s.title = v,
  "xesam:artist": (s, v) => s.artist = v,
  "xesam:album": (s, v) => s.album = v,
  "mpris:artUrl": (s, v) => s.artUrl = v,
  "mpris:length": (s, v) => s.length = v,
  "mpris:trackid": (s, v) => s.trackId = v,
  "CanPlay": (s, v) => s.canPlay = v,
  "CanPause": (s, v) => s.canPause = v,
  "CanSeek": (s, v) => s.canSeek = v,
  "CanGoNext": (s, v) => s.canGoNext = v,
  "CanGoPrevious": (s, v) => s.canGoPrevious = v,
  "Rate": (s, v) => s.rate = v
};
function createMPRISProvider() {
  const address = getDBusSessionAddress();
  let callbacks = /* @__PURE__ */ new Map();
  let connection = null;
  let signalId = null;
  let state = __spreadValues({}, DefaultTrackInfo);
  function signalEmit(conn, sender_name, object_path, interface_name, signal_name, parameters) {
    if (!object_path.startsWith(mpris_constants_exports.MPRIS_OBJECT)) {
      return;
    }
    const unpacked = parameters.deep_unpack();
    if (!Array.isArray(unpacked)) {
      return;
    }
    const [iface, changed] = unpacked;
    if (iface != mpris_constants_exports.MPRIS_INTERFACE) {
      return;
    }
    logObject(changed);
    state = mapObject(changed, MTRISMap, state);
    callbacks.forEach((c) => c(state));
  }
  function start() {
    logInfo("Creating DBus connection");
    connection = gio_2_default.DBusConnection.new_for_address_sync(
      address,
      gio_2_default.DBusConnectionFlags.AUTHENTICATION_CLIENT | gio_2_default.DBusConnectionFlags.MESSAGE_BUS_CONNECTION,
      null,
      null
    );
    logInfo("Subscribe signal PropertiesChanged");
    signalId = connection.signal_subscribe(
      null,
      "org.freedesktop.DBus.Properties",
      "PropertiesChanged",
      null,
      null,
      gio_2_default.DBusSignalFlags.NONE,
      signalEmit
    );
  }
  function stop() {
    if (connection && signalId !== null) {
      connection.signal_unsubscribe(signalId);
      connection.close_sync(null);
    }
    connection = null;
    signalId = null;
    callbacks.clear();
  }
  function addCallback(name, callback) {
    if (callbacks.has(name)) {
      logError(`Callback ${name} already exists!`);
      return;
    }
    callbacks.set(name, callback);
  }
  function removeCallback(name) {
    if (!callbacks.has(name)) {
      return false;
    }
    return callbacks.delete(name);
  }
  return { start, stop, addCallback, removeCallback };
}

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
    set(_, prop, value) {
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

// src/extension.ts
var instance = null;
function getAppContext() {
  if (instance === null) {
    throw new Error("getAppContext called before instance was created!");
  }
  return instance.context;
}
var DynamicMusicPillExtension = class extends extension_exports.Extension {
  /**
   * Creates a new instance of the DynamicMusicPillExtension
   * @param metadata Extension metadata
   */
  constructor(metadata) {
    super(metadata);
    /**
     * Application context containing references to key components
     */
    __publicField(this, "context");
    /**
     * MPRIS provider for music control
     */
    __publicField(this, "provider");
    /**
     * Settings provider for extension configuration
     */
    __publicField(this, "settings");
    instance = this;
    this.initTranslations("dynamic-music-pill");
    this.settings = createSettingsProvider(this.getSettings());
    this.provider = createMPRISProvider();
    this.provider.addCallback("first", (track) => {
      logInfo(`Chegou aqui ${JSON.stringify(track)}`);
    });
    this.context = {
      extension: this,
      settings: this.settings,
      mpris: this.provider
    };
  }
  /**
   * Enables the extension
   * Starts the MPRIS provider and logs information
   */
  enable() {
    logInfo("Extension enabled.");
    logInfo(isDevelopment() ? "Is Dev" : "Is Not Dev");
    this.provider.start();
  }
  /**
   * Disables the extension
   * Stops the MPRIS provider and logs a warning
   */
  disable() {
    this.provider.stop();
    logWarning("Extension disabled.");
  }
};
export {
  DynamicMusicPillExtension as default,
  getAppContext
};
//# sourceMappingURL=extension.js.map
