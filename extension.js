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
    set(_3, prop, value) {
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
    default: 22
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
    /** Cached MPRIS Position (µs) + wall-clock when it was sampled — for interpolation. */
    __publicField(this, "_lastPosition", 0);
    __publicField(this, "_lastPositionTime", Date.now());
    __publicField(this, "_seekedSignal", null);
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
    this._seekedSignal = this._connection.signal_subscribe(
      this._busName,
      MPRIS_INTERFACE,
      "Seeked",
      MPRIS_OBJECT,
      null,
      Gio3.DBusSignalFlags.NONE,
      (_c, _s, _p, _i, _sig, parameters) => {
        const [pos] = smartUnpack(parameters);
        if (typeof pos === "number" && pos >= 0) {
          this.markPosition(pos);
        }
      }
    );
    this._playerPropertiesTimer = GLib4.timeout_add(
      GLib4.PRIORITY_DEFAULT,
      5e3,
      this._fallbackPoll.bind(this)
    );
    this.syncPosition();
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
    return __spreadProps(__spreadValues({}, this._state.player), {
      position: this.getInterpolatedPosition()
    });
  }
  /** Wall-clock interpolation — MPRIS rarely pushes Position while playing. */
  getInterpolatedPosition() {
    var _a;
    let pos = this._lastPosition;
    if (this._state.player.playbackStatus === "Playing") {
      pos += (Date.now() - this._lastPositionTime) * 1e3;
    }
    const length = ((_a = this._state.trackInfo) == null ? void 0 : _a.length) || 0;
    if (length > 0 && pos > length) {
      pos = length;
    }
    return Math.max(0, pos);
  }
  markPosition(positionUs) {
    if (typeof positionUs !== "number" || positionUs < 0 || Number.isNaN(positionUs)) {
      return;
    }
    this._lastPosition = positionUs;
    this._lastPositionTime = Date.now();
    this._state.player.position = positionUs;
  }
  getCachedPosition() {
    return this._lastPosition;
  }
  getLastPositionTime() {
    return this._lastPositionTime;
  }
  /** Async Get(Position) — same role as legacy controller._syncPosition. */
  syncPosition() {
    this._connection.call(
      this._busName,
      MPRIS_OBJECT,
      DBUS_PROPERTIES_INTERFACE,
      "Get",
      new GLib4.Variant("(ss)", [MPRIS_INTERFACE, "Position"]),
      null,
      Gio3.DBusCallFlags.NONE,
      -1,
      null,
      (conn, res) => {
        try {
          const result = conn.call_finish(res);
          const packed = result.deep_unpack();
          let val = packed[0];
          if (val instanceof GLib4.Variant) {
            val = val.unpack();
          }
          if (typeof val === "number" && val >= 0) {
            this.markPosition(val);
          }
        } catch (e) {
        }
      }
    );
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
    this.markPosition(positionUs);
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
    if (this._seekedSignal !== null) {
      this._connection.signal_unsubscribe(this._seekedSignal);
      this._seekedSignal = null;
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
    var _a, _b, _c, _d;
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
      const posChanged = newState.player.position !== oldState.player.position && typeof newState.player.position === "number" && newState.player.position >= 0;
      if (posChanged) {
        this._lastPosition = newState.player.position;
        this._lastPositionTime = Date.now();
      }
      const statusChanged = newState.player.playbackStatus !== oldState.player.playbackStatus;
      const capsChanged = newState.player.canGoNext !== oldState.player.canGoNext || newState.player.canGoPrevious !== oldState.player.canGoPrevious || newState.player.canPause !== oldState.player.canPause || newState.player.canPlay !== oldState.player.canPlay || newState.player.canSeek !== oldState.player.canSeek || newState.player.canControl !== oldState.player.canControl || newState.player.volume !== oldState.player.volume;
      this._state.player = newState.player;
      if (statusChanged || capsChanged) {
        this._mpris.emit("player-state-changed", this._busName, this);
      }
      if (statusChanged) {
        this._lastPositionTime = Date.now();
        this.syncPosition();
        this._mpris.emit("player-status-changed", this._busName, newState.player.playbackStatus);
      }
    }
    if (trackChanged) {
      this._state.trackInfo = newState.trackInfo;
      if (((_c = newState.trackInfo) == null ? void 0 : _c.trackId) !== ((_d = oldState.trackInfo) == null ? void 0 : _d.trackId)) {
        this._lastPosition = 0;
        this._lastPositionTime = Date.now();
        this.syncPosition();
      }
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
import GLib15 from "gi://GLib";
import * as Main6 from "resource:///org/gnome/shell/ui/main.js";

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
import GObject11 from "gi://GObject";
import St8 from "gi://St";
import Clutter9 from "gi://Clutter";
import GLib11 from "gi://GLib";
import Gio6 from "gi://Gio";

// src/components/crossfade-art.ts
import St from "gi://St";
import GObject3 from "gi://GObject";
import Clutter from "gi://Clutter";
var _CrossfadeArt = class _CrossfadeArt extends St.Widget {
  constructor(properties) {
    super(__spreadValues({
      layout_manager: new Clutter.BinLayout(),
      style_class: "art-widget",
      clip_to_allocation: false,
      x_expand: false,
      y_expand: false
    }, properties));
    __publicField(this, "_radius", 10);
    __publicField(this, "_shadowCSS", "box-shadow: none;");
    __publicField(this, "_currentUrl");
  }
  setRadius(r) {
    this._radius = typeof r === "number" && !Number.isNaN(r) ? r : 10;
    this._updateContainerStyle();
    for (const c of this.get_children()) {
      this._refreshLayerStyle(c);
    }
  }
  setShadowStyle(cssString) {
    this._shadowCSS = cssString || "box-shadow: none;";
    this._updateContainerStyle();
    for (const c of this.get_children()) {
      this._refreshLayerStyle(c);
    }
  }
  _updateContainerStyle() {
    const safeR = typeof this._radius === "number" && !Number.isNaN(this._radius) ? this._radius : 10;
    const hasArt = !!(this._currentUrl && this._currentUrl.length > 0);
    const activeShadow = hasArt ? this._shadowCSS : "box-shadow: none;";
    const bgColor = hasArt ? "background-color: #000000;" : "background-color: transparent;";
    this.set_style(`border-radius: ${safeR}px; ${bgColor} ${activeShadow}`);
  }
  _refreshLayerStyle(layer) {
    if (!layer || !layer.get_parent()) {
      return;
    }
    const url = layer._bgUrl;
    const bgPart = url ? `background-image: url("${url}");` : "";
    const safeR = typeof this._radius === "number" && !Number.isNaN(this._radius) ? this._radius : 10;
    const newCss = `border-radius: ${safeR}px; background-size: cover; box-shadow: none; ${bgPart}`;
    if (layer._lastCss === newCss) {
      return;
    }
    layer._lastCss = newCss;
    if (layer.get_parent()) {
      layer.set_style(newCss);
    }
  }
  setArt(newUrl, _force = false) {
    const children = this.get_children();
    if (children.length > 0 && children[children.length - 1]._bgUrl === newUrl) {
      return;
    }
    this._currentUrl = newUrl != null ? newUrl : void 0;
    this._updateContainerStyle();
    for (const c of this.get_children()) {
      c.remove_all_transitions();
    }
    const newLayer = new St.Widget({
      x_expand: true,
      y_expand: true,
      opacity: 0
    });
    newLayer._bgUrl = newUrl != null ? newUrl : void 0;
    this.add_child(newLayer);
    this._refreshLayerStyle(newLayer);
    newLayer.ease({
      opacity: 255,
      duration: 1800,
      mode: Clutter.AnimationMode.EASE_OUT_QUAD,
      onStopped: (isFinished) => {
        if (!isFinished) {
          return;
        }
        newLayer.opacity = 255;
        const currentChildren = this.get_children();
        const myIndex = currentChildren.indexOf(newLayer);
        if (myIndex > 0) {
          for (let i = 0; i < myIndex; i++) {
            const oldLayer = currentChildren[i];
            oldLayer.ease({
              opacity: 0,
              duration: 300,
              mode: Clutter.AnimationMode.EASE_OUT_QUAD,
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
import St2 from "gi://St";
import GObject4 from "gi://GObject";
var _PixelSnappedBox = class _PixelSnappedBox extends St2.BoxLayout {
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
import GObject7 from "gi://GObject";
import St4 from "gi://St";
import Clutter4 from "gi://Clutter";

// src/components/scroll-label.ts
import St3 from "gi://St";
import Clutter3 from "gi://Clutter";
import GObject6 from "gi://GObject";
import Pango from "gi://Pango";
import GLib7 from "gi://GLib";

// src/components/effects/text-fade-effect.ts
import Clutter2 from "gi://Clutter";
import GObject5 from "gi://GObject";
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

        float pos_x = uv.x * width;

        float left_fade = smoothstep(0.0, fade_pixels, pos_x);
        float right_fade = smoothstep(0.0, fade_pixels, width - pos_x);

        float left_alpha = mix(1.0, left_fade, enable_left);
        float right_alpha = mix(1.0, right_fade, enable_right);

        float alpha = min(left_alpha, right_alpha);
        cogl_color_out = vec4(color.rgb * alpha, color.a * alpha) * cogl_color_in;
    }
`;
var _TextFadeEffect = class _TextFadeEffect extends Clutter2.ShaderEffect {
  constructor(fadePixels = 32, properties) {
    super(__spreadValues({
      shader_type: 1
    }, properties));
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
    const targetLeft = left ? 1 : 0;
    const targetRight = right ? 1 : 0;
    if (this._animId) {
      GLib6.Source.remove(this._animId);
      this._animId = null;
    }
    if (!animate) {
      this._enableLeft = targetLeft;
      this._enableRight = targetRight;
      const actor = this.get_actor();
      if (actor) {
        actor.queue_redraw();
      }
      return;
    }
    const startLeft = this._enableLeft;
    const startRight = this._enableRight;
    const startTime = Date.now();
    const duration = 300;
    this._animId = GLib6.timeout_add(GLib6.PRIORITY_DEFAULT, 16, () => {
      const actor = this.get_actor();
      if (!actor) {
        this._animId = null;
        return GLib6.SOURCE_REMOVE;
      }
      const now = Date.now();
      const p = Math.min(1, (now - startTime) / duration);
      const t = p * (2 - p);
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
    const actor = this.get_actor();
    if (actor) {
      const widthVal = new GObject5.Value();
      widthVal.init(GObject5.TYPE_FLOAT);
      widthVal.set_float(actor.get_width());
      this.set_uniform_value("width", widthVal);
      const fadeVal = new GObject5.Value();
      fadeVal.init(GObject5.TYPE_FLOAT);
      fadeVal.set_float(this._fadePixels);
      this.set_uniform_value("fade_pixels", fadeVal);
      const leftVal = new GObject5.Value();
      leftVal.init(GObject5.TYPE_FLOAT);
      leftVal.set_float(this._enableLeft);
      this.set_uniform_value("enable_left", leftVal);
      const rightVal = new GObject5.Value();
      rightVal.init(GObject5.TYPE_FLOAT);
      rightVal.set_float(this._enableRight);
      this.set_uniform_value("enable_right", rightVal);
    }
    super.vfunc_paint_target(node, paint_context);
  }
};
GObject5.registerClass(_TextFadeEffect);
var TextFadeEffect = _TextFadeEffect;

// src/components/scroll-label.ts
var ease = (actor) => actor;
var _ScrollLabel = class _ScrollLabel extends St3.Widget {
  constructor(styleClass, properties) {
    super(properties != null ? properties : {});
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
    this.layout_manager = new Clutter3.BinLayout();
    this.set_x_expand(true);
    this.set_y_expand(false);
    this.set_clip_to_allocation(true);
    this._appContext = getAppContext();
    const { scrollControls } = this._appContext.settings;
    this._hoverOnly = scrollControls.onHoverOnly;
    this._container = new PixelSnappedBox({
      x_expand: true,
      y_expand: true,
      x_align: Clutter3.ActorAlign.CENTER,
      y_align: Clutter3.ActorAlign.CENTER,
      orientation: Clutter3.Orientation.HORIZONTAL
    });
    this.add_child(this._container);
    this._label1 = new St3.Label({
      style_class: styleClass || "music-label-title",
      y_align: Clutter3.ActorAlign.CENTER
    });
    this._label1.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
    this._label1.clutter_text.line_wrap = false;
    this._label2 = new St3.Label({
      style_class: styleClass || "music-label-title",
      y_align: Clutter3.ActorAlign.CENTER
    });
    this._label2.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
    this._label2.clutter_text.line_wrap = false;
    this._separator = new St3.Widget({ width: 30 });
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
    let fadeWidth = fontDesc.get_size() / Pango.SCALE + 4;
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
      if (!this._paused) {
        this._paused = true;
        this._cleanupTimers();
        this._stopAnimation(true);
      }
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
      this._container.x_align = Clutter3.ActorAlign.CENTER;
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
        this._container.x_align = Clutter3.ActorAlign.START;
        if (this._lyricTime > 0) {
          this._startLyricScroll(textWidth);
        } else if (!this._hoverOnly || this._hovered || this._forceScroll) {
          this._startInfiniteScroll(textWidth);
        }
      } else if (!needsScroll && isScrolling) {
        this._stopAnimation(true);
        this._container.x_align = Clutter3.ActorAlign.CENTER;
        this._label2.hide();
        this._separator.hide();
      } else if (!needsScroll) {
        this._stopAnimation(true);
        this._container.x_align = Clutter3.ActorAlign.CENTER;
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
    this._container.x_align = Clutter3.ActorAlign.CENTER;
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
      ease(this._label1).ease({
        opacity: 255,
        duration,
        mode: Clutter3.AnimationMode.EASE_OUT_QUAD
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
      this._container.x_align = Clutter3.ActorAlign.START;
      if (this._lyricTime > 0) {
        this._startLyricScroll(textWidth);
      } else if (this._appContext.settings.scrollControls.scrollText) {
        if (!this._hoverOnly || this._hovered || this._forceScroll) {
          this._startInfiniteScroll(textWidth);
        }
      }
    } else {
      this._stopAnimation(true);
      this._container.x_align = Clutter3.ActorAlign.CENTER;
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
        return;
      }
      this._setFadeOutEffect(false, true, true);
      if (this._scrollTimer) {
        GLib7.Source.remove(this._scrollTimer);
      }
      this._scrollTimer = GLib7.timeout_add(GLib7.PRIORITY_DEFAULT, 2e3, () => {
        this._scrollTimer = null;
        if (this._gameMode || !this.get_parent()) {
          return GLib7.SOURCE_REMOVE;
        }
        if (this._pendingScrollStop) {
          this._pendingScrollStop = false;
          this._isScrolling = false;
          this._stopAnimation(true);
          this._container.x_align = Clutter3.ActorAlign.CENTER;
          this._label2.hide();
          this._separator.hide();
          return GLib7.SOURCE_REMOVE;
        }
        this._setFadeOutEffect(true, true, true);
        ease(this._container).ease({
          translation_x: -distance,
          duration,
          mode: Clutter3.AnimationMode.LINEAR,
          onStopped: (isFinished) => {
            if (!isFinished || this._gameMode || this._pendingScrollStop) {
              this._isScrolling = false;
              this._pendingScrollStop = false;
              return;
            }
            this._container.translation_x = 0;
            GLib7.idle_add(GLib7.PRIORITY_DEFAULT_IDLE, () => {
              loop();
              return GLib7.SOURCE_REMOVE;
            });
          }
        });
        return GLib7.SOURCE_REMOVE;
      });
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
      ease(this._container).ease({
        translation_x: -distance,
        duration: scrollDuration,
        mode: Clutter3.AnimationMode.LINEAR,
        onStopped: () => {
          this._isScrolling = false;
          this._lyricFinished = true;
        }
      });
      return GLib7.SOURCE_REMOVE;
    });
  }
};
GObject6.registerClass(_ScrollLabel);
var ScrollLabel = _ScrollLabel;

// src/ui/music-pill/components/text-block/index.ts
var _TextBlock = class _TextBlock extends St4.Widget {
  constructor() {
    super({
      layout_manager: new Clutter4.BinLayout(),
      x_expand: true,
      y_expand: true,
      clip_to_allocation: true,
      style: "min-width: 10px; margin-right: 4px; margin-left: 2px;"
    });
    __publicField(this, "titleScroll");
    __publicField(this, "artistScroll");
    __publicField(this, "_textBox");
    this._textBox = new St4.BoxLayout({
      x_expand: true,
      y_align: Clutter4.ActorAlign.CENTER,
      x_align: Clutter4.ActorAlign.FILL,
      style: "padding-left: 0px; padding-right: 0px; spacing: 0px;"
    });
    this._textBox.layout_manager.orientation = Clutter4.Orientation.VERTICAL;
    this.titleScroll = new ScrollLabel("music-label-title");
    this.artistScroll = new ScrollLabel("music-label-artist");
    this._textBox.add_child(this.titleScroll);
    this._textBox.add_child(this.artistScroll);
    this.add_child(this._textBox);
  }
  setTitle(text) {
    this.titleScroll.setText(text != null ? text : "", true, 0);
  }
  setArtist(text) {
    this.artistScroll.setText(text != null ? text : "", true);
  }
  setPlayerPaused(paused) {
    this.titleScroll.setPlayerPaused(paused);
    this.artistScroll.setPlayerPaused(paused);
  }
  setLabelStyles(titleCss, artistCss) {
    this.titleScroll.setLabelStyle(titleCss);
    this.artistScroll.setLabelStyle(artistCss);
  }
  setArtistVisible(visible) {
    this.artistScroll.visible = visible;
  }
  setTextOpacity(opacity) {
    this._textBox.set_opacity(opacity);
  }
};
GObject7.registerClass(_TextBlock);
var TextBlock = _TextBlock;

// src/ui/music-pill/components/tablet-controls.ts
import GObject8 from "gi://GObject";
import St5 from "gi://St";
import Clutter5 from "gi://Clutter";
var _TabletControls = class _TabletControls extends St5.BoxLayout {
  constructor() {
    super({
      vertical: false,
      y_align: Clutter5.ActorAlign.CENTER,
      style: "margin-left: 6px;",
      visible: false
    });
    __publicField(this, "prevBtn");
    __publicField(this, "playPauseBtn");
    __publicField(this, "nextBtn");
    __publicField(this, "_onAction", null);
    this.prevBtn = new St5.Button({
      style_class: "tablet-skip-btn",
      child: new St5.Icon({ icon_name: "media-skip-backward-symbolic", icon_size: 20 }),
      reactive: true
    });
    this.playPauseBtn = new St5.Button({
      style_class: "tablet-skip-btn",
      child: new St5.Icon({ icon_name: "media-playback-start-symbolic", icon_size: 20 }),
      reactive: true
    });
    this.nextBtn = new St5.Button({
      style_class: "tablet-skip-btn",
      child: new St5.Icon({ icon_name: "media-skip-forward-symbolic", icon_size: 20 }),
      reactive: true
    });
    this.add_child(this.prevBtn);
    this.add_child(this.playPauseBtn);
    this.add_child(this.nextBtn);
    this.prevBtn.connect("button-press-event", () => Clutter5.EVENT_STOP);
    this.playPauseBtn.connect("button-press-event", () => Clutter5.EVENT_STOP);
    this.nextBtn.connect("button-press-event", () => Clutter5.EVENT_STOP);
    this.prevBtn.connect("button-release-event", () => {
      var _a;
      (_a = this._onAction) == null ? void 0 : _a.call(this, "previous");
      return Clutter5.EVENT_STOP;
    });
    this.playPauseBtn.connect("button-release-event", () => {
      var _a;
      (_a = this._onAction) == null ? void 0 : _a.call(this, "toggle");
      return Clutter5.EVENT_STOP;
    });
    this.nextBtn.connect("button-release-event", () => {
      var _a;
      (_a = this._onAction) == null ? void 0 : _a.call(this, "next");
      return Clutter5.EVENT_STOP;
    });
  }
  setActionHandler(handler) {
    this._onAction = handler;
  }
  setPlaying(playing) {
    const icon = this.playPauseBtn.child;
    icon.icon_name = playing ? "media-playback-pause-symbolic" : "media-playback-start-symbolic";
  }
  applyMode(tabletSetting, gameMode) {
    if (tabletSetting > 0 && !gameMode) {
      this.show();
      this.prevBtn.visible = tabletSetting === 1 || tabletSetting === 3;
      this.nextBtn.visible = tabletSetting === 1 || tabletSetting === 3;
      this.playPauseBtn.visible = tabletSetting === 2 || tabletSetting === 3;
    } else {
      this.hide();
    }
  }
};
GObject8.registerClass(_TabletControls);
var TabletControls = _TabletControls;

// src/ui/visualizers/waveform.ts
import GObject10 from "gi://GObject";
import GLib9 from "gi://GLib";
import St7 from "gi://St";
import Clutter7 from "gi://Clutter";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { gettext as _ } from "resource:///org/gnome/shell/extensions/extension.js";

// src/ui/visualizers/simulated.ts
import GObject9 from "gi://GObject";
import GLib8 from "gi://GLib";
import St6 from "gi://St";
import Clutter6 from "gi://Clutter";
var _SimulatedVisualizer = class _SimulatedVisualizer extends St6.BoxLayout {
  constructor(settings, isPopup = false) {
    super({
      style: "spacing: 2px;",
      y_align: Clutter6.ActorAlign.FILL,
      x_align: Clutter6.ActorAlign.END
    });
    __publicField(this, "_settings");
    __publicField(this, "_isPopup");
    __publicField(this, "_bars", []);
    __publicField(this, "_color", "255,255,255");
    __publicField(this, "_mode", 1);
    __publicField(this, "_isPlaying", false);
    __publicField(this, "_timerId", null);
    this.layout_manager.orientation = Clutter6.Orientation.HORIZONTAL;
    this._settings = settings;
    this._isPopup = isPopup;
    this._updateBarCount();
    this.connect("destroy", () => this._cleanup());
  }
  _updateBarCount() {
    this.destroy_all_children();
    this._bars = [];
    const count = this._isPopup ? this._settings.popup.popupVisualizerBars || 10 : this._settings.style.visualizerBarCount || 4;
    const barWidth = this._isPopup ? this._settings.popup.popupVisualizerBarWidth || 2 : this._settings.style.visualizerBarWidth || 2;
    for (let i = 0; i < count; i++) {
      const bar = new St6.Widget({
        style_class: "visualizer-bar",
        y_expand: true,
        y_align: Clutter6.ActorAlign.FILL
      });
      bar.set_width(barWidth);
      bar.set_pivot_point(0.5, this._mode === 2 ? 0.5 : 1);
      this.add_child(bar);
      this._bars.push(bar);
    }
    this._updateBarsCss();
  }
  _cleanup() {
    if (this._timerId !== null) {
      GLib8.source_remove(this._timerId);
      this._timerId = null;
    }
  }
  setMode(m) {
    this._mode = m;
    const pivotY = m === 2 ? 0.5 : 1;
    for (const bar of this._bars) {
      bar.set_pivot_point(0.5, pivotY);
    }
  }
  setColor(c) {
    let r = 255, g = 255, b = 255;
    if (c && typeof c.r === "number" && !Number.isNaN(c.r)) r = Math.min(255, c.r + 100);
    if (c && typeof c.g === "number" && !Number.isNaN(c.g)) g = Math.min(255, c.g + 100);
    if (c && typeof c.b === "number" && !Number.isNaN(c.b)) b = Math.min(255, c.b + 100);
    this._color = `${Math.floor(r)},${Math.floor(g)},${Math.floor(b)}`;
    this._updateBarsCss();
    if (!this._isPlaying) {
      this._updateVisuals(0);
    }
  }
  setPlaying(playing) {
    if (this._isPlaying === playing) {
      return;
    }
    this._isPlaying = playing;
    this._updateBarsCss();
    if (this._timerId !== null) {
      GLib8.source_remove(this._timerId);
      this._timerId = null;
    }
    if (playing && this._mode !== 0) {
      this._timerId = GLib8.timeout_add(GLib8.PRIORITY_DEFAULT, 16, () => {
        if (!this.get_parent()) {
          this._timerId = null;
          return GLib8.SOURCE_REMOVE;
        }
        if (!this.mapped) {
          return GLib8.SOURCE_CONTINUE;
        }
        const t = Date.now() / 250;
        this._updateVisuals(t);
        return GLib8.SOURCE_CONTINUE;
      });
    } else {
      this._updateVisuals(0);
    }
  }
  _updateBarsCss() {
    const opacity = this._isPlaying ? 1 : 0.4;
    const barWidth = this._isPopup ? this._settings.popup.popupVisualizerBarWidth || 2 : this._settings.style.visualizerBarWidth || 2;
    const bRad = barWidth >= 4 ? 2 : barWidth > 1 ? 1 : 0;
    const css = `background-color: rgba(${this._color}, ${opacity}); border-radius: ${bRad}px;`;
    for (const bar of this._bars) {
      bar.set_style(css);
    }
  }
  _updateVisuals(t) {
    if (!this.get_parent()) {
      return;
    }
    if (!this._isPlaying) {
      for (const bar of this._bars) {
        bar.scale_y = 0.2;
      }
      return;
    }
    const speeds = [1.1, 1.6, 1.3, 1.8, 1.5, 1.2, 1.7, 1.4];
    this._bars.forEach((bar, idx) => {
      let scaleY = 0.2;
      if (this._mode === 1) {
        const wave = (Math.sin(t - idx * 1) + 1) / 2;
        scaleY = 0.3 + wave * 0.7;
      } else if (this._mode === 2) {
        const pulse = (Math.sin(t * speeds[idx % speeds.length]) + 1) / 2;
        scaleY = 0.3 + pulse * 0.7;
      }
      bar.scale_y = scaleY;
    });
  }
  destroy() {
    this._cleanup();
    super.destroy();
  }
};
GObject9.registerClass(_SimulatedVisualizer);
var SimulatedVisualizer = _SimulatedVisualizer;

// src/ui/visualizers/waveform.ts
var _WaveformVisualizer = class _WaveformVisualizer extends St7.Bin {
  constructor(defaultHeight = 24, settings, isPopup = false) {
    super({
      y_align: Clutter7.ActorAlign.CENTER,
      x_align: Clutter7.ActorAlign.END,
      y_expand: true
    });
    __publicField(this, "_settings");
    __publicField(this, "_isPopup");
    __publicField(this, "_simulated");
    __publicField(this, "_mode", 1);
    __publicField(this, "_isPlaying", false);
    __publicField(this, "_maxHeight", null);
    __publicField(this, "_lastColor", null);
    this._settings = settings;
    this._isPopup = isPopup;
    this._simulated = new SimulatedVisualizer(settings, isPopup);
    this.set_child(this._simulated);
    if (this._isPopup) {
      this._settings.popup.connect("changed::popup-visualizer-bars", () => this._updateSize());
      this._settings.popup.connect("changed::popup-visualizer-bar-width", () => this._updateSize());
      this._settings.popup.connect("changed::popup-visualizer-height", () => this._updateSize());
    } else {
      this._settings.style.connect("changed::visualizer-bars", () => this._updateSize());
      this._settings.style.connect("changed::visualizer-bar-width", () => this._updateSize());
      this._settings.style.connect("changed::visualizer-height", () => this._updateSize());
    }
    this._updateSize();
    void defaultHeight;
  }
  _updateSize() {
    let h = this._isPopup ? this._settings.popup.popupVisualizerHeight || 80 : this._settings.style.visualizerHeight || 24;
    if (this._maxHeight && !this._isPopup) {
      h = Math.min(h, this._maxHeight);
    }
    this.set_height(h);
    this._simulated.set_height(h);
    this._simulated._updateBarCount();
  }
  setHeightClamped(maxH) {
    this._maxHeight = maxH;
    this._updateSize();
  }
  setMode(m) {
    if (m === 3 && !GLib9.find_program_in_path("cava")) {
      Main.notify("Dynamic Music Pill", _('Please install "cava" for real-time mode.'));
      m = 2;
    }
    if (m === 3) {
      m = 2;
    }
    this._mode = m;
    this._simulated.setMode(m);
    this._simulated.setPlaying(this._isPlaying);
  }
  setColor(c) {
    this._lastColor = c;
    this._simulated.setColor(c);
  }
  setPlaying(playing) {
    this._isPlaying = playing;
    this._simulated.setPlaying(playing);
  }
};
GObject10.registerClass(_WaveformVisualizer);
var WaveformVisualizer = _WaveformVisualizer;

// src/ui/music-pill/handlers/style.ts
function applyPillBodyStyle(body, settings, state, color, alpha = 1, playing = false) {
  var _a;
  const dynR = Number.isFinite(color.r) ? Math.floor(color.r) : 40;
  const dynG = Number.isFinite(color.g) ? Math.floor(color.g) : 40;
  const dynB = Number.isFinite(color.b) ? Math.floor(color.b) : 40;
  let r = dynR, g = dynG, b = dynB;
  if (settings.style.useCustomColors) {
    const parts = (settings.style.customBgColor || "40,40,40").split(",").map((s) => parseInt(s.trim(), 10));
    r = Number.isFinite(parts[0]) ? parts[0] : 40;
    g = Number.isFinite(parts[1]) ? parts[1] : 40;
    b = Number.isFinite(parts[2]) ? parts[2] : 40;
  }
  let radius = settings.style.corderRadius;
  if (!Number.isFinite(radius) || radius <= 0) {
    radius = 28;
  }
  state.radius = radius;
  const padX = Number.isFinite(state.paddingX) ? Math.floor(state.paddingX) : 14;
  const padY = Number.isFinite(state.paddingY) ? Math.floor(state.paddingY) : 6;
  const bg = `background-color: rgba(${r}, ${g}, ${b}, ${alpha});`;
  let border = "border-width: 0px; border-color: transparent;";
  if (settings.style.showPillOutline) {
    const borderOp = playing ? 0.2 : 0.1;
    border = `border-width: 1px; border-style: solid; border-color: rgba(255, 255, 255, ${borderOp});`;
  }
  let shadow = state.shadowCSS || "box-shadow: none;";
  if (settings.pill.enableShadow) {
    const blur = settings.pill.shadowBlur || 8;
    const opacity = ((_a = settings.pill.shadowOpacity) != null ? _a : 50) / 100;
    shadow = `box-shadow: 0px 2px ${blur}px rgba(0, 0, 0, ${opacity});`;
    state.shadowCSS = shadow;
  } else {
    shadow = "box-shadow: none;";
    state.shadowCSS = shadow;
  }
  const css = `${bg} ${border} padding: ${padY}px ${padX}px; border-radius: ${radius}px; ${shadow}`;
  if (state.lastBodyCss !== css) {
    state.lastBodyCss = css;
    body.set_style(css);
  }
  state.displayedColor = { r: dynR, g: dynG, b: dynB };
}

// src/ui/music-pill/handlers/dimensions.ts
import Clutter8 from "gi://Clutter";
function updatePillDimensions(settings, state, actors, currentStatus, isPopupOpen = false) {
  const { pill, body, artWidget, artBin, textBlock, visualizer, visBin, tabletControls } = actors;
  if (!pill.get_parent()) {
    return;
  }
  const target = settings.style.targetContainer;
  state.inPanel = target > 0;
  const parent = pill.get_parent();
  let isSidePanel = false;
  if (parent && !state.inPanel) {
    const [pw, ph] = parent.get_size();
    if (pw > 0 && ph > 0 && pw < ph) {
      isSidePanel = true;
    }
  }
  pill.set_width(-1);
  const confWidth = state.inPanel ? settings.style.panelWidth : settings.pill.dockWidth;
  const width = confWidth;
  const height = state.inPanel ? settings.style.panelHeight : settings.pill.dockHeight;
  const prefArtSize = state.inPanel ? settings.style.panelArtSize : settings.pill.albumArtSize;
  const vOffset = settings.pill.verticalOffset;
  const hOffset = settings.pill.horizontalOffset;
  const visStyle = settings.style.visualizerAnimation;
  state.radius = settings.style.corderRadius;
  const shadowEnabled = settings.pill.enableShadow;
  const shadowBlur = settings.pill.shadowBlur;
  const shadowOpacity = settings.pill.shadowOpacity / 100;
  let fontSizeTitle = "11pt";
  let fontSizeArtist = "9pt";
  if (state.inPanel) {
    state.paddingY = 0;
    fontSizeTitle = "10pt";
    fontSizeArtist = "8pt";
  } else {
    const rawPadY = Math.floor(height / 10);
    state.paddingY = Math.max(2, Math.min(8, rawPadY));
  }
  state.paddingX = settings.style.outerEdgeMargin;
  if (isSidePanel) {
    const temp = state.paddingX;
    state.paddingX = state.paddingY;
    state.paddingY = temp;
  }
  let hideText = settings.pill.hideText;
  if (isSidePanel) {
    hideText = true;
    body.layout_manager.orientation = Clutter8.Orientation.VERTICAL;
  } else {
    body.layout_manager.orientation = Clutter8.Orientation.HORIZONTAL;
  }
  textBlock.visible = !hideText;
  body.translation_y = vOffset;
  body.translation_x = hOffset;
  if (shadowEnabled) {
    state.shadowCSS = `box-shadow: 0px 2px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity});`;
  } else {
    state.shadowCSS = "box-shadow: none;";
  }
  const artRadius = Math.max(4, state.radius - (isSidePanel ? state.paddingX : state.paddingY));
  let maxArtHeight = (isSidePanel ? width : height) - 2 * (isSidePanel ? state.paddingX : state.paddingY);
  if (maxArtHeight < 10) {
    maxArtHeight = 10;
  }
  const finalArtSize = Math.min(prefArtSize, maxArtHeight);
  artWidget.set_width(finalArtSize);
  artWidget.set_height(finalArtSize);
  artBin.set_width(finalArtSize);
  artBin.set_height(finalArtSize);
  artWidget.setRadius(artRadius);
  artWidget.setShadowStyle(state.shadowCSS);
  visualizer.setMode(visStyle);
  visualizer.setHeightClamped(maxArtHeight);
  const tabletSetting = settings.pill.tabletMode;
  tabletControls.applyMode(tabletSetting, state.gameMode);
  repositionTabletControls(body, tabletControls, settings.pill.controlsPosition);
  if (isSidePanel) {
    tabletControls.layout_manager.orientation = Clutter8.Orientation.VERTICAL;
    tabletControls.set_style("margin: 0px;");
  } else {
    tabletControls.layout_manager.orientation = Clutter8.Orientation.HORIZONTAL;
    const controlsPos = settings.pill.controlsPosition;
    tabletControls.set_style(
      controlsPos === 0 ? "margin-left: 6px; margin-top: 0px;" : "margin-left: 6px; margin-right: 4px; margin-top: 0px;"
    );
  }
  let forceHideVis = isPopupOpen && settings.popup.hidePillVisualizer && settings.popup.showVisualizer;
  if (currentStatus === "Stopped") {
    forceHideVis = forceHideVis || false;
  }
  const isDynamic = settings.pill.dynamicWidth;
  if (width < 220 && !hideText && !isDynamic || visStyle === 0 || forceHideVis) {
    visBin.hide();
    visBin.set_width(0);
    visBin.set_height(0);
    visBin.set_style("margin: 0px;");
    if (!tabletSetting || state.gameMode) {
      const artMargin = hideText ? 0 : width < 180 ? 4 : 8;
      artBin.set_style(isSidePanel ? `margin-bottom: ${artMargin}px; margin-right: 0px;` : `margin-right: ${artMargin}px; margin-bottom: 0px;`);
    } else {
      const artMargin = hideText ? 0 : 2;
      artBin.set_style(isSidePanel ? `margin-bottom: ${artMargin}px; margin-right: 0px;` : `margin-right: ${artMargin}px; margin-bottom: 0px;`);
    }
  } else {
    visBin.show();
    const sideMargin = hideText ? 6 : settings.style.visualizerMargin;
    if (isSidePanel) {
      visBin.set_style(`margin-top: ${sideMargin}px; margin-left: 0px;`);
      visBin.set_height(-1);
      visBin.set_width(finalArtSize);
      artBin.set_style(`margin-bottom: ${sideMargin}px; margin-right: 0px;`);
    } else {
      visBin.set_style(`margin-left: ${sideMargin}px; margin-top: 0px;`);
      visBin.set_width(-1);
      visBin.set_height(-1);
      artBin.set_style(`margin-right: ${sideMargin}px; margin-bottom: 0px;`);
    }
  }
  const customTextStr = settings.style.useCustomColors ? `rgb(${settings.style.customTextColor})` : "white";
  const customTextAlpha = settings.style.useCustomColors ? `rgba(${settings.style.customTextColor}, 0.7)` : "rgba(255,255,255,0.7)";
  const borderOffset = settings.style.showPillOutline ? 2 : 0;
  const effectiveHeight = height - borderOffset;
  const showArtist = settings.pill.showArtist;
  if (!showArtist) {
    textBlock.setArtistVisible(false);
  } else if (effectiveHeight < 46 && !state.inPanel) {
    textBlock.setArtistVisible(false);
  } else if (state.inPanel && effectiveHeight < 30) {
    textBlock.setArtistVisible(false);
  } else {
    textBlock.setArtistVisible(true);
  }
  textBlock.setLabelStyles(
    `font-size: ${fontSizeTitle}; font-weight: 800; color: ${customTextStr}; margin: 0px; padding: 0px;`,
    `font-size: ${fontSizeArtist}; font-weight: 500; color: ${customTextAlpha}; margin: 0px; padding: 0px;`
  );
  state.targetWidth = confWidth;
  body.set_height(height);
  if (!settings.pill.dynamicWidth && !hideText && confWidth > 0) {
    body.set_width(confWidth);
  }
  pill.set_height(height);
}
function repositionTabletControls(body, tabletControls, pos) {
  if (tabletControls.get_parent() === body) {
    body.remove_child(tabletControls);
  }
  switch (pos) {
    case 1:
      body.insert_child_at_index(tabletControls, 2);
      break;
    case 2:
      body.add_child(tabletControls);
      break;
    default:
      body.insert_child_at_index(tabletControls, 1);
      break;
  }
}

// src/ui/music-pill/handlers/color-from-art.ts
import Gio5 from "gi://Gio";
import GdkPixbuf from "gi://GdkPixbuf";

// src/utils/color.ts
function getAverageColor(pixbuf) {
  const w = pixbuf.get_width();
  const h = pixbuf.get_height();
  const pixels = pixbuf.get_pixels();
  const rowstride = pixbuf.get_rowstride();
  const nChannels = pixbuf.get_n_channels();
  let r = 0, g = 0, b = 0, count = 0;
  for (let y = 0; y < h; y += 20) {
    for (let x = 0; x < w; x += 20) {
      const idx = y * rowstride + x * nChannels;
      r += pixels[idx];
      g += pixels[idx + 1];
      b += pixels[idx + 2];
      count++;
    }
  }
  if (count === 0) {
    return { r: 40, g: 40, b: 40 };
  }
  return {
    r: Math.floor(r / count),
    g: Math.floor(g / count),
    b: Math.floor(b / count)
  };
}
function getClosestGnomeAccent(r, g, b) {
  const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h *= 60;
  }
  s *= 100;
  const lPct = l * 100;
  if (s < 15 || lPct < 15 || lPct > 90) {
    return "slate";
  }
  const presets = {
    red: 0,
    orange: 30,
    yellow: 50,
    green: 120,
    teal: 170,
    blue: 210,
    purple: 280,
    pink: 330
  };
  let closest = "blue";
  let minDistance = Infinity;
  for (const [name, targetHue] of Object.entries(presets)) {
    const diff = Math.abs(h - targetHue);
    const distance = Math.min(diff, 360 - diff);
    if (distance < minDistance) {
      minDistance = distance;
      closest = name;
    }
  }
  if (Math.abs(h - 360) < minDistance) {
    closest = "red";
  }
  return closest;
}

// src/ui/music-pill/handlers/color-from-art.ts
var ArtColorLoader = class {
  constructor() {
    __publicField(this, "_cancellable", null);
  }
  load(artUrl, cb) {
    if (!artUrl) {
      return;
    }
    if (this._cancellable) {
      this._cancellable.cancel();
    }
    this._cancellable = new Gio5.Cancellable();
    const cancellable = this._cancellable;
    const file = Gio5.File.new_for_uri(artUrl);
    file.load_contents_async(cancellable, (f, res) => {
      try {
        const [ok, bytes] = f.load_contents_finish(res);
        if (!ok) {
          return;
        }
        const stream = Gio5.MemoryInputStream.new_from_bytes(bytes);
        GdkPixbuf.Pixbuf.new_from_stream_async(stream, cancellable, (_source, pixRes) => {
          try {
            const pixbuf = GdkPixbuf.Pixbuf.new_from_stream_finish(pixRes);
            if (!pixbuf) {
              return;
            }
            const color = getAverageColor(pixbuf);
            if (cb.syncAccent && cb.setAccent) {
              try {
                cb.setAccent(getClosestGnomeAccent(color.r, color.g, color.b));
              } catch (err) {
                logDebug(`Native accent sync failed: ${err}`);
              }
            }
            cb.onColor(color);
          } catch (pixErr) {
            const e = pixErr;
            if (!e.matches || !e.matches(Gio5.IOErrorEnum, Gio5.IOErrorEnum.CANCELLED)) {
              logDebug(`Failed to decode art pixbuf: ${e.message}`);
            }
          }
        });
      } catch (err) {
        const e = err;
        if (!e.matches || !e.matches(Gio5.IOErrorEnum, Gio5.IOErrorEnum.CANCELLED)) {
          logDebug(`Failed to load art color: ${e.message}`);
        }
      }
    });
  }
  cancel() {
    if (this._cancellable) {
      this._cancellable.cancel();
      this._cancellable = null;
    }
  }
};

// src/ui/music-pill/handlers/color-transition.ts
import GLib10 from "gi://GLib";
function startColorTransition(state, apply, playing, hasParent) {
  if (state.colorAnimId !== null) {
    GLib10.source_remove(state.colorAnimId);
    state.colorAnimId = null;
  }
  const base = state.targetColor;
  const factor = playing ? 0.6 : 0.4;
  const targetR = Math.floor(base.r * factor);
  const targetG = Math.floor(base.g * factor);
  const targetB = Math.floor(base.b * factor);
  const startR = state.displayedColor.r;
  const startG = state.displayedColor.g;
  const startB = state.displayedColor.b;
  const steps = 60;
  let count = 0;
  state.colorAnimId = GLib10.timeout_add(GLib10.PRIORITY_DEFAULT, 33, () => {
    if (!hasParent()) {
      state.colorAnimId = null;
      return GLib10.SOURCE_REMOVE;
    }
    count++;
    const progress = count / steps;
    const t = progress * progress * (3 - 2 * progress);
    const r = Math.floor(startR + (targetR - startR) * t);
    const g = Math.floor(startG + (targetG - startG) * t);
    const b = Math.floor(startB + (targetB - startB) * t);
    apply(r, g, b);
    if (count >= steps) {
      state.displayedColor = { r: targetR, g: targetG, b: targetB };
      state.colorAnimId = null;
      return GLib10.SOURCE_REMOVE;
    }
    return GLib10.SOURCE_CONTINUE;
  });
}
function setTargetColor(state, color) {
  state.targetColor = {
    r: Math.round(color.r),
    g: Math.round(color.g),
    b: Math.round(color.b)
  };
}

// src/ui/music-pill/index.ts
var _MusicPill = class _MusicPill extends St8.Widget {
  constructor(settings) {
    super({
      style_class: "music-pill-container",
      reactive: true,
      layout_manager: new Clutter9.BinLayout(),
      y_expand: true,
      y_align: Clutter9.ActorAlign.FILL,
      x_align: Clutter9.ActorAlign.CENTER,
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
    __publicField(this, "_tabletControls");
    __publicField(this, "_visualizer");
    __publicField(this, "_visBin");
    __publicField(this, "_currentStatus", "Stopped");
    __publicField(this, "_lastArtUrl", null);
    __publicField(this, "_onAction", null);
    __publicField(this, "_clickTimer", null);
    __publicField(this, "_lastClick", 0);
    __publicField(this, "_isPopupOpen", false);
    __publicField(this, "_colorLoader", new ArtColorLoader());
    __publicField(this, "_currentBgAlpha", 1);
    __publicField(this, "_interfaceSettings", null);
    __publicField(this, "_originalAccent", null);
    __publicField(this, "_lastTitle", "");
    __publicField(this, "_lastArtist", "");
    __publicField(this, "_lastArtUrlSeen");
    __publicField(this, "_lastDisplayStatus", null);
    this._settings = settings;
    this._state = {
      lastScrollTime: 0,
      isActive: false,
      targetWidth: 250,
      paddingX: 14,
      paddingY: 6,
      radius: 28,
      shadowCSS: "box-shadow: none;",
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
    try {
      this._interfaceSettings = new Gio6.Settings({ schema_id: "org.gnome.desktop.interface" });
      this._originalAccent = this._interfaceSettings.get_string("accent-color");
    } catch (e) {
      this._interfaceSettings = null;
    }
    this._body = new St8.BoxLayout({
      style_class: "pill-body",
      x_expand: false,
      y_expand: false,
      y_align: Clutter9.ActorAlign.CENTER
    });
    this._body.set_pivot_point(0.5, 0.5);
    this._artWidget = new CrossfadeArt();
    this._artBin = new St8.Bin({
      child: this._artWidget,
      style: "margin-right: 8px;",
      x_expand: false,
      y_expand: false
    });
    this._tabletControls = new TabletControls();
    this._tabletControls.setActionHandler((action) => this._emit(action === "toggle" ? "play_pause" : action));
    this.textBlock = new TextBlock();
    this._visualizer = new WaveformVisualizer(24, settings, false);
    this._visBin = new St8.Bin({
      child: this._visualizer,
      style: "margin-left: 8px;",
      x_align: Clutter9.ActorAlign.END
    });
    this._body.add_child(this._artBin);
    this._body.insert_child_at_index(this._tabletControls, 1);
    this._body.add_child(this.textBlock);
    this._body.add_child(this._visBin);
    this.add_child(this._body);
    this._updateTransparencyConfig();
    this._applyStyle();
    this.connect("enter-event", () => {
      this.textBlock.titleScroll.setHoverMode(true);
      this.textBlock.artistScroll.setHoverMode(true);
      return Clutter9.EVENT_PROPAGATE;
    });
    this.connect("leave-event", () => {
      this.textBlock.titleScroll.setHoverMode(false);
      this.textBlock.artistScroll.setHoverMode(false);
      return Clutter9.EVENT_PROPAGATE;
    });
    this.connect("button-press-event", () => {
      if (!this._body) return Clutter9.EVENT_STOP;
      this._body.ease({
        scale_x: 0.96,
        scale_y: 0.96,
        duration: 80,
        mode: Clutter9.AnimationMode.EASE_OUT_QUAD
      });
      return Clutter9.EVENT_STOP;
    });
    this.connect("button-release-event", (_a, event) => this._onButton(event));
    this.connect("scroll-event", (_a, event) => this._onScroll(event));
    this.connect("destroy", () => this._cleanup());
  }
  _cleanup() {
    this._colorLoader.cancel();
    if (this._state.colorAnimId !== null) {
      GLib11.source_remove(this._state.colorAnimId);
      this._state.colorAnimId = null;
    }
    if (this._state.hideGraceTimer !== null) {
      GLib11.source_remove(this._state.hideGraceTimer);
      this._state.hideGraceTimer = null;
    }
    if (this._clickTimer !== null) {
      GLib11.source_remove(this._clickTimer);
      this._clickTimer = null;
    }
    if (this._interfaceSettings && this._settings.style.syncAccentColor) {
      try {
        this._interfaceSettings.set_string("accent-color", this._originalAccent || "blue");
      } catch (e) {
      }
    }
  }
  setActionHandler(handler) {
    this._onAction = handler;
  }
  setPopupOpen(isOpen) {
    this._isPopupOpen = isOpen;
    this.updateDimensions();
  }
  get displayedColor() {
    return this._state.displayedColor;
  }
  get lastArtUrl() {
    return this._lastArtUrl;
  }
  get currentBgAlpha() {
    return this._currentBgAlpha;
  }
  _updateTransparencyConfig() {
    const enableTrans = this._settings.style.enableTransparency;
    const strength = this._settings.style.transparencyStrength;
    this._currentBgAlpha = enableTrans ? strength / 100 : 1;
    const targetOpacity = Math.floor(this._currentBgAlpha * 255);
    const setOp = (actor, enabled) => {
      actor.set_opacity(enabled && enableTrans ? targetOpacity : 255);
    };
    setOp(this._artBin, this._settings.style.artTransparency);
    this.textBlock.setTextOpacity(
      this._settings.style.textTransparency && enableTrans ? targetOpacity : 255
    );
    setOp(this._visBin, this._settings.style.visualizerTransparency);
  }
  updateDimensions() {
    updatePillDimensions(
      this._settings,
      this._state,
      {
        pill: this,
        body: this._body,
        artWidget: this._artWidget,
        artBin: this._artBin,
        textBlock: this.textBlock,
        visualizer: this._visualizer,
        visBin: this._visBin,
        tabletControls: this._tabletControls
      },
      this._currentStatus,
      this._isPopupOpen
    );
    this._updateTransparencyConfig();
    this._applyStyle();
  }
  updateDisplay(payload) {
    var _a, _b;
    if (!this.get_parent()) {
      return;
    }
    const title = (_a = payload.title) != null ? _a : "";
    const artist = (_b = payload.artist) != null ? _b : "";
    const artUrl = payload.artUrl;
    const status = payload.status;
    const sameText = title === this._lastTitle && artist === this._lastArtist;
    const sameArt = artUrl === this._lastArtUrlSeen;
    const sameStatus = status === this._lastDisplayStatus;
    const sameBus = payload.busName === this._state.currentBusName;
    if (sameText && sameArt && sameStatus && sameBus && this._state.isActive) {
      this.textBlock.setPlayerPaused(status !== "Playing");
      this._tabletControls.setPlaying(status === "Playing");
      this._visualizer.setPlaying(status === "Playing");
      return;
    }
    const hasContent = !!(payload.title || status === "Playing" || status === "Paused");
    this._currentStatus = status;
    this._state.currentBusName = payload.busName;
    this._lastDisplayStatus = status;
    if (!sameText) {
      if (payload.title) {
        this.textBlock.setTitle(payload.title);
        this._lastTitle = title;
      }
      if (payload.artist !== void 0) {
        this.textBlock.setArtist(payload.artist);
        this._lastArtist = artist;
      }
    }
    if (payload.artUrl !== void 0 && !sameArt) {
      this.setArtUrl(payload.artUrl);
      this._lastArtUrlSeen = artUrl;
    }
    this.textBlock.setPlayerPaused(status !== "Playing");
    this._tabletControls.setPlaying(status === "Playing");
    this._visualizer.setPlaying(status === "Playing");
    if (hasContent) {
      this.showActive();
    } else {
      this.hideInactive();
    }
    if (!sameArt || !sameStatus) {
      this._startColorTransition();
    }
  }
  _applyStyle(r, g, b) {
    var _a;
    if (!this._body) {
      return;
    }
    const color = {
      r: r != null ? r : this._state.displayedColor.r,
      g: g != null ? g : this._state.displayedColor.g,
      b: b != null ? b : this._state.displayedColor.b
    };
    applyPillBodyStyle(
      this._body,
      this._settings,
      this._state,
      color,
      this._currentBgAlpha,
      this._currentStatus === "Playing"
    );
    (_a = this._visualizer) == null ? void 0 : _a.setColor(this._state.displayedColor);
  }
  _startColorTransition() {
    startColorTransition(
      this._state,
      (r, g, b) => this._applyStyle(r, g, b),
      this._currentStatus === "Playing",
      () => !!this.get_parent()
    );
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
      this._artWidget.setArt(url, false);
      if (url !== this._lastArtUrl) {
        this._lastArtUrl = url;
        this._colorLoader.load(url, {
          syncAccent: this._settings.style.syncAccentColor,
          setAccent: (name) => {
            var _a;
            try {
              (_a = this._interfaceSettings) == null ? void 0 : _a.set_string("accent-color", name);
            } catch (e) {
            }
          },
          onColor: (color) => {
            setTargetColor(this._state, color);
            this._visualizer.setColor(color);
            this._startColorTransition();
          }
        });
      }
    } else {
      this._artBin.hide();
      this._lastArtUrl = null;
      this._startColorTransition();
    }
  }
  setStatus(status) {
    this._currentStatus = status;
  }
  setBusName(busName) {
    this._state.currentBusName = busName;
  }
  showActive() {
    if (this._state.hideGraceTimer !== null) {
      GLib11.source_remove(this._state.hideGraceTimer);
      this._state.hideGraceTimer = null;
    }
    const wasInactive = !this._state.isActive || this.opacity === 0 || this.width <= 1;
    this._state.isActive = true;
    this.visible = true;
    this.reactive = true;
    this.set_width(-1);
    if (!wasInactive) {
      this.opacity = 255;
      return;
    }
    this.updateDimensions();
    const finalWidth = this._state.targetWidth > 0 ? this._state.targetWidth : this._body.width || 200;
    const finalHeight = this._settings.pill.dockHeight;
    this._body.set_width(0);
    this._body.set_height(finalHeight);
    this.opacity = 0;
    this.ease({
      opacity: 255,
      duration: 500,
      mode: Clutter9.AnimationMode.EASE_OUT_QUAD
    });
    this._body.ease({
      width: finalWidth,
      height: finalHeight,
      duration: 500,
      mode: Clutter9.AnimationMode.EASE_OUT_QUAD
    });
  }
  hideInactive() {
    if (this._settings.pill.alwaysShow && this._state.currentBusName) {
      this.textBlock.setTitle("Sem m\xEDdia");
      this.textBlock.setArtist("Aguardando reprodu\xE7\xE3o...");
      this.showActive();
      return;
    }
    if (this._state.hideGraceTimer !== null || !this._state.isActive) {
      return;
    }
    this._state.hideGraceTimer = GLib11.timeout_add(GLib11.PRIORITY_DEFAULT, 5e3, () => {
      this._state.hideGraceTimer = null;
      if (!this.get_parent()) {
        return GLib11.SOURCE_REMOVE;
      }
      this._state.isActive = false;
      this.reactive = false;
      this._visualizer.setPlaying(false);
      const targetH = this._body.height;
      this.ease({
        opacity: 0,
        duration: 500,
        mode: Clutter9.AnimationMode.EASE_OUT_QUAD
      });
      this._body.ease({
        width: 0,
        height: targetH,
        duration: 500,
        mode: Clutter9.AnimationMode.EASE_OUT_QUAD,
        onStopped: (finished) => {
          if (!finished) return;
          this.set_width(0);
          this.visible = false;
        }
      });
      return GLib11.SOURCE_REMOVE;
    });
  }
  _emit(action) {
    var _a;
    if (action && action !== "none") {
      (_a = this._onAction) == null ? void 0 : _a.call(this, action);
    }
  }
  _onButton(event) {
    if (this._body) {
      this._body.ease({
        scale_x: 1,
        scale_y: 1,
        duration: 150,
        mode: Clutter9.AnimationMode.EASE_OUT_BACK
      });
    }
    const button = event.get_button();
    if (button === 2) {
      this._emit(this._settings.mouseActions.middleClick);
      return Clutter9.EVENT_STOP;
    }
    if (button === 3) {
      this._emit(this._settings.mouseActions.rightClick);
      return Clutter9.EVENT_STOP;
    }
    if (button !== 1) {
      return Clutter9.EVENT_PROPAGATE;
    }
    const now = Date.now();
    const doubleAction = this._settings.mouseActions.doubleClick;
    const singleAction = this._settings.mouseActions.leftClick;
    if (!doubleAction || doubleAction === "none") {
      this._emit(singleAction);
      return Clutter9.EVENT_STOP;
    }
    if (this._lastClick && now - this._lastClick <= 220) {
      this._lastClick = 0;
      if (this._clickTimer !== null) {
        GLib11.source_remove(this._clickTimer);
        this._clickTimer = null;
      }
      this._emit(doubleAction);
    } else {
      this._lastClick = now;
      if (this._clickTimer !== null) {
        GLib11.source_remove(this._clickTimer);
      }
      this._clickTimer = GLib11.timeout_add(GLib11.PRIORITY_DEFAULT, 220, () => {
        this._clickTimer = null;
        this._lastClick = 0;
        this._emit(singleAction);
        return GLib11.SOURCE_REMOVE;
      });
    }
    return Clutter9.EVENT_STOP;
  }
  _onScroll(event) {
    const dir = event.get_scroll_direction();
    if (dir === Clutter9.ScrollDirection.UP) {
      this._emit("previous");
      return Clutter9.EVENT_STOP;
    }
    if (dir === Clutter9.ScrollDirection.DOWN) {
      this._emit("next");
      return Clutter9.EVENT_STOP;
    }
    return Clutter9.EVENT_PROPAGATE;
  }
};
GObject11.registerClass(_MusicPill);
var MusicPill = _MusicPill;

// src/ui/music-pill/positioning/inject.ts
import GLib12 from "gi://GLib";

// src/ui/music-pill/positioning/container-resolver.ts
import * as Main2 from "resource:///org/gnome/shell/ui/main.js";
function resolveTargetContainer(targetContainer) {
  var _a;
  const panel2 = Main2.panel;
  const statusArea = panel2.statusArea;
  if (targetContainer === 0) {
    const dtd = (_a = statusArea["dash-to-dock"]) != null ? _a : statusArea["ubuntu-dock"];
    const dashBox = dtd == null ? void 0 : dtd._box;
    return dashBox != null ? dashBox : Main2.overview.dash._box;
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
  const panel2 = Main2.panel;
  const statusArea = panel2.statusArea;
  const dtd = (_a = statusArea["dash-to-dock"]) != null ? _a : statusArea["ubuntu-dock"];
  if (dtd && dtd._box === container) {
    return true;
  }
  return Main2.overview.dash._box === container;
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
      GLib12.source_remove(injectTimeout);
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
      (_a = container.connectObject) == null ? void 0 : _a.call(container, "child-added", (_c, actor) => {
        if (actor !== pill && !isMovingItem) {
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
      GLib12.source_remove(injectTimeout);
    }
    injectTimeout = GLib12.timeout_add(GLib12.PRIORITY_DEFAULT, 100, () => {
      inject();
      injectTimeout = null;
      return GLib12.SOURCE_REMOVE;
    });
  }
  function destroy() {
    if (injectTimeout !== null) {
      GLib12.source_remove(injectTimeout);
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
import GObject16 from "gi://GObject";
import GLib14 from "gi://GLib";
import St13 from "gi://St";
import Clutter14 from "gi://Clutter";
import * as Main4 from "resource:///org/gnome/shell/ui/main.js";

// src/utils/dash-to-dock.ts
import * as Main3 from "resource:///org/gnome/shell/ui/main.js";
var disableRequests = 0;
var dockManager = null;
var importPromise = null;
function initDTDModule() {
  let ext = Main3.extensionManager.lookup("dash-to-dock@micxgx.gmail.com");
  if (!ext || ext.state !== 1) {
    ext = Main3.extensionManager.lookup("ubuntu-dock@ubuntu.com");
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
import GObject12 from "gi://GObject";
import St9 from "gi://St";
import Clutter10 from "gi://Clutter";
var _TrackInfoBlock = class _TrackInfoBlock extends St9.BoxLayout {
  constructor() {
    super({
      vertical: true,
      x_expand: true,
      y_align: Clutter10.ActorAlign.CENTER,
      style: "spacing: 4px;"
    });
    __publicField(this, "_title");
    __publicField(this, "_artist");
    __publicField(this, "_lastTitle", "");
    __publicField(this, "_lastArtist", "");
    this._title = new ScrollLabel("music-label-title");
    this._artist = new ScrollLabel("music-label-artist");
    this.add_child(this._title);
    this.add_child(this._artist);
  }
  setTitle(text) {
    const t = text || "";
    this._title.setText(t, t !== this._lastTitle, 0);
    this._lastTitle = t;
  }
  setArtist(text) {
    const t = text || "";
    this._artist.setText(t, t !== this._lastArtist);
    this._lastArtist = t;
  }
  setPaused(paused) {
    this._title.setPlayerPaused(paused);
    this._artist.setPlayerPaused(paused);
  }
};
GObject12.registerClass(_TrackInfoBlock);
var TrackInfoBlock = _TrackInfoBlock;

// src/ui/expanded-player/components/progress-bar.ts
import GObject13 from "gi://GObject";
import St10 from "gi://St";
import Clutter11 from "gi://Clutter";

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
var _ProgressBar = class _ProgressBar extends St10.BoxLayout {
  constructor() {
    super({
      style_class: "progress-container",
      vertical: false,
      y_align: Clutter11.ActorAlign.CENTER,
      x_expand: true
    });
    __publicField(this, "_current");
    __publicField(this, "_total");
    __publicField(this, "_fill");
    __publicField(this, "_track");
    __publicField(this, "_onSeek", null);
    __publicField(this, "_forceHours", false);
    __publicField(this, "_lastCurrentText", "");
    __publicField(this, "_lastTotalText", "");
    __publicField(this, "_lastFillW", -1);
    this._current = new St10.Label({
      style_class: "progress-time",
      text: "0:00",
      y_align: Clutter11.ActorAlign.CENTER,
      x_align: Clutter11.ActorAlign.START,
      style: "text-align: left; margin-right: 0px;"
    });
    this._total = new St10.Label({
      style_class: "progress-time",
      text: "0:00",
      y_align: Clutter11.ActorAlign.CENTER,
      x_align: Clutter11.ActorAlign.END,
      style: "text-align: right;"
    });
    this._track = new St10.Widget({
      style_class: "progress-slider-bg",
      x_expand: true,
      reactive: true,
      y_align: Clutter11.ActorAlign.CENTER,
      style: "margin: 0; padding: 0;"
    });
    this._fill = new St10.Widget({ style_class: "progress-slider-fill" });
    this._fill.set_position(0, 0);
    this._track.add_child(this._fill);
    this._track.connect("button-release-event", (_a, event) => {
      if (!this._onSeek || event.get_button() === 8) {
        return Clutter11.EVENT_PROPAGATE;
      }
      this._handleSeek(event);
      return Clutter11.EVENT_STOP;
    });
    this._track.connect("touch-event", (_a, event) => {
      if (event.type() === Clutter11.EventType.TOUCH_END && this._onSeek) {
        this._handleSeek(event);
        return Clutter11.EVENT_STOP;
      }
      return Clutter11.EVENT_PROPAGATE;
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
  /** Immediate UI after seek (optimistic), matching legacy _handleSeek. */
  applySeekPreview(positionUs, lengthUs) {
    const useHours = lengthUs >= 36e8 && this._forceHours;
    this._setCurrentText(formatTime(positionUs, useHours));
    this._setTotalText(formatTime(lengthUs, useHours));
    const totalW = Math.round(this._track.get_width());
    if (totalW > 0 && lengthUs > 0) {
      const percent = Math.min(1, Math.max(0, positionUs / lengthUs));
      this._setFillWidth(Math.max(6, Math.min(totalW, Math.round(totalW * percent))));
    }
  }
  update(positionUs, lengthUs, stale = false) {
    if (lengthUs <= 0) {
      return;
    }
    const useHours = lengthUs >= 36e8 && this._forceHours;
    const currentText = stale ? "--:--" : formatTime(positionUs, useHours);
    const totalText = stale ? "--:--" : formatTime(lengthUs, useHours);
    this._setCurrentText(currentText);
    this._setTotalText(totalText);
    if (stale) {
      return;
    }
    const percent = Math.min(1, Math.max(0, positionUs / lengthUs));
    const totalW = Math.round(this._track.get_width());
    if (totalW > 0) {
      const targetWidth = Math.max(6, Math.min(totalW, Math.round(totalW * percent)));
      this._setFillWidth(targetWidth);
    }
  }
  _setCurrentText(text) {
    if (this._lastCurrentText === text) {
      return;
    }
    this._lastCurrentText = text;
    this._current.text = text;
    this._current.set_width(-1);
    const [, natW] = this._current.get_preferred_width(-1);
    this._current.set_width(Math.ceil(natW) + 2);
  }
  _setTotalText(text) {
    if (this._lastTotalText === text) {
      return;
    }
    this._lastTotalText = text;
    this._total.text = text;
    this._total.set_width(-1);
    const [, natW] = this._total.get_preferred_width(-1);
    this._total.set_width(Math.ceil(natW) + 2);
  }
  _setFillWidth(w) {
    if (Math.abs(this._lastFillW - w) < 1) {
      return;
    }
    this._lastFillW = w;
    this._fill.width = w;
  }
  _handleSeek(event) {
    if (!this._onSeek) {
      return;
    }
    const [x] = event.get_coords();
    const [ok, relX] = this._track.transform_stage_point(x, 0);
    if (!ok) {
      return;
    }
    const width = this._track.get_width();
    if (width <= 0) {
      return;
    }
    const ratio = Math.min(1, Math.max(0, relX / width));
    this._onSeek(ratio);
  }
};
GObject13.registerClass(_ProgressBar);
var ProgressBar = _ProgressBar;

// src/ui/expanded-player/components/transport-controls.ts
import GObject14 from "gi://GObject";
import St11 from "gi://St";
import Clutter12 from "gi://Clutter";
var _TransportControls = class _TransportControls extends St11.BoxLayout {
  constructor(callbacks) {
    super({
      style_class: "controls-row",
      vertical: false,
      x_align: Clutter12.ActorAlign.CENTER,
      reactive: true
    });
    __publicField(this, "_prev");
    __publicField(this, "_play");
    __publicField(this, "_next");
    __publicField(this, "_playIcon");
    __publicField(this, "_lastStatus", null);
    this._prev = this._iconButton("media-skip-backward-symbolic", 24, () => callbacks.onPrevious());
    this._playIcon = new St11.Icon({ icon_name: "media-playback-start-symbolic", icon_size: 24 });
    this._play = new St11.Button({
      style_class: "control-btn",
      child: this._playIcon,
      reactive: true,
      can_focus: true
    });
    this._play.connect("button-press-event", () => Clutter12.EVENT_STOP);
    this._play.connect("clicked", () => {
      callbacks.onPlayPause();
    });
    this._play.connect("touch-event", (_a, event) => {
      if (event.type() === Clutter12.EventType.TOUCH_END) {
        callbacks.onPlayPause();
        return Clutter12.EVENT_STOP;
      }
      if (event.type() === Clutter12.EventType.TOUCH_BEGIN) {
        return Clutter12.EVENT_STOP;
      }
      return Clutter12.EVENT_PROPAGATE;
    });
    this._next = this._iconButton("media-skip-forward-symbolic", 24, () => callbacks.onNext());
    this.add_child(this._prev);
    this.add_child(this._play);
    this.add_child(this._next);
  }
  setStatus(status) {
    if (this._lastStatus === status) {
      return;
    }
    this._lastStatus = status;
    this._playIcon.icon_name = status === "Playing" ? "media-playback-pause-symbolic" : "media-playback-start-symbolic";
  }
  setCapabilities(canPrev, _canPlay, canNext) {
    this._prev.opacity = canPrev ? 255 : 80;
    this._next.opacity = canNext ? 255 : 80;
    this._prev.reactive = canPrev;
    this._next.reactive = canNext;
    this._play.reactive = true;
    this._play.opacity = 255;
  }
  _iconButton(iconName, size, onClick) {
    const btn = new St11.Button({
      style_class: "control-btn",
      child: new St11.Icon({ icon_name: iconName, icon_size: size }),
      reactive: true,
      can_focus: true
    });
    btn.connect("button-press-event", () => Clutter12.EVENT_STOP);
    btn.connect("clicked", () => onClick());
    btn.connect("touch-event", (_a, event) => {
      if (event.type() === Clutter12.EventType.TOUCH_END) {
        onClick();
        return Clutter12.EVENT_STOP;
      }
      if (event.type() === Clutter12.EventType.TOUCH_BEGIN) {
        return Clutter12.EVENT_STOP;
      }
      return Clutter12.EVENT_PROPAGATE;
    });
    return btn;
  }
};
GObject14.registerClass(_TransportControls);
var TransportControls = _TransportControls;

// src/ui/expanded-player/components/vinyl-art.ts
import GObject15 from "gi://GObject";
import GLib13 from "gi://GLib";
import St12 from "gi://St";
import Clutter13 from "gi://Clutter";
var _VinylArt = class _VinylArt extends St12.Bin {
  constructor() {
    super({
      width: 96,
      height: 96,
      x_align: Clutter13.ActorAlign.CENTER,
      y_align: Clutter13.ActorAlign.CENTER,
      style_class: "vinyl-container"
    });
    __publicField(this, "_art");
    __publicField(this, "_url", null);
    __publicField(this, "_spinning", false);
    __publicField(this, "_square", false);
    __publicField(this, "_speed", 10);
    __publicField(this, "_idleId", null);
    this._art = new St12.Widget({
      width: 96,
      height: 96,
      style_class: "vinyl-container",
      style: "border-radius: 48px; background-size: cover; background-color: rgba(40,40,40,0.8);"
    });
    this.set_child(this._art);
    this._art.set_pivot_point(0.5, 0.5);
  }
  setSquare(square) {
    this._square = square;
    this._refreshStyle();
    if (square && this._spinning) {
      this.setSpinning(false);
    }
  }
  setSpeed(speed) {
    this._speed = Math.max(1, speed || 10);
  }
  setArt(url) {
    this._url = url;
    this._refreshStyle();
  }
  setSpinning(spinning) {
    if (spinning && this._square) {
      spinning = false;
    }
    if (this._spinning === spinning) {
      return;
    }
    if (spinning) {
      this._spinning = true;
      this._startSpin();
    } else {
      this._stopSpin();
    }
  }
  destroy() {
    this._clearIdle();
    this._spinning = false;
    this._art.remove_all_transitions();
    super.destroy();
  }
  _startSpin() {
    this._clearIdle();
    this._art.remove_all_transitions();
    this._art.set_pivot_point(0.5, 0.5);
    const factor = 10 / this._speed;
    const initialDuration = Math.round(800 * factor);
    const loopDuration = Math.round(35e4 * factor);
    const currentAngle = this._art.rotation_angle_z || 0;
    this._art.ease({
      rotation_angle_z: currentAngle + 90,
      duration: initialDuration,
      mode: Clutter13.AnimationMode.EASE_IN_QUAD,
      onStopped: (finished) => {
        if (!finished || !this._spinning) {
          return;
        }
        this._idleId = GLib13.idle_add(GLib13.PRIORITY_DEFAULT_IDLE, () => {
          this._idleId = null;
          if (!this._spinning) {
            return GLib13.SOURCE_REMOVE;
          }
          const next = this._art.rotation_angle_z || 0;
          this._art.ease({
            rotation_angle_z: next + 36e3,
            duration: loopDuration,
            mode: Clutter13.AnimationMode.LINEAR
          });
          return GLib13.SOURCE_REMOVE;
        });
      }
    });
  }
  _stopSpin() {
    this._spinning = false;
    this._clearIdle();
    const factor = 10 / this._speed;
    const stopDuration = Math.round(800 * factor);
    const currentAngle = this._art.rotation_angle_z || 0;
    this._art.remove_all_transitions();
    this._art.ease({
      rotation_angle_z: currentAngle + 90,
      duration: stopDuration,
      mode: Clutter13.AnimationMode.EASE_OUT_QUAD,
      onStopped: (finished) => {
        if (finished) {
          this._art.rotation_angle_z = (this._art.rotation_angle_z || 0) % 360;
        }
      }
    });
  }
  _clearIdle() {
    if (this._idleId !== null) {
      GLib13.source_remove(this._idleId);
      this._idleId = null;
    }
  }
  _refreshStyle() {
    const radius = this._square ? 12 : 48;
    const klass = this._square ? "vinyl-container-square" : "vinyl-container";
    this._art.set_style_class_name(klass);
    const bg = this._url ? `background-image: url("${this._url}");` : "background-color: rgba(40,40,40,0.8);";
    this._art.set_style(`border-radius: ${radius}px; background-size: cover; ${bg}`);
  }
};
GObject15.registerClass(_VinylArt);
var VinylArt = _VinylArt;

// src/ui/expanded-player/index.ts
var _ExpandedPlayer = class _ExpandedPlayer extends St13.Widget {
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
    __publicField(this, "_seekLockTime", 0);
    __publicField(this, "_lastPositionSync", 0);
    __publicField(this, "_lastTickPosition");
    __publicField(this, "_lastTickTime");
    __publicField(this, "_lastCapsKey", "");
    __publicField(this, "_lastContentKey", "");
    this._host = host;
    this._bgBtn = new St13.Button({
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
    this.box.layout_manager.orientation = Clutter14.Orientation.VERTICAL;
    this.add_child(this.box);
    this._vinyl = new VinylArt();
    this._vinyl.setSquare(host.settings.popup.squareVinyl);
    this._vinyl.setSpeed(host.settings.popup.vinylSpeed);
    this._info = new TrackInfoBlock();
    this._visualizer = new WaveformVisualizer(80, host.settings, true);
    this._visualizer.setMode(host.settings.style.visualizerAnimation);
    const top = new St13.BoxLayout({
      style_class: "expanded-top-row",
      vertical: false,
      x_expand: true,
      y_align: Clutter14.ActorAlign.CENTER
    });
    top.add_child(this._vinyl);
    const mid = new St13.BoxLayout({ vertical: true, x_expand: true, style: "spacing: 8px;" });
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
      if (event.get_key_symbol() === Clutter14.KEY_Escape) {
        this.hidePopup();
        return Clutter14.EVENT_STOP;
      }
      return Clutter14.EVENT_PROPAGATE;
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
    const key = `${title != null ? title : ""}|${artist != null ? artist : ""}|${artUrl != null ? artUrl : ""}|${status}`;
    if (key === this._lastContentKey) {
      this._transport.setStatus(status);
      this._visualizer.setPlaying(status === "Playing" && this._host.settings.popup.showVisualizer);
      this._vinyl.setSpinning(
        status === "Playing" && this._host.settings.popup.showVinyl && this._host.settings.popup.vinylRotate
      );
      return;
    }
    this._lastContentKey = key;
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
      mode: Clutter14.AnimationMode.EASE_OUT_QUAD
    });
    global.stage.set_key_focus(this);
  }
  hidePopup() {
    this._stopTimer();
    restoreDashToDockAutohide();
    this.ease({
      opacity: 0,
      duration: 150,
      mode: Clutter14.AnimationMode.EASE_OUT_QUAD,
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
    const monitor = (_a = Main4.layoutManager.findMonitorForActor(this)) != null ? _a : Main4.layoutManager.primaryMonitor;
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
    const targetPos = Math.floor(length * ratio);
    this._seekLockTime = Date.now();
    this._player.markPosition(targetPos);
    this._progress.applySeekPreview(targetPos, length);
    this._host.seekTo(this._player, targetPos);
  }
  _startTimer() {
    var _a;
    this._stopTimer();
    this._lastTickPosition = void 0;
    this._lastTickTime = void 0;
    this._lastPositionSync = 0;
    (_a = this._player) == null ? void 0 : _a.syncPosition();
    this._timer = GLib14.timeout_add(GLib14.PRIORITY_DEFAULT, 100, () => {
      this._tick();
      return GLib14.SOURCE_CONTINUE;
    });
    this._tick();
  }
  _stopTimer() {
    if (this._timer !== null) {
      GLib14.source_remove(this._timer);
      this._timer = null;
    }
  }
  _tick() {
    var _a;
    if (!this._player || !this.get_parent()) {
      return;
    }
    const length = ((_a = this._player.getTrackInfo()) == null ? void 0 : _a.length) || 0;
    if (length <= 0) {
      return;
    }
    const now = Date.now();
    if (now - this._seekLockTime < 2e3) {
      return;
    }
    const info = this._player.getPlayerInfo();
    const playing = info.playbackStatus === "Playing";
    if (playing && (!this._lastPositionSync || now - this._lastPositionSync > 5e3)) {
      this._lastPositionSync = now;
      this._player.syncPosition();
    }
    const cachedPos = this._player.getCachedPosition();
    const lastUpdate = this._player.getLastPositionTime() || now;
    let isStale = false;
    if (playing) {
      if (cachedPos === (this._lastTickPosition || 0) && now - lastUpdate > 6e3 && this._lastTickTime && now - this._lastTickTime > 6e3) {
        isStale = true;
      }
      if (cachedPos !== (this._lastTickPosition || 0)) {
        this._lastTickTime = now;
      }
      this._lastTickPosition = cachedPos;
    }
    let currentPos = cachedPos;
    if (playing && !isStale) {
      currentPos += (now - lastUpdate) * 1e3;
    }
    if (currentPos > length) {
      currentPos = length;
    }
    this._progress.update(currentPos, length, isStale && playing);
    this._transport.setStatus(info.playbackStatus);
    const capsKey = `${info.canGoPrevious}|${info.canPlay || info.canPause}|${info.canGoNext}`;
    if (capsKey !== this._lastCapsKey) {
      this._lastCapsKey = capsKey;
      this._transport.setCapabilities(
        info.canGoPrevious,
        info.canPlay || info.canPause,
        info.canGoNext
      );
    }
  }
  _cleanup() {
    this._stopTimer();
    restoreDashToDockAutohide();
    this._player = null;
  }
};
GObject16.registerClass(_ExpandedPlayer);
var ExpandedPlayer = _ExpandedPlayer;

// src/ui/player-selector/index.ts
import GObject17 from "gi://GObject";
import St14 from "gi://St";
import Clutter15 from "gi://Clutter";
import * as Main5 from "resource:///org/gnome/shell/ui/main.js";
import { gettext as _2 } from "resource:///org/gnome/shell/extensions/extension.js";

// src/utils/player-icon.ts
import Gio7 from "gi://Gio";
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
    const icon = Gio7.ThemedIcon.new(name);
    if (icon) {
      return icon;
    }
  }
  return Gio7.ThemedIcon.new("audio-x-generic");
}

// src/ui/player-selector/index.ts
var _PlayerSelectorMenu = class _PlayerSelectorMenu extends St14.Widget {
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
    this._bg = new St14.Button({
      style: "background-color: transparent;",
      reactive: true,
      x_expand: true,
      y_expand: true,
      width: bgW,
      height: bgH
    });
    this._bg.connect("clicked", () => this.hideMenu());
    this.add_child(this._bg);
    this._box = new St14.BoxLayout({
      vertical: true,
      reactive: true,
      style: "padding: 12px; border-radius: 12px; background-color: rgba(30,30,30,0.95); spacing: 6px;"
    });
    this.add_child(this._box);
    this.connect("key-press-event", (_a, event) => {
      if (event.get_key_symbol() === Clutter15.KEY_Escape) {
        this.hideMenu();
        return Clutter15.EVENT_STOP;
      }
      return Clutter15.EVENT_PROPAGATE;
    });
  }
  populate() {
    this._box.destroy_all_children();
    const title = new St14.Label({
      text: _2("Select Media Player"),
      style: "font-weight: bold; margin-bottom: 8px;",
      x_align: Clutter15.ActorAlign.CENTER
    });
    this._box.add_child(title);
    const current = this._host.settings.popup.selectedPlayerBus;
    if (!this._host.settings.popup.autoHidePlayer) {
      this._box.add_child(this._row(
        _2("Auto (Smart Selection)"),
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
    const monitor = Main5.layoutManager.primaryMonitor;
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
      mode: Clutter15.AnimationMode.EASE_OUT_QUAD
    });
    global.stage.set_key_focus(this);
  }
  hideMenu() {
    this.ease({
      opacity: 0,
      duration: 120,
      mode: Clutter15.AnimationMode.EASE_OUT_QUAD,
      onStopped: () => {
        this.visible = false;
        this._host.closePlayerMenu();
      }
    });
  }
  _row(label, iconName, selected, onClick, player, busName) {
    const content = new St14.BoxLayout({ vertical: false, style: "spacing: 10px;" });
    const iconProps = { icon_size: 22 };
    if (iconName) {
      iconProps.icon_name = iconName;
    } else {
      iconProps.gicon = getPlayerIcon(player != null ? player : null, busName != null ? busName : "");
    }
    const icon = new St14.Icon(iconProps);
    content.add_child(icon);
    content.add_child(new St14.Label({ text: label || "", y_align: Clutter15.ActorAlign.CENTER }));
    const btn = new St14.Button({
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
GObject17.registerClass(_PlayerSelectorMenu);
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
    if (Main6.layoutManager._startingUp) {
      const startupId = Main6.layoutManager.connect("startup-complete", () => {
        Main6.layoutManager.disconnect(startupId);
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
    Main6.layoutManager.addChrome(this._expanded);
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
    Main6.layoutManager.addChrome(this._playerMenu);
    const [px, py] = this._pill.get_transformed_position();
    const [pw, ph] = this._pill.get_transformed_size();
    this._playerMenu.showMenu(px, py, pw, ph);
  }
  closePlayerMenu() {
    if (!this._playerMenu) {
      return;
    }
    Main6.layoutManager.removeChrome(this._playerMenu);
    this._playerMenu.destroy();
    this._playerMenu = null;
  }
  triggerUpdate() {
    if (this._updateTimeoutId !== null) {
      return;
    }
    const delay = this._context.settings.system.compatibilityDelay ? 800 : 150;
    this._updateTimeoutId = GLib15.timeout_add(GLib15.PRIORITY_DEFAULT, delay, () => {
      this._updateTimeoutId = null;
      this._updateUI();
      return GLib15.SOURCE_REMOVE;
    });
  }
  _doEnable() {
    var _a;
    this._context.mpris.start(this._context.settings.system);
    (_a = this._injector) == null ? void 0 : _a.inject();
    this._watchdogId = GLib15.timeout_add_seconds(GLib15.PRIORITY_DEFAULT, 5, () => {
      var _a2, _b;
      if (this._isShuttingDown) {
        return GLib15.SOURCE_REMOVE;
      }
      if (!((_a2 = this._pill) == null ? void 0 : _a2.get_parent())) {
        (_b = this._injector) == null ? void 0 : _b.queueInject();
      }
      return GLib15.SOURCE_CONTINUE;
    });
    this._overviewDragBegin = Main6.overview.connect("item-drag-begin", () => {
    });
    this._overviewDragEnd = Main6.overview.connect("item-drag-end", () => {
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
      // Position-only updates no longer emit this (see MediaPlayer._applyState)
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
      GLib15.source_remove(this._updateTimeoutId);
      this._updateTimeoutId = null;
    }
    if (this._watchdogId !== null) {
      GLib15.source_remove(this._watchdogId);
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
      Main6.overview.disconnect(this._overviewDragBegin);
      this._overviewDragBegin = 0;
    }
    if (this._overviewDragEnd) {
      Main6.overview.disconnect(this._overviewDragEnd);
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
