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

// src/utils/log.ts
import GLib2 from "gi://GLib";

// src/constants/mpris-constants.ts
var PLAYER_INTERFACE = "org.mpris.MediaPlayer2";
var MPRIS_INTERFACE = `${PLAYER_INTERFACE}.Player`;
var MPRIS_OBJECT = "/org/mpris/MediaPlayer2";
var DBUS_PROPERTIES_INTERFACE = "org.freedesktop.DBus.Properties";

// src/constants/log-constants.ts
var log_constants_exports = {};
__export(log_constants_exports, {
  LOG_PREFIX: () => LOG_PREFIX
});
var LOG_PREFIX = "[DMP]";

// src/constants/crossfade-art-constants.ts
var crossfade_art_constants_exports = {};
__export(crossfade_art_constants_exports, {
  DEFAULT_COLOR: () => DEFAULT_COLOR,
  EASE_DURATION: () => EASE_DURATION,
  EASE_OPACITY: () => EASE_OPACITY,
  EASE_OUT_DURATION: () => EASE_OUT_DURATION,
  RADIUS: () => RADIUS
});
var RADIUS = 10;
var DEFAULT_COLOR = "#000000";
var EASE_OPACITY = 255;
var EASE_DURATION = 1e3;
var EASE_OUT_DURATION = 300;

// node_modules/.pnpm/@girs+glib-2.0@2.88.0-4.0.4/node_modules/@girs/glib-2.0/glib-2.0.js
import GLib from "gi://GLib?version=2.0";
var glib_2_0_default = GLib;

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
var PREFIX = log_constants_exports.LOG_PREFIX;
function logInfo(message) {
  console.log(`${PREFIX} [INFO] ${message}`);
}
function logWarning(message) {
  console.warn(`${PREFIX} [WARNING] ${message}`);
}
function logDebug(message) {
  console.log(`${PREFIX} [DEBUG] ${message}`);
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
  if (object instanceof GLib2.Variant) {
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

// src/providers/settings-provider/utils.ts
import Gio from "gi://Gio";
function createSettingsMap(map9) {
  return map9;
}
function getSettingsKeys(map9) {
  return Object.values(map9).map((entry) => entry.key);
}
function createSettingsGroup(settings, map9) {
  const methods = {
    bind(prop, object, property, flags2 = Gio.SettingsBindFlags.DEFAULT) {
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
  selectedPlayerBus: {
    key: "selected-player-bus",
    default: ""
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

// src/utils/env.ts
import GLib3 from "gi://GLib";
import Gio2 from "gi://Gio";
function loadEnv() {
  try {
    const xdgRuntimeDir = GLib3.getenv("XDG_RUNTIME_DIR");
    if (!xdgRuntimeDir) {
      throw new Error("XDG_RUNTIME_DIR is not set");
    }
    const envPath = `${xdgRuntimeDir}/dynamic-music-pill.env`;
    if (!GLib3.file_test(envPath, GLib3.FileTest.EXISTS)) {
      logObject(process.env.NODE_ENV);
      return;
    }
    parseEnvFile(envPath);
  } catch (error) {
    logError(error);
  }
}
function parseEnvFile(envPath) {
  const file = Gio2.File.new_for_path(envPath);
  if (!file) {
    logInfo(`Failed to load env file: ${envPath}`);
    return;
  }
  const fileStream = file.read(null);
  const dataStream = new Gio2.DataInputStream({
    base_stream: fileStream,
    byte_order: Gio2.DataStreamByteOrder.BIG_ENDIAN
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
    GLib3.setenv(key, value, true);
  }
  dataStream.close(null);
  fileStream.close(null);
}

// src/providers/mpris-provider/index.ts
import Gio4 from "gi://Gio";
import GObject2 from "gi://GObject";
import GLib5 from "gi://GLib";

// src/providers/mpris-provider/media-player.ts
import Gio3 from "gi://Gio";
import GLib4 from "gi://GLib";
import GObject from "gi://GObject";

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
  "xesam:title": (t, v) => t.title = v,
  "xesam:artist": (t, v) => t.artist = v,
  "xesam:album": (t, v) => t.album = v,
  "mpris:artUrl": (t, v) => t.artUrl = v,
  "mpris:length": (t, v) => t.length = v,
  "mpris:trackid": (t, v) => t.trackId = v,
  "xesam:url": (t, v) => t.url = v,
  "rate": (t, v) => t.rate = v
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
var _MediaPlayer = class _MediaPlayer extends GObject.Object {
  constructor(busName, owner, mpris) {
    super();
    __publicField(this, "_busName");
    __publicField(this, "_owner");
    __publicField(this, "_mpris");
    __publicField(this, "_connection");
    __publicField(this, "_playerPropertiesTimer", null);
    __publicField(this, "_propertiesSignal", null);
    __publicField(this, "_state");
    __publicField(this, "_identity", null);
    __publicField(this, "_desktopEntry", null);
    __publicField(this, "_lastPlayingTime", 0);
    __publicField(this, "_lastSeen", Date.now());
    __publicField(this, "_lastTrackId", null);
    logDebug(`Creating MediaPlayer for ${busName}`);
    this._busName = busName;
    this._owner = owner;
    this._mpris = mpris;
    this._connection = mpris.getConnection();
    this._state = {
      player: __spreadValues({}, DEFAULT_PLAYER_STATE),
      trackInfo: void 0
    };
    this._fetchRootProperties();
    this._refreshState();
    this._propertiesSignal = this._connection.signal_subscribe(
      this._busName,
      DBUS_PROPERTIES_INTERFACE,
      "PropertiesChanged",
      MPRIS_OBJECT,
      null,
      Gio3.DBusSignalFlags.NONE,
      this._onPropertiesChanged.bind(this)
    );
    this._playerPropertiesTimer = GLib4.timeout_add(
      GLib4.PRIORITY_DEFAULT,
      5e3,
      this._fallbackPoll.bind(this)
    );
    this._mpris.emit("player-added", this._busName, this);
  }
  getDescriptor() {
    var _a, _b;
    return {
      busName: this._busName,
      identity: (_a = this._identity) != null ? _a : void 0,
      desktopEntry: (_b = this._desktopEntry) != null ? _b : void 0,
      lastPlayingTime: this._lastPlayingTime,
      lastSeen: this._lastSeen
    };
  }
  getPlayerState() {
    return this._state;
  }
  getTrackInfo() {
    return this._state.trackInfo;
  }
  getPlayerInfo() {
    return this._state.player;
  }
  getName() {
    return this._busName;
  }
  getBusName() {
    return this._busName;
  }
  getOwner() {
    return this._owner;
  }
  getIdentity() {
    return this._identity;
  }
  getDesktopEntry() {
    return this._desktopEntry;
  }
  getLastPlayingTime() {
    return this._lastPlayingTime;
  }
  playPause() {
    this._callPlayerMethod("PlayPause");
  }
  next() {
    this._callPlayerMethod("Next");
  }
  previous() {
    this._callPlayerMethod("Previous");
  }
  seek(offsetMicros) {
    this._connection.call_sync(
      this._busName,
      MPRIS_OBJECT,
      MPRIS_INTERFACE,
      "Seek",
      new GLib4.Variant("(x)", [offsetMicros]),
      null,
      Gio3.DBusCallFlags.NONE,
      -1,
      null
    );
  }
  setPosition(positionUs) {
    var _a;
    const trackId = ((_a = this._state.trackInfo) == null ? void 0 : _a.trackId) || "/org/mpris/MediaPlayer2/TrackList/NoTrack";
    this._connection.call_sync(
      this._busName,
      MPRIS_OBJECT,
      MPRIS_INTERFACE,
      "SetPosition",
      new GLib4.Variant("(ox)", [trackId, positionUs]),
      null,
      Gio3.DBusCallFlags.NONE,
      -1,
      null
    );
    this._state.player.position = positionUs;
  }
  raise() {
    this._connection.call_sync(
      this._busName,
      MPRIS_OBJECT,
      PLAYER_INTERFACE,
      "Raise",
      null,
      null,
      Gio3.DBusCallFlags.NONE,
      -1,
      null
    );
  }
  quit() {
    this._connection.call_sync(
      this._busName,
      MPRIS_OBJECT,
      PLAYER_INTERFACE,
      "Quit",
      null,
      null,
      Gio3.DBusCallFlags.NONE,
      -1,
      null
    );
  }
  removePlayer() {
    logDebug(`Removing MediaPlayer for ${this._busName}`);
    this._mpris.emit("player-removed", this._busName, this);
    if (this._propertiesSignal !== null) {
      this._connection.signal_unsubscribe(this._propertiesSignal);
      this._propertiesSignal = null;
    }
    if (this._playerPropertiesTimer !== null) {
      GLib4.source_remove(this._playerPropertiesTimer);
      this._playerPropertiesTimer = null;
    }
    this._state = {
      player: __spreadValues({}, DEFAULT_PLAYER_STATE),
      trackInfo: void 0
    };
  }
  _callPlayerMethod(method) {
    this._connection.call_sync(
      this._busName,
      MPRIS_OBJECT,
      MPRIS_INTERFACE,
      method,
      null,
      null,
      Gio3.DBusCallFlags.NONE,
      -1,
      null
    );
  }
  _fetchRootProperties() {
    try {
      const [result] = smartUnpack(this._connection.call_sync(
        this._busName,
        MPRIS_OBJECT,
        DBUS_PROPERTIES_INTERFACE,
        "GetAll",
        new GLib4.Variant("(s)", [PLAYER_INTERFACE]),
        null,
        Gio3.DBusCallFlags.NONE,
        -1,
        null
      ));
      if (!result) {
        return;
      }
      if (result["Identity"]) {
        this._identity = String(smartUnpack(result["Identity"]));
      }
      if (result["DesktopEntry"]) {
        this._desktopEntry = String(smartUnpack(result["DesktopEntry"]));
      }
    } catch (e) {
    }
  }
  _refreshState() {
    try {
      const newState = this._fetchPlayerState();
      this._applyState(newState);
    } catch (e) {
    }
  }
  _fetchPlayerState() {
    const [result] = smartUnpack(this._connection.call_sync(
      this._busName,
      MPRIS_OBJECT,
      DBUS_PROPERTIES_INTERFACE,
      "GetAll",
      new GLib4.Variant("(s)", [MPRIS_INTERFACE]),
      null,
      Gio3.DBusCallFlags.NONE,
      -1,
      null
    ));
    if (!result) {
      return this._state;
    }
    const playerState = mapObject(result, PlayerStateMap);
    const trackInfo = mapObject(result, TrackInfoMap);
    return { player: playerState, trackInfo };
  }
  _applyState(newState) {
    var _a, _b;
    const oldState = this._state;
    this._lastSeen = Date.now();
    if (newState.player.playbackStatus === "Playing") {
      this._lastPlayingTime = Date.now();
    }
    const trackId = (_b = (_a = newState.trackInfo) == null ? void 0 : _a.trackId) != null ? _b : null;
    if (trackId && trackId !== this._lastTrackId) {
      this._lastTrackId = trackId;
    }
    const [playerChanged] = checkChanged(oldState.player, newState.player);
    const [trackChanged] = checkChanged(oldState.trackInfo, newState.trackInfo);
    if (playerChanged) {
      this._state.player = newState.player;
      this._mpris.emit("player-state-changed", this._busName, this);
      if (newState.player.playbackStatus !== oldState.player.playbackStatus) {
        this._mpris.emit("player-status-changed", this._busName, newState.player.playbackStatus);
      }
    }
    if (trackChanged) {
      this._state.trackInfo = newState.trackInfo;
      this._mpris.emit("player-track-changed", this._busName, this);
    }
  }
  _onPropertiesChanged(_connection, _sender, _path, _iface, _signal, parameters) {
    const [iface, changed] = smartUnpack(parameters);
    if (iface !== MPRIS_INTERFACE || !changed) {
      return;
    }
    const merged = __spreadValues(__spreadValues({}, this._flattenState(this._state)), changed);
    const playerState = mapObject(merged, PlayerStateMap);
    const trackInfo = mapObject(merged, TrackInfoMap);
    this._applyState({ player: playerState, trackInfo });
  }
  _flattenState(state) {
    const flat = {
      PlaybackStatus: state.player.playbackStatus,
      CanControl: state.player.canControl,
      CanGoNext: state.player.canGoNext,
      CanGoPrevious: state.player.canGoPrevious,
      CanPause: state.player.canPause,
      CanPlay: state.player.canPlay,
      CanSeek: state.player.canSeek,
      Volume: state.player.volume,
      MinimumRate: state.player.minimumRate,
      MaximumRate: state.player.maximumRate,
      Position: state.player.position
    };
    if (state.trackInfo) {
      flat["xesam:title"] = state.trackInfo.title;
      flat["xesam:artist"] = state.trackInfo.artist;
      flat["xesam:album"] = state.trackInfo.album;
      flat["mpris:artUrl"] = state.trackInfo.artUrl;
      flat["mpris:length"] = state.trackInfo.length;
      flat["mpris:trackid"] = state.trackInfo.trackId;
    }
    return flat;
  }
  _fallbackPoll() {
    this._refreshState();
    return GLib4.SOURCE_CONTINUE;
  }
};
GObject.registerClass(_MediaPlayer);
var MediaPlayer = _MediaPlayer;

// src/providers/mpris-provider/player-filter.ts
function isPlayerAllowed(busName, system) {
  const mode = system.playerFilterMode;
  if (mode === 0) {
    return true;
  }
  const listStr = system.filteredPlayers.toLowerCase();
  const list = listStr.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
  if (list.length === 0) {
    return mode === 1;
  }
  const lowerName = busName.toLowerCase();
  const match = list.some((item) => lowerName.includes(item));
  if (mode === 1) {
    return !match;
  }
  if (mode === 2) {
    return match;
  }
  return true;
}

// src/providers/mpris-provider/index.ts
var flags = Gio4.DBusConnectionFlags.AUTHENTICATION_CLIENT | Gio4.DBusConnectionFlags.MESSAGE_BUS_CONNECTION;
var _MPRISProvider = class _MPRISProvider extends GObject2.Object {
  constructor() {
    super();
    __publicField(this, "_address", getDBusSessionAddress());
    __publicField(this, "_connection", null);
    __publicField(this, "_nameOwnerChangedSignal", null);
    /** keyed by MPRIS bus name */
    __publicField(this, "_players", /* @__PURE__ */ new Map());
    __publicField(this, "_systemSettings", null);
  }
  start(systemSettings) {
    this._systemSettings = systemSettings != null ? systemSettings : null;
    logDebug(`Creating DBus connection for address: ${this._address}`);
    this._connection = Gio4.DBusConnection.new_for_address_sync(this._address, flags, null, null);
    this._nameOwnerChangedSignal = this._connection.signal_subscribe(
      "org.freedesktop.DBus",
      "org.freedesktop.DBus",
      "NameOwnerChanged",
      "/org/freedesktop/DBus",
      null,
      Gio4.DBusSignalFlags.NONE,
      this._nameOwnerChanged.bind(this)
    );
    this.rescan();
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
    this._systemSettings = null;
  }
  setSystemSettings(systemSettings) {
    this._systemSettings = systemSettings;
  }
  getConnection() {
    if (this._connection === null) {
      throw new Error("DBus connection not initialized");
    }
    return this._connection;
  }
  getPlayer(busName) {
    return this._players.get(busName);
  }
  getPlayers() {
    return Array.from(this._players.values());
  }
  getPlayerBusNames() {
    return Array.from(this._players.keys());
  }
  rescan() {
    if (this._connection === null) {
      return;
    }
    const names = this.listPlayers().filter((name) => this._shouldAllow(name));
    let changed = false;
    for (const name of names) {
      if (!this._players.has(name)) {
        const owner = this.getPlayerOwner(name);
        if (!owner) {
          continue;
        }
        this._players.set(name, new MediaPlayer(name, owner, this));
        changed = true;
      }
    }
    for (const busName of [...this._players.keys()]) {
      if (!names.includes(busName)) {
        const player = this._players.get(busName);
        player == null ? void 0 : player.removePlayer();
        this._players.delete(busName);
        changed = true;
      }
    }
    if (changed) {
      logDebug(`MPRIS rescan: ${this._players.size} player(s)`);
    }
  }
  getPlayerOwner(name) {
    if (!this._connection) {
      return void 0;
    }
    try {
      const result = this._connection.call_sync(
        "org.freedesktop.DBus",
        "/org/freedesktop/DBus",
        "org.freedesktop.DBus",
        "GetNameOwner",
        new GLib5.Variant("(s)", [name]),
        null,
        Gio4.DBusCallFlags.NONE,
        -1,
        null
      );
      const [owner] = smartUnpack(result);
      return owner || void 0;
    } catch (e) {
      return void 0;
    }
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
      Gio4.DBusCallFlags.NONE,
      -1,
      null
    );
    const names = smartUnpack(result)[0];
    return names.filter((name) => name.startsWith(`${PLAYER_INTERFACE}.`));
  }
  _shouldAllow(busName) {
    if (!this._systemSettings) {
      return true;
    }
    return isPlayerAllowed(busName, this._systemSettings);
  }
  _nameOwnerChanged(_connection, sender_name, object_path, interface_name, signal_name, parameters) {
    const [name, oldOwner, newOwner] = smartUnpack(parameters);
    if (!(name == null ? void 0 : name.startsWith(PLAYER_INTERFACE))) {
      return;
    }
    logDebug(`NameOwnerChanged: ${sender_name} ${object_path} ${interface_name} ${signal_name}`);
    logObject(parameters, { json: true });
    if (name === void 0 || oldOwner === void 0 || newOwner === void 0) {
      return;
    }
    if (newOwner.length === 0 && this._players.has(name)) {
      const player = this._players.get(name);
      player == null ? void 0 : player.removePlayer();
      this._players.delete(name);
      return;
    }
    if (newOwner.length > 0 && !this._players.has(name) && this._shouldAllow(name)) {
      this._players.set(name, new MediaPlayer(name, newOwner, this));
      return;
    }
    this.rescan();
  }
};
GObject2.registerClass({
  Signals: {
    "player-added": {
      param_types: [GObject2.TYPE_STRING, GObject2.TYPE_OBJECT]
    },
    "player-removed": {
      param_types: [GObject2.TYPE_STRING, GObject2.TYPE_OBJECT]
    },
    "player-status-changed": {
      param_types: [GObject2.TYPE_STRING, GObject2.TYPE_STRING]
    },
    "player-rate-changed": {
      param_types: [GObject2.TYPE_STRING, GObject2.TYPE_FLOAT]
    },
    "player-state-changed": {
      param_types: [GObject2.TYPE_STRING, GObject2.TYPE_OBJECT]
    },
    "player-track-changed": {
      param_types: [GObject2.TYPE_STRING, GObject2.TYPE_OBJECT]
    },
    "player-volume-changed": {
      param_types: [GObject2.TYPE_STRING, GObject2.TYPE_FLOAT]
    }
  }
}, _MPRISProvider);
var MPRISProvider = _MPRISProvider;

// src/controllers/music-controller.ts
import GLib12 from "gi://GLib";
import * as Main5 from "resource:///org/gnome/shell/ui/main.js";

// src/controllers/active-player.ts
var BROWSER_PATTERN = /chrome|chromium|firefox|brave|edge|opera/;
function getActivePlayer(ctx) {
  const { settings, players, lastActionTime, lastWinnerName } = ctx;
  if (players.length === 0) {
    return null;
  }
  const manualBus = settings.popup.selectedPlayerBus;
  if (manualBus && manualBus !== "") {
    const manual = players.find((p) => p.getBusName() === manualBus);
    if (manual) {
      return manual;
    }
  }
  const now = Date.now();
  if (now - lastActionTime < 3e3 && lastWinnerName) {
    const locked = players.find((p) => p.getBusName() === lastWinnerName);
    if (locked) {
      return locked;
    }
  }
  const filterMode = settings.system.playerFilterMode;
  const filterList = settings.system.filteredPlayers.toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
  const scored = players.map((player) => {
    var _a;
    let score = 0;
    const status = player.getPlayerInfo().playbackStatus;
    const track = player.getTrackInfo();
    if (track == null ? void 0 : track.title) {
      const trackUrl = (_a = track.url) != null ? _a : "";
      const isWeb = trackUrl.startsWith("http://") || trackUrl.startsWith("https://");
      if (isWeb && filterMode === 2) {
        const urlMatch = filterList.some((item) => trackUrl.includes(item));
        if (!urlMatch) {
          return { player, score: -1 };
        }
      }
    }
    const hasTitle = !!(track == null ? void 0 : track.title);
    if (status === "Playing" && hasTitle) {
      score = 500;
    } else if (status === "Paused" && hasTitle) {
      score = 100;
    }
    if (score === 0 && isBrowserBus(player.getBusName())) {
      score = -10;
    }
    return { player, score };
  });
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.player.getLastPlayingTime() - a.player.getLastPlayingTime();
  });
  if (scored.length === 0 || scored[0].score < 0) {
    return null;
  }
  let winner = scored[0].player;
  if (winner.getPlayerInfo().playbackStatus !== "Playing") {
    const anyPlaying = scored.find(
      (s) => {
        var _a;
        return s.score > 0 && s.player.getPlayerInfo().playbackStatus === "Playing" && !!((_a = s.player.getTrackInfo()) == null ? void 0 : _a.title);
      }
    );
    if (anyPlaying) {
      winner = anyPlaying.player;
    }
  }
  return winner;
}
function resolveDisplayTrack(player, cached) {
  var _a, _b, _c, _d;
  const track = player.getTrackInfo();
  const busName = player.getBusName();
  const status = player.getPlayerInfo().playbackStatus;
  let title = track == null ? void 0 : track.title;
  let artist = formatArtist(track == null ? void 0 : track.artist);
  let artUrl = track == null ? void 0 : track.artUrl;
  if (!title && cached && cached.busName === busName && status !== "Stopped") {
    title = cached.title;
    artist = (_a = cached.artist) != null ? _a : artist;
    artUrl = (_b = cached.artUrl) != null ? _b : artUrl;
  }
  if (!title) {
    title = void 0;
    artist = void 0;
  }
  return {
    busName,
    title,
    artist,
    artUrl,
    url: (_d = (_c = player.getTrackInfo()) == null ? void 0 : _c.url) != null ? _d : ""
  };
}
function formatArtist(artist) {
  if (!artist || artist.length === 0) {
    return void 0;
  }
  return artist.map((a) => smartUnpack(a)).join(", ");
}
function isBrowserBus(busName) {
  const short = busName.replace("org.mpris.MediaPlayer2.", "").split(".")[0].toLowerCase();
  return BROWSER_PATTERN.test(short);
}

// src/ui/music-pill/index.ts
import GObject9 from "gi://GObject";
import St5 from "gi://St";
import Clutter5 from "gi://Clutter";
import GLib9 from "gi://GLib";

// node_modules/.pnpm/@girs+st-18@18.0.0-4.0.4/node_modules/@girs/st-18/st-18.js
import St from "gi://St?version=18";
var st_18_default = St;

// src/components/crossfade-art.ts
import GObject3 from "gi://GObject";

// node_modules/.pnpm/@girs+clutter-18@18.0.0-4.0.4/node_modules/@girs/clutter-18/clutter-18.js
import Clutter from "gi://Clutter?version=18";
var clutter_18_default = Clutter;

// src/components/crossfade-art.ts
var _CrossfadeArt = class _CrossfadeArt extends st_18_default.Widget {
  constructor(properties, ...args) {
    super(properties, args);
    __publicField(this, "_radius", crossfade_art_constants_exports.RADIUS);
    __publicField(this, "_shadowCSS", "box-shadow: none;");
    __publicField(this, "_lastCSS");
    __publicField(this, "_currentUrl");
    __publicField(this, "_bgUrl");
    this.layoutManager = new clutter_18_default.BinLayout();
    this.set_style_class_name("art-widget");
    this.set_clip_to_allocation(false);
    this.set_x_expand(false);
    this.set_y_expand(false);
  }
  _updateContainerStyle() {
    this.setRadius(this._radius);
    let hasArt = !!this._currentUrl && this._currentUrl.length > 0;
    let activeShadow = hasArt ? this._shadowCSS : "box-shadow: none;";
    let bgColor = hasArt ? `background-color: ${crossfade_art_constants_exports.DEFAULT_COLOR};` : "background-color: transparent;";
    this.set_style(`${activeShadow} ${bgColor}`);
  }
  _refreshLayerStyle(layer) {
    if (!layer || !layer.get_parent()) return;
    let bgCSS = layer._bgUrl ? `background-image: ("${layer._bgUrl}");` : "";
    let radius = this.getRadius();
    let radiusCSS = `border-radius: ${radius}px; background-size: cover; box-shadow: none; `;
    let fullCSS = bgCSS + radiusCSS;
    if (fullCSS === layer._lastCSS) {
      return;
    }
    layer._lastCSS = fullCSS;
    layer.set_style(fullCSS);
  }
  getRadius() {
    return isNaN(this._radius) ? crossfade_art_constants_exports.RADIUS : this._radius;
  }
  setRadius(radius) {
    this._radius = isNaN(radius) ? crossfade_art_constants_exports.RADIUS : radius;
    this.set_style(`border-radius: ${radius}px; ${this._shadowCSS}`);
    const actors = this.get_children().filter((c) => c instanceof _CrossfadeArt);
    actors.forEach((c) => c._refreshLayerStyle(c));
  }
  setShadowStyle(cssString) {
    this._shadowCSS = cssString;
    this._updateContainerStyle();
    const actors = this.get_children().filter((c) => c instanceof _CrossfadeArt);
    actors.forEach((a) => a._refreshLayerStyle(a));
  }
  setArt(newUrl, force = false) {
    let children = this.get_children().filter((c) => c instanceof _CrossfadeArt && c._bgUrl === newUrl);
    if (children.length > 0) {
      return;
    }
    this._currentUrl = newUrl;
    this._updateContainerStyle();
    children.forEach((c) => c.remove_all_transitions());
    let newLayer = new _CrossfadeArt({
      x_expand: true,
      y_expand: true,
      opacity: 0
    });
    newLayer._bgUrl = newUrl;
    this.add_child(newLayer);
    this._refreshLayerStyle(newLayer);
    newLayer.ease({
      opacity: 255,
      duration: 1e3,
      mode: clutter_18_default.AnimationMode.EASE_OUT_QUAD,
      onStopped: (isFinished) => {
        if (!isFinished) return;
        newLayer.opacity = 255;
        let currentChildren = this.get_children();
        let layerIndex = currentChildren.indexOf(newLayer);
        if (layerIndex > 0) {
          for (let i = 0; i < layerIndex; i++) {
            let oldLayer = currentChildren[i];
            oldLayer.ease({
              opacity: 0,
              duration: 300,
              mode: clutter_18_default.AnimationMode.EASE_OUT_QUAD,
              onStopped: () => oldLayer.destroy()
            });
          }
        }
      }
    });
  }
};
GObject3.registerClass(_CrossfadeArt);
var CrossfadeArt = _CrossfadeArt;

// src/components/pixel-snapped-box.ts
import GObject4 from "gi://GObject";
var _PixelSnappedBox = class _PixelSnappedBox extends st_18_default.BoxLayout {
  vfunc_allocate(box) {
    box.x1 = Math.round(box.x1);
    box.x2 = Math.round(box.x2);
    box.y1 = Math.round(box.y1);
    box.y2 = Math.round(box.y2);
    super.vfunc_allocate(box);
  }
};
GObject4.registerClass(_PixelSnappedBox);
var PixelSnappedBox = _PixelSnappedBox;

// src/ui/music-pill/components/text-block/index.ts
import St2 from "gi://St";
import Clutter2 from "gi://Clutter";

// node_modules/.pnpm/@girs+gobject-2.0@2.88.0-4.0.4/node_modules/@girs/gobject-2.0/gobject-2.0.js
import GObject5 from "gi://GObject?version=2.0";
var gobject_2_0_default = GObject5;

// src/components/scroll-label.ts
import Pango from "gi://Pango";
import GLib7 from "gi://GLib";

// src/components/effects/text-fade-effect.ts
import GObject6 from "gi://GObject";
import GLib6 from "gi://GLib";
var textFadeEffectShaderSource = `
    uniform sampler2D tex;
    uniform float width;
    uniform float fade_pixels;
    uniform float enable_left;
    uniform float enable_right;

    void main(void) {
        vec2 uv = cogl_tex_coord_in[0].xy;
        vec4 color = texture2D(tex, uv);

        float left_alpha = mix(1.0, left_fade, enable_left);
        float right_alpha = mix(1.0, right_fade, enable_right);

        float alpha = min(left_alpha, right_alpha);
        cogl_color_out = vec4(color.rgb * alpha, color.a * alpha) * cogl_color_in;
    }
`;
var _TextFadeEffect = class _TextFadeEffect extends clutter_18_default.ShaderEffect {
  constructor(fadePixels = 32, properties, ...args) {
    super(__spreadValues({
      shader_type: 1
    }, properties), args);
    __publicField(this, "_fadePixels", 32);
    __publicField(this, "_enableLeft", 0);
    __publicField(this, "_enableRight", 1);
    __publicField(this, "_animId", null);
    this._fadePixels = fadePixels;
    this.set_shader_source(textFadeEffectShaderSource);
  }
  setFadePixels(pixels) {
    this._fadePixels = pixels;
  }
  setEdges(left = true, right = true, animate = false) {
    let targetLeft = left ? 1 : 0;
    let targetRight = right ? 1 : 0;
    if (this._animId) {
      GLib6.Source.remove(this._animId);
      this._animId = null;
    }
    if (!animate) {
      this._enableLeft = targetLeft;
      this._enableRight = targetRight;
      let actor = this.get_actor();
      if (actor) {
        actor.queue_redraw();
      }
      return;
    }
    let startLeft = this._enableLeft;
    let startRight = this._enableRight;
    let startTime = Date.now();
    let duration = 300;
    this._animId = GLib6.timeout_add(GLib6.PRIORITY_DEFAULT, 16, () => {
      let actor = this.get_actor();
      if (!actor) {
        this._animId = null;
        return GLib6.SOURCE_REMOVE;
      }
      let now = Date.now();
      let p = Math.min(1, (now - startTime) / duration);
      let t = p * (2 - p);
      this._enableLeft = startLeft + (targetLeft - startLeft) * t;
      this._enableRight = startRight + (targetRight - startRight) * t;
      actor.queue_redraw();
      if (p >= 1) {
        this._animId = null;
        return GLib6.SOURCE_REMOVE;
      }
      return GLib6.SOURCE_CONTINUE;
    });
  }
  vfunc_paint_target(node, paint_context) {
    let actor = this.get_actor();
    if (!actor) {
      return;
    }
    let widthVal = new GObject6.Value();
    widthVal.init(GObject6.TYPE_FLOAT);
    widthVal.set_float(actor.get_width());
    this.set_uniform_value("width", widthVal);
    let fadeVal = new GObject6.Value();
    fadeVal.init(GObject6.TYPE_FLOAT);
    fadeVal.set_float(this._fadePixels);
    this.set_uniform_value("fade_pixels", fadeVal);
    let leftVal = new GObject6.Value();
    leftVal.init(GObject6.TYPE_FLOAT);
    leftVal.set_float(this._enableLeft);
    this.set_uniform_value("enable_left", leftVal);
    let rightVal = new GObject6.Value();
    rightVal.init(GObject6.TYPE_FLOAT);
    rightVal.set_float(this._enableRight);
    this.set_uniform_value("enable_right", rightVal);
    super.vfunc_paint_target(node, paint_context);
  }
};
GObject6.registerClass(_TextFadeEffect);
var TextFadeEffect = _TextFadeEffect;

// src/components/scroll-label.ts
var _ScrollLabel = class _ScrollLabel extends st_18_default.Widget {
  constructor(styleClass, properties, ...args) {
    super(properties, args);
    __publicField(this, "_appContext");
    __publicField(this, "_text", "");
    __publicField(this, "_gameMode", false);
    __publicField(this, "_playerPaused", false);
    __publicField(this, "_paused", false);
    __publicField(this, "_isScrolling", false);
    __publicField(this, "_hoverOnly", false);
    __publicField(this, "_hovered", false);
    __publicField(this, "_forceScroll", false);
    __publicField(this, "_pendingScrollStop", false);
    __publicField(this, "_lyricTime", 0);
    __publicField(this, "_container");
    __publicField(this, "_label1");
    __publicField(this, "_label2");
    __publicField(this, "_separator");
    __publicField(this, "_fadeEffect", null);
    __publicField(this, "_fadeEffectAttached", false);
    __publicField(this, "_resizeTimer", null);
    __publicField(this, "_measureTimeout", null);
    __publicField(this, "_idleResizeId", null);
    __publicField(this, "_ignoreResizeUntil", 0);
    __publicField(this, "_isFinalized", false);
    __publicField(this, "_lyricFinished", false);
    __publicField(this, "_scrollTimer", null);
    this.layoutManager = new clutter_18_default.BinLayout();
    this.set_x_expand(true);
    this.set_y_expand(false);
    this.set_clip_to_allocation(true);
    this._appContext = getAppContext();
    const { scrollControls } = this._appContext.settings;
    this._hoverOnly = scrollControls.onHoverOnly;
    this._container = new PixelSnappedBox({
      x_expand: true,
      y_expand: true,
      x_align: clutter_18_default.ActorAlign.CENTER,
      y_align: clutter_18_default.ActorAlign.CENTER,
      orientation: clutter_18_default.Orientation.HORIZONTAL
    });
    this.add_child(this._container);
    this._label1 = new st_18_default.Label({
      style_class: styleClass,
      y_align: clutter_18_default.ActorAlign.CENTER
    });
    this._label1.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
    this._label1.clutter_text.line_wrap = false;
    this._label2 = new st_18_default.Label({
      style_class: styleClass,
      y_align: clutter_18_default.ActorAlign.CENTER
    });
    this._label2.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
    this._label2.clutter_text.line_wrap = false;
    this._separator = new st_18_default.Widget({ width: 30 });
    this._container.add_child(this._label1);
    this._container.add_child(this._separator);
    this._container.add_child(this._label2);
    scrollControls.connect("changed::scroll-text", () => {
      this.setText(this._text, true);
    });
    scrollControls.connect("changed::scroll-on-hover-only", () => {
      this._hoverOnly = scrollControls.onHoverOnly;
      if (this._hoverOnly && !this._hovered)
        this._stopAnimation();
      else
        this.setText(this._text, true);
    });
    scrollControls.connect("changed::freeze-scroll-on-pause", () => {
      this._updatePausedState();
    });
    scrollControls.connect("notify::allocation", () => {
      if (this._resizeTimer) {
        GLib7.Source.remove(this._resizeTimer);
      }
      this._resizeTimer = GLib7.timeout_add(GLib7.PRIORITY_DEFAULT, 100, () => {
        this._resizeTimer = null;
        if (this.has_allocation()) {
          this._checkResize();
        }
        return GLib7.SOURCE_REMOVE;
      });
    });
    this.connect("destroy", this._cleanup.bind(this));
  }
  vfunc_get_preferred_width(forHeight) {
    if (this._label1) {
      let [minW, natW] = this._label1.get_preferred_width(forHeight);
      return [0, natW];
    }
    return super.vfunc_get_preferred_width(forHeight);
  }
  setLabelStyle(css) {
    if (this._label1) {
      this._label1.set_style(css);
    }
    if (this._label2) {
      this._label2.set_style(css);
    }
  }
  _setFadeOutEffect(enableLeft = true, enableRight = true, animate = false) {
    if (!this._label1) {
      return;
    }
    let fontDesc = this._label1.get_theme_node().get_font();
    let fadeWidth = fontDesc.get_size() / Pango.SCALE * 4;
    if (!this._fadeEffect) {
      this._fadeEffect = new TextFadeEffect(fadeWidth);
      this.add_effect(this._fadeEffect);
    } else if (!this._fadeEffectAttached) {
      this.add_effect(this._fadeEffect);
    }
    this._fadeEffectAttached = true;
    this._fadeEffect.setFadePixels(fadeWidth);
    this._fadeEffect.setEdges(enableLeft, enableRight, animate);
  }
  _clearFadeOutEffect() {
    if (!this._fadeEffect || !this._fadeEffectAttached) {
      return;
    }
    this._fadeEffect.setEdges(false, false, false);
    this.remove_effect(this._fadeEffect);
    this._fadeEffectAttached = false;
  }
  _cleanup() {
    this._stopAnimation();
    if (this._fadeEffect) {
      if (this._fadeEffectAttached) {
        this.remove_effect(this._fadeEffect);
      }
      this._fadeEffect = null;
      this._fadeEffectAttached = false;
    }
    this._cleanupTimers();
  }
  _cleanupTimers() {
    if (this._resizeTimer) {
      GLib7.Source.remove(this._resizeTimer);
      this._resizeTimer = null;
    }
    if (this._measureTimeout) {
      GLib7.Source.remove(this._measureTimeout);
      this._measureTimeout = null;
    }
    if (this._idleResizeId) {
      GLib7.Source.remove(this._idleResizeId);
      this._idleResizeId = null;
    }
  }
  setGameMode(active) {
    this._gameMode = active;
    if (active) {
      this._stopAnimation();
    } else {
      this._checkResize();
    }
  }
  setPlayerPaused(isPaused) {
    this._playerPaused = isPaused;
    this._updatePausedState();
  }
  _updatePausedState() {
    let shouldPause = this._playerPaused && this._appContext.settings.scrollControls.freezeOnPause;
    if (shouldPause) {
      if (this._paused) {
        return;
      }
      this._cleanupTimers();
      this._stopAnimation(true);
    } else if (this._paused) {
      this._paused = false;
      this._checkResize();
    }
  }
  setHoverMode(hovered) {
    this._hovered = hovered;
    if (!this._hoverOnly) {
      return;
    }
    if (this._hovered) {
      this._checkResize();
      return;
    }
    if (this._lyricTime > 0) {
      return;
    }
    if (this._forceScroll) {
      return;
    }
    if (this._isScrolling) {
      this._pendingScrollStop = true;
    } else {
      this._stopAnimation(true);
      this._container.x_align = clutter_18_default.ActorAlign.CENTER;
      this._label2.hide();
      this._separator.hide();
    }
  }
  setForceScroll(force) {
    this._forceScroll = force;
    if (force) {
      this._checkResize();
    }
  }
  setPendingScrollStop(stop) {
    this._pendingScrollStop = stop;
  }
  _checkResize() {
    if (!this._text || this._gameMode || this._paused) {
      return;
    }
    if (this._ignoreResizeUntil && Date.now() < this._ignoreResizeUntil) {
      return;
    }
    if (this._idleResizeId) {
      GLib7.Source.remove(this._idleResizeId);
      this._idleResizeId = null;
    }
    this._idleResizeId = GLib7.idle_add(GLib7.PRIORITY_DEFAULT, () => {
      if (!this) {
        return GLib7.SOURCE_REMOVE;
      }
      this._idleResizeId = null;
      if (this._isFinalized || !this.get_parent()) {
        return GLib7.SOURCE_REMOVE;
      }
      if (this._lyricFinished) {
        return GLib7.SOURCE_REMOVE;
      }
      let boxWidth = this.get_allocation_box().get_width();
      if (boxWidth <= 1) {
        return GLib7.SOURCE_REMOVE;
      }
      this._label1.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
      let textWidth = this._label1.get_preferred_width(-1)[1] || 0;
      let needsScroll = textWidth > boxWidth + 5 && this._appContext.settings.scrollControls.scrollText || this._lyricTime > 0;
      let isScrolling = this._scrollTimer != null || this._isScrolling;
      if (needsScroll && !isScrolling) {
        this._container.x_align = clutter_18_default.ActorAlign.START;
        if (this._lyricTime > 0) {
          this._startLyricScroll(textWidth);
        } else if (!this._hoverOnly || this._hovered || this._forceScroll) {
          this._startInfiniteScroll(textWidth);
        }
      } else if (!needsScroll && isScrolling) {
        this._stopAnimation(true);
        this._container.x_align = clutter_18_default.ActorAlign.CENTER;
        this._label2.hide();
        this._separator.hide();
      } else if (!needsScroll) {
        this._stopAnimation(true);
        this._container.x_align = clutter_18_default.ActorAlign.CENTER;
      }
      return GLib7.SOURCE_REMOVE;
    });
  }
  setText(text, force = false, lyricTime = 0) {
    if (!force && this._text === text) {
      return;
    }
    const { scrollControls, lyrics, pill } = this._appContext.settings;
    this._text = text || "";
    this._lyricTime = lyricTime;
    this._lyricFinished = false;
    this._stopAnimation(true);
    this._container.x_align = clutter_18_default.ActorAlign.CENTER;
    this._label1.text = this._text;
    this._label2.text = this._text;
    this._label2.hide();
    this._separator.hide();
    this._label1.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
    this._label1.remove_transition("opacity");
    let isLyric = lyricTime > 0;
    let lyricFadeEnabled = lyrics.fade;
    if (!isLyric || isLyric && lyricFadeEnabled) {
      let duration = isLyric ? lyrics.fadeDuration : 300;
      this._label1.opacity = 0;
      this._label1.ease({
        opacity: 255,
        duration,
        mode: clutter_18_default.AnimationMode.EASE_OUT_QUAD
      });
    } else {
      this._label1.opacity = 255;
    }
    if (!scrollControls.scrollText && !this._lyricTime || this._paused) {
      return;
    }
    if (pill.dynamicWidth) {
      this._ignoreResizeUntil = Date.now() + 450;
    }
    let delay = pill.dynamicWidth ? 450 : 100;
    if (this._measureTimeout) {
      GLib7.Source.remove(this._measureTimeout);
      this._measureTimeout = null;
    }
    this._measureTimeout = GLib7.timeout_add(GLib7.PRIORITY_DEFAULT, delay, () => {
      this._measureTimeout = null;
      if (this.has_allocation()) {
        this._checkOverflow();
      }
      return GLib7.SOURCE_REMOVE;
    });
  }
  _stopAnimation(resetPosition = true) {
    this._isScrolling = false;
    this._clearFadeOutEffect();
    this._container.remove_all_transitions();
    if (resetPosition) {
      this._container.translation_x = 0;
    }
    if (this._scrollTimer) {
      GLib7.Source.remove(this._scrollTimer);
      this._scrollTimer = null;
    }
  }
  _checkOverflow() {
    if (this._gameMode || this._paused || !this.get_parent()) {
      return;
    }
    let boxWidth = this.get_allocation_box().get_width();
    if (boxWidth <= 1) {
      return;
    }
    let textWidth = this._label1.get_preferred_width(-1)[1] || 0;
    let needsScroll = textWidth > boxWidth + 5;
    if (needsScroll) {
      this._container.x_align = clutter_18_default.ActorAlign.START;
      if (this._lyricTime > 0) {
        this._startLyricScroll(textWidth);
      } else if (this._appContext.settings.scrollControls.scrollText) {
        if (!this._hoverOnly || this._hovered || this._forceScroll) {
          this._startInfiniteScroll(textWidth);
        }
      }
    } else {
      this._stopAnimation(true);
      this._container.x_align = clutter_18_default.ActorAlign.CENTER;
    }
  }
  _startInfiniteScroll(textWidth) {
    this._stopAnimation(true);
    this._isScrolling = true;
    this._label2.show();
    this._separator.show();
    const distance = textWidth + 30;
    const duration = distance / 30 * 1e3;
    const loop = () => {
      if (this._gameMode || !this.get_parent()) {
        return GLib7.SOURCE_REMOVE;
      }
      if (this._pendingScrollStop) {
        this._pendingScrollStop = false;
        this._isScrolling = false;
        this._stopAnimation(true);
        this._container.x_align = clutter_18_default.ActorAlign.CENTER;
        this._label2.hide();
        this._separator.hide();
        return GLib7.SOURCE_REMOVE;
      }
      this._setFadeOutEffect(true, true, true);
      this._container.ease({
        translationX: -distance,
        duration,
        mode: clutter_18_default.AnimationMode.LINEAR,
        onStopped: (isFinished) => {
          if (!isFinished || this._gameMode || this._pendingScrollStop) {
            this._isScrolling = false;
            this._pendingScrollStop = false;
            return;
          }
          this._container.translation_x = 0;
          loop();
        }
      });
      return GLib7.SOURCE_REMOVE;
    };
    loop();
  }
  _startLyricScroll(textWidth) {
    this._stopAnimation(true);
    this._isScrolling = true;
    this._label2.hide();
    this._separator.hide();
    let boxWidth = this.get_allocation_box().get_width();
    const distance = textWidth - boxWidth;
    if (distance <= 5) {
      return;
    }
    const totalDurationMs = this._lyricTime * 1e3;
    const pauseTime = boxWidth / textWidth * totalDurationMs * 0.5;
    const tailTime = totalDurationMs * 0.2;
    const scrollDuration = totalDurationMs - pauseTime - tailTime;
    if (scrollDuration <= 0) {
      return;
    }
    this._clearFadeOutEffect();
    if (this._scrollTimer) {
      GLib7.Source.remove(this._scrollTimer);
    }
    this._scrollTimer = GLib7.timeout_add(GLib7.PRIORITY_DEFAULT, Math.max(100, pauseTime), () => {
      this._scrollTimer = null;
      if (this._gameMode || !this.get_parent()) {
        return GLib7.SOURCE_REMOVE;
      }
      this._container.ease({
        translationX: -distance,
        duration: scrollDuration,
        mode: clutter_18_default.AnimationMode.LINEAR,
        onStopped: () => {
          this._isScrolling = false;
          this._lyricFinished = true;
        }
      });
      return GLib7.SOURCE_REMOVE;
    });
  }
};
gobject_2_0_default.registerClass(_ScrollLabel);
var ScrollLabel = _ScrollLabel;

// src/ui/music-pill/components/text-block/index.ts
var TextBlock = class extends St2.BoxLayout {
  constructor() {
    super({
      x_expand: true,
      y_align: Clutter2.ActorAlign.CENTER,
      vertical: true
    });
    __publicField(this, "_titleScroll");
    __publicField(this, "_artistScroll");
    this._titleScroll = new ScrollLabel("music-label-title");
    this._artistScroll = new ScrollLabel("music-label-artist");
    this.add_child(this._titleScroll);
    this.add_child(this._artistScroll);
  }
  setTitle(text) {
    this._titleScroll.setText(text, true, 0);
  }
  setArtist(text) {
    this._artistScroll.setText(text, true);
  }
  setPlayerPaused(paused) {
    this._titleScroll.setPlayerPaused(paused);
    this._artistScroll.setPlayerPaused(paused);
  }
};

// src/ui/visualizers/waveform.ts
import GObject8 from "gi://GObject";
import St4 from "gi://St";
import Clutter4 from "gi://Clutter";

// src/ui/visualizers/simulated.ts
import GObject7 from "gi://GObject";
import GLib8 from "gi://GLib";
import St3 from "gi://St";
import Clutter3 from "gi://Clutter";
var _SimulatedVisualizer = class _SimulatedVisualizer extends St3.BoxLayout {
  constructor(settings, isPopup = false) {
    super({
      style: "spacing: 2px;",
      y_align: Clutter3.ActorAlign.CENTER,
      x_align: Clutter3.ActorAlign.END
    });
    __publicField(this, "_settings");
    __publicField(this, "_isPopup");
    __publicField(this, "_bars", []);
    __publicField(this, "_timer", null);
    __publicField(this, "_playing", false);
    __publicField(this, "_mode", 1);
    __publicField(this, "_color", { r: 255, g: 255, b: 255 });
    this._settings = settings;
    this._isPopup = isPopup;
    this._rebuildBars();
  }
  setMode(mode) {
    this._mode = mode;
    this.visible = mode !== 0;
    if (mode === 0) {
      this.setPlaying(false);
    }
  }
  setColor(c) {
    this._color = c;
    this._applyBarStyles();
  }
  setPlaying(playing) {
    this._playing = playing && this._mode !== 0;
    if (this._playing) {
      this._start();
    } else {
      this._stop();
      for (const bar of this._bars) {
        bar.set_height(2);
      }
    }
  }
  updateBarCount() {
    this._rebuildBars();
  }
  _barCount() {
    return this._isPopup ? this._settings.popup.popupVisualizerBars || 10 : this._settings.style.visualizerBarCount || 10;
  }
  _barWidth() {
    return this._isPopup ? this._settings.popup.popupVisualizerBarWidth || 2 : this._settings.style.visualizerBarWidth || 2;
  }
  _rebuildBars() {
    this.destroy_all_children();
    this._bars = [];
    const count = this._barCount();
    const width = this._barWidth();
    for (let i = 0; i < count; i++) {
      const bar = new St3.Widget({
        width,
        height: 2,
        style: `background-color: rgb(${this._color.r},${this._color.g},${this._color.b}); border-radius: 2px;`
      });
      this._bars.push(bar);
      this.add_child(bar);
    }
  }
  _applyBarStyles() {
    for (const bar of this._bars) {
      bar.set_style(`background-color: rgb(${this._color.r},${this._color.g},${this._color.b}); border-radius: 2px;`);
    }
  }
  _start() {
    if (this._timer !== null) {
      return;
    }
    this._timer = GLib8.timeout_add(GLib8.PRIORITY_DEFAULT, 50, () => {
      if (!this._playing) {
        this._timer = null;
        return GLib8.SOURCE_REMOVE;
      }
      const maxH = Math.max(8, this.get_height() || 24);
      for (const bar of this._bars) {
        const h = this._mode === 2 ? Math.max(2, Math.floor(maxH * (0.3 + Math.random() * 0.7))) : Math.max(2, Math.floor(maxH * Math.random()));
        bar.set_height(h);
      }
      return GLib8.SOURCE_CONTINUE;
    });
  }
  _stop() {
    if (this._timer !== null) {
      GLib8.source_remove(this._timer);
      this._timer = null;
    }
  }
  destroy() {
    this._stop();
    super.destroy();
  }
};
GObject7.registerClass(_SimulatedVisualizer);
var SimulatedVisualizer = _SimulatedVisualizer;

// src/ui/visualizers/waveform.ts
var _WaveformVisualizer = class _WaveformVisualizer extends St4.Bin {
  constructor(defaultHeight = 24, settings, isPopup = false) {
    super({
      y_align: Clutter4.ActorAlign.CENTER,
      x_align: Clutter4.ActorAlign.END,
      y_expand: true,
      height: defaultHeight
    });
    __publicField(this, "_settings");
    __publicField(this, "_isPopup");
    __publicField(this, "_simulated");
    __publicField(this, "_mode", 1);
    __publicField(this, "_playing", false);
    __publicField(this, "_maxHeight", null);
    this._settings = settings;
    this._isPopup = isPopup;
    this._simulated = new SimulatedVisualizer(settings, isPopup);
    this.set_child(this._simulated);
    this._updateSize();
  }
  setHeightClamped(maxH) {
    this._maxHeight = maxH;
    this._updateSize();
  }
  setMode(mode) {
    this._mode = mode === 3 ? 2 : mode;
    this._simulated.setMode(this._mode);
    this._simulated.setPlaying(this._playing);
    this.visible = this._mode !== 0;
  }
  setColor(c) {
    this._simulated.setColor(c);
  }
  setPlaying(playing) {
    this._playing = playing;
    this._simulated.setPlaying(playing);
  }
  _updateSize() {
    let h = this._isPopup ? this._settings.popup.popupVisualizerHeight || 80 : this._settings.style.visualizerHeight || 24;
    if (this._maxHeight && !this._isPopup) {
      h = Math.min(h, this._maxHeight);
    }
    this.set_height(h);
    this._simulated.set_height(h);
    this._simulated.updateBarCount();
  }
};
GObject8.registerClass(_WaveformVisualizer);
var WaveformVisualizer = _WaveformVisualizer;

// src/ui/music-pill/index.ts
var _MusicPill = class _MusicPill extends St5.Widget {
  constructor(settings) {
    super({
      style_class: "music-pill-container",
      reactive: true,
      layout_manager: new Clutter5.BinLayout(),
      y_expand: true,
      y_align: Clutter5.ActorAlign.FILL,
      x_align: Clutter5.ActorAlign.CENTER,
      opacity: 0,
      width: 0,
      visible: false,
      can_focus: true,
      track_hover: true
    });
    __publicField(this, "textBlock");
    __publicField(this, "_settings");
    __publicField(this, "_state");
    __publicField(this, "_body");
    __publicField(this, "_artWidget");
    __publicField(this, "_artBin");
    __publicField(this, "_visualizer");
    __publicField(this, "_currentStatus", "Stopped");
    __publicField(this, "_lastArtUrl", null);
    __publicField(this, "_onAction", null);
    __publicField(this, "_clickTimer", null);
    __publicField(this, "_lastClick", 0);
    this._settings = settings;
    this._state = {
      lastScrollTime: 0,
      isActive: false,
      targetWidth: 250,
      paddingX: 14,
      paddingY: 6,
      radius: 28,
      shadowCSS: "box-shadow: none",
      inPanel: false,
      gameMode: false,
      currentBusName: null,
      displayedColor: { r: 40, g: 40, b: 40 },
      targetColor: { r: 40, g: 40, b: 40 },
      colorAnimId: null,
      hideGraceTimer: null,
      lastBodyCss: null,
      lastLeftCss: null,
      lastRightCss: null
    };
    this._body = new St5.BoxLayout({
      style_class: "pill-body",
      x_expand: false,
      y_expand: false,
      y_align: Clutter5.ActorAlign.CENTER,
      style: "spacing: 6px;"
    });
    this._body.set_pivot_point(0.5, 0.5);
    this._artWidget = new CrossfadeArt();
    this._artBin = new St5.Bin({
      child: this._artWidget,
      style: "margin-right: 4px;",
      x_expand: false,
      y_expand: false
    });
    this.textBlock = new TextBlock();
    this._visualizer = new WaveformVisualizer(24, settings, false);
    this._visualizer.setMode(settings.style.visualizerAnimation || 1);
    this._body.add_child(this._artBin);
    this._body.add_child(this.textBlock);
    this._body.add_child(this._visualizer);
    this.add_child(this._body);
    this.connect("button-release-event", (_a, event) => this._onButton(event));
    this.connect("scroll-event", (_a, event) => this._onScroll(event));
  }
  setActionHandler(handler) {
    this._onAction = handler;
  }
  get displayedColor() {
    return this._state.displayedColor;
  }
  get lastArtUrl() {
    return this._lastArtUrl;
  }
  get currentBgAlpha() {
    return 0.95;
  }
  updateDimensions() {
    const height = this._settings.pill.dockHeight;
    const width = this._settings.pill.dynamicWidth ? -1 : this._settings.pill.dockWidth;
    this._state.targetWidth = width === -1 ? 250 : width;
    this._body.set_height(height);
    if (width > 0) {
      this._body.set_width(width);
    }
    this.set_height(height);
    this._visualizer.setHeightClamped(Math.max(8, height - 8));
  }
  updateDisplay(payload) {
    if (!this.get_parent()) {
      return;
    }
    const hasContent = !!(payload.title || payload.status === "Playing" || payload.status === "Paused");
    this._currentStatus = payload.status;
    this._state.currentBusName = payload.busName;
    if (payload.title) {
      this.textBlock.setTitle(payload.title);
    }
    if (payload.artist !== void 0) {
      this.textBlock.setArtist(payload.artist);
    }
    if (payload.artUrl !== void 0) {
      this.setArtUrl(payload.artUrl);
    }
    this.textBlock.setPlayerPaused(payload.status !== "Playing");
    this._visualizer.setPlaying(payload.status === "Playing" && !this._settings.popup.hidePillVisualizer);
    if (hasContent) {
      this.showActive();
    } else {
      this.hideInactive();
    }
  }
  setTitle(title) {
    this.textBlock.setTitle(title);
  }
  setArtist(artist) {
    this.textBlock.setArtist(artist);
  }
  setArtUrl(url) {
    if (!this._settings.pill.showAlbumArt) {
      this._artBin.hide();
      return;
    }
    if (url) {
      this._artBin.show();
      this._artWidget.setArt(url, true);
      this._lastArtUrl = url;
    } else {
      this._artBin.hide();
      this._lastArtUrl = null;
    }
  }
  setStatus(status) {
    this._currentStatus = status;
  }
  setBusName(busName) {
    this._state.currentBusName = busName;
  }
  showActive() {
    this._state.isActive = true;
    this.visible = true;
    this.reactive = true;
    this.set_width(-1);
    this.opacity = 255;
    this.updateDimensions();
  }
  hideInactive() {
    if (this._settings.pill.alwaysShow && this._state.currentBusName) {
      this.textBlock.setTitle("Sem m\xEDdia");
      this.textBlock.setArtist("Aguardando reprodu\xE7\xE3o...");
      this.showActive();
      return;
    }
    this._state.isActive = false;
    this.reactive = false;
    this.opacity = 0;
    this.visible = false;
    this.set_width(0);
    this._visualizer.setPlaying(false);
  }
  _emit(action) {
    var _a;
    if (action && action !== "none") {
      (_a = this._onAction) == null ? void 0 : _a.call(this, action);
    }
  }
  _onButton(event) {
    const button = event.get_button();
    if (button === 2) {
      this._emit(this._settings.mouseActions.middleClick);
      return Clutter5.EVENT_STOP;
    }
    if (button === 3) {
      this._emit(this._settings.mouseActions.rightClick);
      return Clutter5.EVENT_STOP;
    }
    if (button !== 1) {
      return Clutter5.EVENT_PROPAGATE;
    }
    const now = Date.now();
    const doubleAction = this._settings.mouseActions.doubleClick;
    const singleAction = this._settings.mouseActions.leftClick;
    if (!doubleAction || doubleAction === "none") {
      this._emit(singleAction);
      return Clutter5.EVENT_STOP;
    }
    if (this._lastClick && now - this._lastClick <= 220) {
      this._lastClick = 0;
      if (this._clickTimer !== null) {
        GLib9.source_remove(this._clickTimer);
        this._clickTimer = null;
      }
      this._emit(doubleAction);
    } else {
      this._lastClick = now;
      if (this._clickTimer !== null) {
        GLib9.source_remove(this._clickTimer);
      }
      this._clickTimer = GLib9.timeout_add(GLib9.PRIORITY_DEFAULT, 220, () => {
        this._clickTimer = null;
        this._lastClick = 0;
        this._emit(singleAction);
        return GLib9.SOURCE_REMOVE;
      });
    }
    return Clutter5.EVENT_STOP;
  }
  _onScroll(event) {
    const dir = event.get_scroll_direction();
    if (dir === Clutter5.ScrollDirection.UP) {
      this._emit("previous");
      return Clutter5.EVENT_STOP;
    }
    if (dir === Clutter5.ScrollDirection.DOWN) {
      this._emit("next");
      return Clutter5.EVENT_STOP;
    }
    return Clutter5.EVENT_PROPAGATE;
  }
};
GObject9.registerClass(_MusicPill);
var MusicPill = _MusicPill;

// src/ui/music-pill/positioning/inject.ts
import GLib10 from "gi://GLib";

// src/ui/music-pill/positioning/container-resolver.ts
import * as Main from "resource:///org/gnome/shell/ui/main.js";
function resolveTargetContainer(targetContainer) {
  var _a;
  const panel2 = Main.panel;
  const statusArea = panel2.statusArea;
  if (targetContainer === 0) {
    const dtd = (_a = statusArea["dash-to-dock"]) != null ? _a : statusArea["ubuntu-dock"];
    const dashBox = dtd == null ? void 0 : dtd._box;
    return dashBox != null ? dashBox : Main.overview.dash._box;
  }
  if (targetContainer === 1) {
    return panel2._leftBox;
  }
  if (targetContainer === 2) {
    return panel2._centerBox;
  }
  if (targetContainer === 3) {
    return panel2._rightBox;
  }
  return null;
}
function isDockContainer(container) {
  var _a;
  const panel2 = Main.panel;
  const statusArea = panel2.statusArea;
  const dtd = (_a = statusArea["dash-to-dock"]) != null ? _a : statusArea["ubuntu-dock"];
  if (dtd && dtd._box === container) {
    return true;
  }
  return Main.overview.dash._box === container;
}

// src/ui/music-pill/positioning/drag-fix.ts
function setupDragFix(container, pill, getIsMoving, setIsMoving) {
  const dash = container._delegate;
  if (!(dash == null ? void 0 : dash.handleDragOver) || dash._musicPillOrigHandleDragOver) {
    return;
  }
  const adjustX = (x) => {
    if (!pill || pill.get_parent() !== container) {
      return x;
    }
    const pillWidth = pill.get_width();
    const pillX = pill.x;
    if (x > pillX + pillWidth) {
      return x - pillWidth;
    }
    if (x >= pillX) {
      return pillX;
    }
    return x;
  };
  const adjustWidth = (fn) => {
    const pillWidth = (pill == null ? void 0 : pill.get_parent()) === container ? pill.get_width() : 0;
    if (pillWidth > 0) {
      Object.defineProperty(container, "width", {
        get() {
          return container.get_width() - pillWidth;
        },
        configurable: true,
        enumerable: false
      });
    }
    try {
      return fn();
    } finally {
      if (pillWidth > 0) {
        Reflect.deleteProperty(container, "width");
      }
    }
  };
  dash._musicPillOrigHandleDragOver = dash.handleDragOver;
  dash.handleDragOver = (source, actor, x, y, time) => adjustWidth(() => dash._musicPillOrigHandleDragOver.call(dash, source, actor, adjustX(x), y, time));
  if (typeof dash.acceptDrop === "function") {
    dash._musicPillOrigAcceptDrop = dash.acceptDrop;
    dash.acceptDrop = (source, actor, x, y, time) => {
      const parent = pill.get_parent();
      if (parent) {
        setIsMoving(true);
        parent.remove_child(pill);
      }
      const result = dash._musicPillOrigAcceptDrop.call(dash, source, actor, adjustX(x), y, time);
      if (parent) {
        parent.insert_child_at_index(pill, 0);
      }
      setIsMoving(false);
      return result;
    };
  }
}
function teardownDragFix(container) {
  const dash = container._delegate;
  if (!dash) {
    return;
  }
  if (dash._musicPillOrigHandleDragOver) {
    dash.handleDragOver = dash._musicPillOrigHandleDragOver;
    delete dash._musicPillOrigHandleDragOver;
  }
  if (dash._musicPillOrigAcceptDrop) {
    dash.acceptDrop = dash._musicPillOrigAcceptDrop;
    delete dash._musicPillOrigAcceptDrop;
  }
}

// src/ui/music-pill/positioning/inject.ts
function createPillInjector(pill, settings) {
  let injectTimeout = null;
  let currentDock = null;
  let isMovingItem = false;
  let isUserDragging = false;
  function ensurePosition(container) {
    if (isMovingItem || isUserDragging) {
      return false;
    }
    const mode = settings.pill.alignmentPreset;
    const manualIndex = settings.pill.manualIndex;
    const children = container.get_children();
    const otherChildren = children.filter((c) => c !== pill);
    const realItemCount = otherChildren.length;
    let targetIndex = 0;
    if (mode === 0) {
      targetIndex = manualIndex;
    } else if (mode === 1) {
      targetIndex = 0;
    } else if (mode === 2) {
      targetIndex = Math.floor(realItemCount / 2);
    } else if (mode === 3) {
      targetIndex = realItemCount;
    }
    targetIndex = Math.max(0, Math.min(targetIndex, realItemCount));
    let currentIndex = children.indexOf(pill);
    const pillParent = pill.get_parent();
    if (currentIndex === -1 && pillParent === container) {
      currentIndex = 0;
    }
    if (pillParent && pillParent !== container) {
      pillParent.remove_child(pill);
      currentIndex = -1;
    }
    if (currentIndex !== targetIndex) {
      isMovingItem = true;
      if (currentIndex !== -1) {
        container.set_child_at_index(pill, targetIndex);
      } else {
        container.insert_child_at_index(pill, targetIndex);
      }
      isMovingItem = false;
      return true;
    }
    return false;
  }
  function inject() {
    var _a, _b;
    if (injectTimeout !== null) {
      GLib10.source_remove(injectTimeout);
      injectTimeout = null;
    }
    const target = settings.style.targetContainer;
    const container = resolveTargetContainer(target);
    if (!container) {
      return;
    }
    const oldParent = pill.get_parent();
    const parentChanged = oldParent !== null && oldParent !== container;
    if (parentChanged && oldParent) {
      oldParent.remove_child(pill);
      if (currentDock == null ? void 0 : currentDock.disconnectObject) {
        currentDock.disconnectObject(pill);
        currentDock = null;
      }
      teardownDragFix(container);
    }
    if (target === 0 && currentDock !== container) {
      currentDock = container;
      (_a = container.connectObject) == null ? void 0 : _a.call(container, "child-added", () => {
        if (!isMovingItem) {
          queueInject();
        }
      }, pill);
      (_b = container.connectObject) == null ? void 0 : _b.call(container, "child-removed", () => {
        if (!isMovingItem) {
          queueInject();
        }
      }, pill);
    }
    const moved = ensurePosition(container);
    if (parentChanged || moved || !oldParent) {
      pill.updateDimensions();
    }
    if (target === 0) {
      setupDragFix(container, pill, () => isMovingItem, (v) => {
        isMovingItem = v;
      });
    }
  }
  function queueInject() {
    if (injectTimeout !== null) {
      GLib10.source_remove(injectTimeout);
    }
    injectTimeout = GLib10.timeout_add(GLib10.PRIORITY_DEFAULT, 100, () => {
      inject();
      injectTimeout = null;
      return GLib10.SOURCE_REMOVE;
    });
  }
  function destroy() {
    if (injectTimeout !== null) {
      GLib10.source_remove(injectTimeout);
      injectTimeout = null;
    }
    if (currentDock == null ? void 0 : currentDock.disconnectObject) {
      currentDock.disconnectObject(pill);
      currentDock = null;
    }
    const parent = pill.get_parent();
    if (parent && isDockContainer(parent)) {
      teardownDragFix(parent);
    }
  }
  return { inject, queueInject, destroy };
}

// src/ui/expanded-player/index.ts
import GObject14 from "gi://GObject";
import GLib11 from "gi://GLib";
import St10 from "gi://St";
import Clutter10 from "gi://Clutter";
import * as Main3 from "resource:///org/gnome/shell/ui/main.js";

// src/utils/dash-to-dock.ts
import * as Main2 from "resource:///org/gnome/shell/ui/main.js";
var disableRequests = 0;
var dockManager = null;
var importPromise = null;
function initDTDModule() {
  let ext = Main2.extensionManager.lookup("dash-to-dock@micxgx.gmail.com");
  if (!ext || ext.state !== 1) {
    ext = Main2.extensionManager.lookup("ubuntu-dock@ubuntu.com");
  }
  if (!ext || ext.state !== 1) {
    return null;
  }
  if (importPromise) {
    return importPromise;
  }
  importPromise = import(`file://${ext.path}/extension.js`).then((mod) => {
    var _a;
    dockManager = (_a = mod.dockManager) != null ? _a : null;
    if (disableRequests > 0) {
      applyDisable();
    }
  }).catch((e) => {
    logDebug(`DTD import error: ${e.message}`);
    importPromise = null;
  });
  return importPromise;
}
function applyDisable() {
  if (!(dockManager == null ? void 0 : dockManager._allDocks)) {
    return;
  }
  try {
    for (const dock of dockManager._allDocks) {
      dock.dash.requiresVisibility = true;
      dock._show();
    }
  } catch (e) {
    logDebug(`DTD disable error: ${e.message}`);
  }
}
function applyRestore() {
  if (!(dockManager == null ? void 0 : dockManager._allDocks)) {
    return;
  }
  try {
    for (const dock of dockManager._allDocks) {
      dock.dash.requiresVisibility = false;
      dock._updateDashVisibility();
    }
  } catch (e) {
    logDebug(`DTD restore error: ${e.message}`);
  }
}
function disableDashToDockAutohide() {
  disableRequests++;
  if (disableRequests === 1) {
    if (dockManager) {
      applyDisable();
    } else {
      initDTDModule();
    }
  }
}
function restoreDashToDockAutohide() {
  if (disableRequests <= 0) {
    return;
  }
  disableRequests--;
  if (disableRequests === 0 && dockManager) {
    applyRestore();
  }
}

// src/ui/expanded-player/components/track-info.ts
import GObject10 from "gi://GObject";
import St6 from "gi://St";
import Clutter6 from "gi://Clutter";
var _TrackInfoBlock = class _TrackInfoBlock extends St6.BoxLayout {
  constructor() {
    super({
      vertical: true,
      x_expand: true,
      y_align: Clutter6.ActorAlign.CENTER,
      style: "spacing: 4px;"
    });
    __publicField(this, "_title");
    __publicField(this, "_artist");
    this._title = new ScrollLabel("music-label-title");
    this._artist = new ScrollLabel("music-label-artist");
    this.add_child(this._title);
    this.add_child(this._artist);
  }
  setTitle(text) {
    this._title.setText(text || "", true, 0);
  }
  setArtist(text) {
    this._artist.setText(text || "", true);
  }
  setPaused(paused) {
    this._title.setPlayerPaused(paused);
    this._artist.setPlayerPaused(paused);
  }
};
GObject10.registerClass(_TrackInfoBlock);
var TrackInfoBlock = _TrackInfoBlock;

// src/ui/expanded-player/components/progress-bar.ts
import GObject11 from "gi://GObject";
import St7 from "gi://St";
import Clutter7 from "gi://Clutter";

// src/utils/time.ts
function formatTime(microSeconds, forceHours = false) {
  if (!microSeconds || microSeconds < 0) {
    return forceHours ? "0:00:00" : "0:00";
  }
  const totalSeconds = Math.floor(microSeconds / 1e6);
  const hours = Math.floor(totalSeconds / 3600);
  const min = Math.floor(totalSeconds % 3600 / 60);
  const sec = totalSeconds % 60;
  const pad = (n) => n < 10 ? `0${n}` : `${n}`;
  if (forceHours || hours > 0) {
    return `${hours}:${pad(min)}:${pad(sec)}`;
  }
  return `${min}:${pad(sec)}`;
}

// src/ui/expanded-player/components/progress-bar.ts
var _ProgressBar = class _ProgressBar extends St7.BoxLayout {
  constructor() {
    super({
      vertical: false,
      x_expand: true,
      style: "spacing: 8px;",
      y_align: Clutter7.ActorAlign.CENTER
    });
    __publicField(this, "_current");
    __publicField(this, "_total");
    __publicField(this, "_fill");
    __publicField(this, "_track");
    __publicField(this, "_onSeek", null);
    __publicField(this, "_length", 0);
    __publicField(this, "_forceHours", false);
    this._current = new St7.Label({ text: "0:00", y_align: Clutter7.ActorAlign.CENTER });
    this._total = new St7.Label({ text: "0:00", y_align: Clutter7.ActorAlign.CENTER });
    this._track = new St7.Widget({
      style_class: "music-pill-progress-track",
      style: "background-color: rgba(255,255,255,0.2); border-radius: 3px; height: 6px;",
      x_expand: true,
      reactive: true,
      height: 6
    });
    this._fill = new St7.Widget({
      style: "background-color: rgba(255,255,255,0.85); border-radius: 3px; height: 6px;",
      height: 6,
      width: 0
    });
    this._track.add_child(this._fill);
    this._track.connect("button-release-event", (_a, event) => {
      if (!this._onSeek) {
        return Clutter7.EVENT_PROPAGATE;
      }
      const [ex] = event.get_coords();
      const [tx] = this._track.get_transformed_position();
      const w = this._track.get_width() || 1;
      const ratio = Math.max(0, Math.min(1, (ex - tx) / w));
      this._onSeek(ratio);
      return Clutter7.EVENT_STOP;
    });
    this.add_child(this._current);
    this.add_child(this._track);
    this.add_child(this._total);
  }
  setSeekHandler(handler) {
    this._onSeek = handler;
  }
  setForceHours(force) {
    this._forceHours = force;
  }
  update(position, length) {
    this._length = length;
    this._current.text = formatTime(position, this._forceHours);
    this._total.text = formatTime(length, this._forceHours);
    const w = this._track.get_width() || 0;
    const ratio = length > 0 ? Math.max(0, Math.min(1, position / length)) : 0;
    this._fill.set_width(Math.floor(w * ratio));
  }
};
GObject11.registerClass(_ProgressBar);
var ProgressBar = _ProgressBar;

// src/ui/expanded-player/components/transport-controls.ts
import GObject12 from "gi://GObject";
import St8 from "gi://St";
import Clutter8 from "gi://Clutter";
var _TransportControls = class _TransportControls extends St8.BoxLayout {
  constructor(callbacks) {
    super({
      vertical: false,
      x_align: Clutter8.ActorAlign.CENTER,
      style: "spacing: 12px;"
    });
    __publicField(this, "_prev");
    __publicField(this, "_play");
    __publicField(this, "_next");
    __publicField(this, "_playIcon");
    this._prev = this._iconButton("media-skip-backward-symbolic", () => callbacks.onPrevious());
    this._playIcon = new St8.Icon({ icon_name: "media-playback-start-symbolic", icon_size: 28 });
    this._play = new St8.Button({
      child: this._playIcon,
      reactive: true,
      can_focus: true,
      style_class: "music-pill-transport-btn"
    });
    this._play.connect("clicked", () => callbacks.onPlayPause());
    this._next = this._iconButton("media-skip-forward-symbolic", () => callbacks.onNext());
    this.add_child(this._prev);
    this.add_child(this._play);
    this.add_child(this._next);
  }
  setStatus(status) {
    this._playIcon.icon_name = status === "Playing" ? "media-playback-pause-symbolic" : "media-playback-start-symbolic";
  }
  setCapabilities(canPrev, canPlay, canNext) {
    this._prev.opacity = canPrev ? 255 : 80;
    this._play.opacity = canPlay ? 255 : 80;
    this._next.opacity = canNext ? 255 : 80;
    this._prev.reactive = canPrev;
    this._play.reactive = canPlay;
    this._next.reactive = canNext;
  }
  _iconButton(iconName, onClick) {
    const btn = new St8.Button({
      child: new St8.Icon({ icon_name: iconName, icon_size: 22 }),
      reactive: true,
      can_focus: true,
      style_class: "music-pill-transport-btn"
    });
    btn.connect("clicked", onClick);
    return btn;
  }
};
GObject12.registerClass(_TransportControls);
var TransportControls = _TransportControls;

// src/ui/expanded-player/components/vinyl-art.ts
import GObject13 from "gi://GObject";
import St9 from "gi://St";
import Clutter9 from "gi://Clutter";
var _VinylArt = class _VinylArt extends St9.Bin {
  constructor() {
    super({
      width: 96,
      height: 96,
      x_align: Clutter9.ActorAlign.CENTER,
      y_align: Clutter9.ActorAlign.CENTER
    });
    __publicField(this, "_art");
    __publicField(this, "_url", null);
    __publicField(this, "_spinning", false);
    __publicField(this, "_square", false);
    this._art = new St9.Widget({
      width: 96,
      height: 96,
      style: "border-radius: 48px; background-size: cover; background-color: rgba(40,40,40,0.8);"
    });
    this.set_child(this._art);
  }
  setSquare(square) {
    this._square = square;
    this._refreshStyle();
  }
  setArt(url) {
    this._url = url;
    this._refreshStyle();
  }
  setSpinning(spinning) {
    if (this._spinning === spinning) {
      return;
    }
    this._spinning = spinning;
    this._art.remove_all_transitions();
    if (spinning) {
      this._art.set_pivot_point(0.5, 0.5);
      this._spinOnce();
    } else {
      this._art.rotation_angle_z = 0;
    }
  }
  _spinOnce() {
    if (!this._spinning) {
      return;
    }
    this._art.ease({
      rotation_angle_z: this._art.rotation_angle_z + 360,
      duration: 8e3,
      mode: Clutter9.AnimationMode.LINEAR,
      onStopped: (finished) => {
        if (finished && this._spinning) {
          this._spinOnce();
        }
      }
    });
  }
  _refreshStyle() {
    const radius = this._square ? 12 : 48;
    const bg = this._url ? `background-image: url("${this._url}");` : "background-color: rgba(40,40,40,0.8);";
    this._art.set_style(`border-radius: ${radius}px; background-size: cover; ${bg}`);
  }
};
GObject13.registerClass(_VinylArt);
var VinylArt = _VinylArt;

// src/ui/expanded-player/index.ts
var _ExpandedPlayer = class _ExpandedPlayer extends St10.Widget {
  constructor(host) {
    const [bgW, bgH] = global.display.get_size();
    super({
      width: bgW,
      height: bgH,
      reactive: true,
      visible: false,
      x: 0,
      y: 0
    });
    __publicField(this, "box");
    __publicField(this, "_host");
    __publicField(this, "_player", null);
    __publicField(this, "_timer", null);
    __publicField(this, "_vinyl");
    __publicField(this, "_info");
    __publicField(this, "_progress");
    __publicField(this, "_transport");
    __publicField(this, "_visualizer");
    __publicField(this, "_bgBtn");
    this._host = host;
    this._bgBtn = new St10.Button({
      style: "background-color: transparent;",
      reactive: true,
      x_expand: true,
      y_expand: true,
      width: bgW,
      height: bgH
    });
    this._bgBtn.connect("clicked", () => this.hidePopup());
    this.add_child(this._bgBtn);
    this.box = new PixelSnappedBox({
      style_class: "music-pill-expanded",
      reactive: true,
      style: "padding: 16px; border-radius: 16px; background-color: rgba(30,30,30,0.95);"
    });
    this.box.layout_manager.orientation = Clutter10.Orientation.VERTICAL;
    this.add_child(this.box);
    this._vinyl = new VinylArt();
    this._vinyl.setSquare(host.settings.popup.squareVinyl);
    this._info = new TrackInfoBlock();
    this._visualizer = new WaveformVisualizer(80, host.settings, true);
    this._visualizer.setMode(host.settings.style.visualizerAnimation || 1);
    const top = new St10.BoxLayout({ vertical: false, style: "spacing: 16px;", x_expand: true });
    top.add_child(this._vinyl);
    const mid = new St10.BoxLayout({ vertical: true, x_expand: true, style: "spacing: 8px;" });
    mid.add_child(this._info);
    mid.add_child(this._visualizer);
    top.add_child(mid);
    this.box.add_child(top);
    this._progress = new ProgressBar();
    this._progress.setForceHours(host.settings.popup.showHoursFormat);
    this._progress.setSeekHandler((ratio) => this._onSeek(ratio));
    this.box.add_child(this._progress);
    this._transport = new TransportControls({
      onPrevious: () => this._host.previous(),
      onPlayPause: () => this._host.togglePlayback(),
      onNext: () => this._host.next()
    });
    this.box.add_child(this._transport);
    this.connect("key-press-event", (_a, event) => {
      if (event.get_key_symbol() === Clutter10.KEY_Escape) {
        this.hidePopup();
        return Clutter10.EVENT_STOP;
      }
      return Clutter10.EVENT_PROPAGATE;
    });
    this.connect("destroy", () => this._cleanup());
  }
  setPlayer(player) {
    this._player = player;
  }
  updateStyle(r, g, b, alpha = 0.95) {
    this.box.set_style(
      `padding: 16px; border-radius: 16px; background-color: rgba(${r},${g},${b},${alpha});`
    );
    this._visualizer.setColor({ r, g, b });
  }
  updateContent(title, artist, artUrl, status) {
    this._info.setTitle(title || "");
    this._info.setArtist(artist || "");
    this._info.setPaused(status !== "Playing");
    this._transport.setStatus(status);
    if (this._host.settings.popup.showVinyl) {
      this._vinyl.visible = true;
      this._vinyl.setArt(artUrl);
      this._vinyl.setSpinning(status === "Playing" && this._host.settings.popup.vinylRotate);
    } else {
      this._vinyl.visible = false;
      this._vinyl.setSpinning(false);
    }
    if (this._host.settings.popup.showVisualizer) {
      this._visualizer.visible = true;
      this._visualizer.setPlaying(status === "Playing");
    } else {
      this._visualizer.visible = false;
      this._visualizer.setPlaying(false);
    }
    if (this._player) {
      const info = this._player.getPlayerInfo();
      this._transport.setCapabilities(info.canGoPrevious, info.canPlay || info.canPause, info.canGoNext);
    }
  }
  showFor(player, artUrl) {
    var _a, _b, _c;
    this._player = player;
    const track = player.getTrackInfo();
    const status = player.getPlayerInfo().playbackStatus;
    this.updateContent((_a = track == null ? void 0 : track.title) != null ? _a : null, (_c = (_b = track == null ? void 0 : track.artist) == null ? void 0 : _b.join(", ")) != null ? _c : null, artUrl, status);
    this._startTimer();
    disableDashToDockAutohide();
    this.visible = true;
    this.opacity = 0;
    this.ease({
      opacity: 255,
      duration: 180,
      mode: Clutter10.AnimationMode.EASE_OUT_QUAD
    });
    global.stage.set_key_focus(this);
  }
  hidePopup() {
    this._stopTimer();
    restoreDashToDockAutohide();
    this.ease({
      opacity: 0,
      duration: 150,
      mode: Clutter10.AnimationMode.EASE_OUT_QUAD,
      onStopped: () => {
        this.visible = false;
        this.destroy();
      }
    });
  }
  /** Alias used by controller to match legacy `hide()`. */
  hide() {
    this.hidePopup();
  }
  setPositionNearPill(px, py, pw, ph) {
    var _a;
    const monitor = (_a = Main3.layoutManager.findMonitorForActor(this)) != null ? _a : Main3.layoutManager.primaryMonitor;
    if (!monitor) {
      return;
    }
    this.box.set_width(-1);
    const [, natW] = this.box.get_preferred_width(-1);
    const [, natH] = this.box.get_preferred_height(natW);
    let w = this._host.settings.popup.useCustomWidth ? Math.max(this._host.settings.popup.customWidth, 280) : Math.min(Math.max(natW || 320, 280), 600);
    const h = natH > 0 ? natH : 220;
    let x = px + (pw - w) / 2;
    let y = py - h - 12;
    if (y < monitor.y + 8) {
      y = py + ph + 12;
    }
    x = Math.max(monitor.x + 8, Math.min(x, monitor.x + monitor.width - w - 8));
    this.box.set_position(Math.round(x), Math.round(y));
    this.box.set_size(Math.round(w), Math.round(h));
  }
  _onSeek(ratio) {
    var _a;
    if (!this._player) {
      return;
    }
    const length = ((_a = this._player.getTrackInfo()) == null ? void 0 : _a.length) || 0;
    if (length <= 0) {
      return;
    }
    this._host.seekTo(this._player, Math.floor(length * ratio));
  }
  _startTimer() {
    this._stopTimer();
    this._timer = GLib11.timeout_add(GLib11.PRIORITY_DEFAULT, 500, () => {
      this._tick();
      return GLib11.SOURCE_CONTINUE;
    });
    this._tick();
  }
  _stopTimer() {
    if (this._timer !== null) {
      GLib11.source_remove(this._timer);
      this._timer = null;
    }
  }
  _tick() {
    var _a;
    if (!this._player) {
      return;
    }
    const info = this._player.getPlayerInfo();
    const length = ((_a = this._player.getTrackInfo()) == null ? void 0 : _a.length) || 0;
    this._progress.update(info.position, length);
    this._transport.setStatus(info.playbackStatus);
    this._transport.setCapabilities(info.canGoPrevious, info.canPlay || info.canPause, info.canGoNext);
  }
  _cleanup() {
    this._stopTimer();
    restoreDashToDockAutohide();
    this._player = null;
  }
};
GObject14.registerClass(_ExpandedPlayer);
var ExpandedPlayer = _ExpandedPlayer;

// src/ui/player-selector/index.ts
import GObject15 from "gi://GObject";
import St11 from "gi://St";
import Clutter11 from "gi://Clutter";
import * as Main4 from "resource:///org/gnome/shell/ui/main.js";
import { gettext as _ } from "resource:///org/gnome/shell/extensions/extension.js";

// src/utils/player-icon.ts
import Gio5 from "gi://Gio";
function getPlayerIcon(player, busName) {
  var _a, _b;
  const names = [];
  const desktopEntry = (_a = player == null ? void 0 : player.getDesktopEntry) == null ? void 0 : _a.call(player);
  if (desktopEntry) {
    const de = desktopEntry.replace(".desktop", "");
    names.push(de, de.toLowerCase());
  }
  if (busName) {
    const raw = busName.replace("org.mpris.MediaPlayer2.", "").split(".")[0];
    names.push(raw.toLowerCase(), raw);
  }
  const identity = (_b = player == null ? void 0 : player.getIdentity) == null ? void 0 : _b.call(player);
  if (identity) {
    const id = identity.toLowerCase().replace(/ /g, "-");
    names.push(id);
  }
  names.push("audio-x-generic");
  for (const name of names) {
    if (!name) {
      continue;
    }
    const icon = Gio5.ThemedIcon.new(name);
    if (icon) {
      return icon;
    }
  }
  return Gio5.ThemedIcon.new("audio-x-generic");
}

// src/ui/player-selector/index.ts
var _PlayerSelectorMenu = class _PlayerSelectorMenu extends St11.Widget {
  constructor(host) {
    const [bgW, bgH] = global.display.get_size();
    super({
      width: bgW,
      height: bgH,
      reactive: true,
      visible: false,
      x: 0,
      y: 0
    });
    __publicField(this, "_host");
    __publicField(this, "_box");
    __publicField(this, "_bg");
    this._host = host;
    this._bg = new St11.Button({
      style: "background-color: transparent;",
      reactive: true,
      x_expand: true,
      y_expand: true,
      width: bgW,
      height: bgH
    });
    this._bg.connect("clicked", () => this.hideMenu());
    this.add_child(this._bg);
    this._box = new St11.BoxLayout({
      vertical: true,
      reactive: true,
      style: "padding: 12px; border-radius: 12px; background-color: rgba(30,30,30,0.95); spacing: 6px;"
    });
    this.add_child(this._box);
    this.connect("key-press-event", (_a, event) => {
      if (event.get_key_symbol() === Clutter11.KEY_Escape) {
        this.hideMenu();
        return Clutter11.EVENT_STOP;
      }
      return Clutter11.EVENT_PROPAGATE;
    });
  }
  populate() {
    this._box.destroy_all_children();
    const title = new St11.Label({
      text: _("Select Media Player"),
      style: "font-weight: bold; margin-bottom: 8px;",
      x_align: Clutter11.ActorAlign.CENTER
    });
    this._box.add_child(title);
    const current = this._host.settings.popup.selectedPlayerBus;
    if (!this._host.settings.popup.autoHidePlayer) {
      this._box.add_child(this._row(
        _("Auto (Smart Selection)"),
        "emblem-system-symbolic",
        current === "",
        () => this._host.selectPlayer("")
      ));
    }
    for (const player of this._host.getPlayers()) {
      const bus = player.getBusName();
      const identity = player.getIdentity() || bus.replace("org.mpris.MediaPlayer2.", "").split(".")[0];
      this._box.add_child(this._row(
        identity,
        null,
        current === bus,
        () => this._host.selectPlayer(bus),
        player,
        bus
      ));
    }
  }
  showMenu(anchorX, anchorY, anchorW, anchorH) {
    this.populate();
    this.visible = true;
    this.opacity = 0;
    const [, natW] = this._box.get_preferred_width(-1);
    const [, natH] = this._box.get_preferred_height(natW);
    const w = Math.max(natW || 220, 200);
    const h = natH || 120;
    let x = anchorX + (anchorW - w) / 2;
    let y = anchorY - h - 10;
    const monitor = Main4.layoutManager.primaryMonitor;
    if (!monitor) {
      return;
    }
    if (y < monitor.y + 8) {
      y = anchorY + anchorH + 10;
    }
    x = Math.max(monitor.x + 8, Math.min(x, monitor.x + monitor.width - w - 8));
    this._box.set_position(Math.round(x), Math.round(y));
    this._box.set_size(Math.round(w), Math.round(h));
    this.ease({
      opacity: 255,
      duration: 150,
      mode: Clutter11.AnimationMode.EASE_OUT_QUAD
    });
    global.stage.set_key_focus(this);
  }
  hideMenu() {
    this.ease({
      opacity: 0,
      duration: 120,
      mode: Clutter11.AnimationMode.EASE_OUT_QUAD,
      onStopped: () => {
        this.visible = false;
        this._host.closePlayerMenu();
      }
    });
  }
  _row(label, iconName, selected, onClick, player, busName) {
    const content = new St11.BoxLayout({ vertical: false, style: "spacing: 10px;" });
    const icon = new St11.Icon({
      icon_size: 22,
      gicon: iconName ? null : getPlayerIcon(player != null ? player : null, busName != null ? busName : ""),
      icon_name: iconName != null ? iconName : void 0
    });
    if (iconName) {
      icon.icon_name = iconName;
    }
    content.add_child(icon);
    content.add_child(new St11.Label({ text: label, y_align: Clutter11.ActorAlign.CENTER }));
    const btn = new St11.Button({
      child: content,
      reactive: true,
      can_focus: true,
      x_expand: true,
      style: `border-radius: 10px; padding: 8px; background-color: ${selected ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)"};`
    });
    btn.connect("clicked", () => {
      onClick();
      this.hideMenu();
    });
    return btn;
  }
};
GObject15.registerClass(_PlayerSelectorMenu);
var PlayerSelectorMenu = _PlayerSelectorMenu;

// src/controllers/music-controller.ts
var MusicController = class {
  constructor(context) {
    __publicField(this, "_context");
    __publicField(this, "_pill", null);
    __publicField(this, "_injector", null);
    __publicField(this, "_expanded", null);
    __publicField(this, "_playerMenu", null);
    __publicField(this, "_lastWinnerName", null);
    __publicField(this, "_lastActionTime", 0);
    __publicField(this, "_lastDisplay", null);
    __publicField(this, "_updateTimeoutId", null);
    __publicField(this, "_watchdogId", null);
    __publicField(this, "_signalIds", []);
    __publicField(this, "_settingsSignalIds", []);
    __publicField(this, "_overviewDragBegin", 0);
    __publicField(this, "_overviewDragEnd", 0);
    __publicField(this, "_isShuttingDown", false);
    this._context = context;
  }
  enable() {
    this._isShuttingDown = false;
    initDTDModule();
    this._createPill();
    this._context.mpris.setSystemSettings(this._context.settings.system);
    this._bindMprisSignals(this._context.mpris);
    this._bindSettingsSignals();
    if (Main5.layoutManager._startingUp) {
      const startupId = Main5.layoutManager.connect("startup-complete", () => {
        Main5.layoutManager.disconnect(startupId);
        this._doEnable();
      });
    } else {
      this._doEnable();
    }
  }
  disable() {
    var _a;
    this._isShuttingDown = true;
    this._clearTimers();
    this._unbindSignals();
    this.closePlayerMenu();
    if (this._expanded) {
      this._expanded.destroy();
      this._expanded = null;
    }
    (_a = this._injector) == null ? void 0 : _a.destroy();
    this._injector = null;
    if (this._pill) {
      this._pill.destroy();
      this._pill = null;
    }
    this._lastDisplay = null;
    this._lastWinnerName = null;
  }
  performAction(action) {
    var _a, _b;
    switch (action) {
      case "play_pause":
        this.togglePlayback();
        break;
      case "next":
        this.next();
        break;
      case "previous":
        this.previous();
        break;
      case "toggle_menu":
        this.toggleMenu();
        break;
      case "open_player_menu":
        this.togglePlayerMenu();
        break;
      case "open_settings":
        this._context.extension.openPreferences();
        break;
      case "open_app":
        (_a = this._getActivePlayerInstance()) == null ? void 0 : _a.raise();
        break;
      case "close_app":
        (_b = this._getActivePlayerInstance()) == null ? void 0 : _b.quit();
        break;
      default:
        logDebug(`Unknown action: ${action}`);
    }
  }
  togglePlayback() {
    var _a;
    (_a = this._getActivePlayerInstance()) == null ? void 0 : _a.playPause();
  }
  next() {
    var _a;
    this._lastActionTime = Date.now();
    (_a = this._getActivePlayerInstance()) == null ? void 0 : _a.next();
    this.triggerUpdate();
  }
  previous() {
    var _a;
    this._lastActionTime = Date.now();
    (_a = this._getActivePlayerInstance()) == null ? void 0 : _a.previous();
    this.triggerUpdate();
  }
  seekTo(player, positionUs) {
    try {
      player.setPosition(positionUs);
      this.triggerUpdate();
    } catch (e) {
      logDebug(`seekTo failed: ${e.message}`);
    }
  }
  selectPlayer(busName) {
    this._context.settings.popup.selectedPlayerBus = busName;
    this.triggerUpdate();
  }
  toggleMenu() {
    if (this._expanded) {
      this._expanded.hidePopup();
      return;
    }
    const player = this._getActivePlayerInstance();
    if (!player || !this._pill) {
      return;
    }
    this._expanded = new ExpandedPlayer({
      settings: this._context.settings,
      togglePlayback: () => this.togglePlayback(),
      next: () => this.next(),
      previous: () => this.previous(),
      seekTo: (p, pos) => this.seekTo(p, pos)
    });
    this._expanded.connect("destroy", () => {
      this._expanded = null;
    });
    Main5.layoutManager.addChrome(this._expanded);
    const color = this._pill.displayedColor;
    this._expanded.updateStyle(color.r, color.g, color.b, this._pill.currentBgAlpha);
    const [px, py] = this._pill.get_transformed_position();
    const [pw, ph] = this._pill.get_transformed_size();
    this._expanded.showFor(player, this._pill.lastArtUrl);
    this._expanded.setPositionNearPill(px, py, pw, ph);
  }
  togglePlayerMenu() {
    if (this._playerMenu) {
      this._playerMenu.hideMenu();
      return;
    }
    if (!this._pill) {
      return;
    }
    this._playerMenu = new PlayerSelectorMenu({
      settings: this._context.settings,
      getPlayers: () => this._context.mpris.getPlayers(),
      selectPlayer: (bus) => this.selectPlayer(bus),
      closePlayerMenu: () => this.closePlayerMenu()
    });
    this._playerMenu.connect("destroy", () => {
      this._playerMenu = null;
    });
    Main5.layoutManager.addChrome(this._playerMenu);
    const [px, py] = this._pill.get_transformed_position();
    const [pw, ph] = this._pill.get_transformed_size();
    this._playerMenu.showMenu(px, py, pw, ph);
  }
  closePlayerMenu() {
    if (!this._playerMenu) {
      return;
    }
    Main5.layoutManager.removeChrome(this._playerMenu);
    this._playerMenu.destroy();
    this._playerMenu = null;
  }
  triggerUpdate() {
    if (this._updateTimeoutId !== null) {
      return;
    }
    const delay = this._context.settings.system.compatibilityDelay ? 800 : 150;
    this._updateTimeoutId = GLib12.timeout_add(GLib12.PRIORITY_DEFAULT, delay, () => {
      this._updateTimeoutId = null;
      this._updateUI();
      return GLib12.SOURCE_REMOVE;
    });
  }
  _doEnable() {
    var _a;
    this._context.mpris.start(this._context.settings.system);
    (_a = this._injector) == null ? void 0 : _a.inject();
    this._watchdogId = GLib12.timeout_add_seconds(GLib12.PRIORITY_DEFAULT, 5, () => {
      var _a2, _b;
      if (this._isShuttingDown) {
        return GLib12.SOURCE_REMOVE;
      }
      if (!((_a2 = this._pill) == null ? void 0 : _a2.get_parent())) {
        (_b = this._injector) == null ? void 0 : _b.queueInject();
      }
      return GLib12.SOURCE_CONTINUE;
    });
    this._overviewDragBegin = Main5.overview.connect("item-drag-begin", () => {
    });
    this._overviewDragEnd = Main5.overview.connect("item-drag-end", () => {
      var _a2;
      (_a2 = this._injector) == null ? void 0 : _a2.queueInject();
    });
    this._context.mpris.rescan();
    this.triggerUpdate();
  }
  _createPill() {
    if (this._pill) {
      return;
    }
    this._pill = new MusicPill(this._context.settings);
    this._pill.setActionHandler((action) => this.performAction(action));
    this._injector = createPillInjector(this._pill, this._context.settings);
    this._pill.connect("destroy", () => {
      var _a;
      this._pill = null;
      if (!this._isShuttingDown) {
        (_a = this._injector) == null ? void 0 : _a.queueInject();
      }
    });
  }
  _bindMprisSignals(mpris) {
    const handler = () => this.triggerUpdate();
    this._signalIds.push(
      mpris.connect("player-added", handler),
      mpris.connect("player-removed", handler),
      mpris.connect("player-state-changed", handler),
      mpris.connect("player-track-changed", handler),
      mpris.connect("player-status-changed", handler)
    );
  }
  _bindSettingsSignals() {
    const { settings, mpris } = this._context;
    const rescan = () => {
      mpris.setSystemSettings(settings.system);
      mpris.rescan();
      this.triggerUpdate();
    };
    const reinject = () => {
      var _a;
      return (_a = this._injector) == null ? void 0 : _a.queueInject();
    };
    this._settingsSignalIds.push(
      settings.gioInternal.connect("changed::player-filter-mode", rescan),
      settings.gioInternal.connect("changed::player-filter-list", rescan),
      settings.gioInternal.connect("changed::target-container", reinject),
      settings.gioInternal.connect("changed::position-mode", reinject),
      settings.gioInternal.connect("changed::dock-position", reinject),
      settings.gioInternal.connect("changed::selected-player-bus", () => this.triggerUpdate())
    );
  }
  _getActivePlayerInstance() {
    return getActivePlayer({
      settings: this._context.settings,
      players: this._context.mpris.getPlayers(),
      lastActionTime: this._lastActionTime,
      lastWinnerName: this._lastWinnerName
    });
  }
  _updateUI() {
    var _a, _b, _c, _d, _e;
    if (!this._pill) {
      this._createPill();
    }
    if (!this._pill) {
      return;
    }
    if (!this._pill.get_parent()) {
      (_a = this._injector) == null ? void 0 : _a.inject();
    }
    const active = this._getActivePlayerInstance();
    if (!active) {
      this._pill.updateDisplay({
        title: void 0,
        artist: void 0,
        artUrl: void 0,
        status: "Stopped",
        busName: null
      });
      return;
    }
    if (this._lastWinnerName !== active.getBusName()) {
      this._lastDisplay = null;
    }
    this._lastWinnerName = active.getBusName();
    const display = resolveDisplayTrack(active, this._lastDisplay);
    this._lastDisplay = display;
    const status = active.getPlayerInfo().playbackStatus;
    this._pill.updateDisplay({
      title: display.title,
      artist: display.artist,
      artUrl: display.artUrl,
      status,
      busName: display.busName
    });
    if ((_b = this._expanded) == null ? void 0 : _b.visible) {
      this._expanded.setPlayer(active);
      this._expanded.updateContent(
        (_c = display.title) != null ? _c : null,
        (_d = display.artist) != null ? _d : null,
        (_e = display.artUrl) != null ? _e : null,
        status
      );
    }
  }
  _clearTimers() {
    if (this._updateTimeoutId !== null) {
      GLib12.source_remove(this._updateTimeoutId);
      this._updateTimeoutId = null;
    }
    if (this._watchdogId !== null) {
      GLib12.source_remove(this._watchdogId);
      this._watchdogId = null;
    }
  }
  _unbindSignals() {
    for (const id of this._signalIds) {
      this._context.mpris.disconnect(id);
    }
    this._signalIds = [];
    for (const id of this._settingsSignalIds) {
      this._context.settings.gioInternal.disconnect(id);
    }
    this._settingsSignalIds = [];
    if (this._overviewDragBegin) {
      Main5.overview.disconnect(this._overviewDragBegin);
      this._overviewDragBegin = 0;
    }
    if (this._overviewDragEnd) {
      Main5.overview.disconnect(this._overviewDragEnd);
      this._overviewDragEnd = 0;
    }
  }
};

// src/extension.ts
var instance = null;
function getAppContext() {
  if (instance === null) {
    throw new Error("getAppContext called before instance was created!");
  }
  return instance.context;
}
var DynamicMusicPillExtension = class extends extension_exports.Extension {
  constructor(metadata) {
    super(metadata);
    __publicField(this, "context");
    __publicField(this, "mpris");
    __publicField(this, "settings");
    __publicField(this, "controller");
    instance = this;
    loadEnv();
    this.initTranslations("dynamic-music-pill");
    this.settings = createSettingsProvider(this.getSettings());
    this.mpris = new MPRISProvider();
    this.context = {
      extension: this,
      settings: this.settings,
      mpris: this.mpris
    };
    this.controller = new MusicController(this.context);
  }
  enable() {
    logInfo("Extension enabled.");
    logInfo(isDevelopment() ? "Is Dev" : "Is Not Dev");
    this.controller.enable();
  }
  disable() {
    this.controller.disable();
    this.mpris.stop();
    logWarning("Extension disabled.");
  }
};
export {
  DynamicMusicPillExtension as default,
  getAppContext
};
//# sourceMappingURL=extension.js.map
