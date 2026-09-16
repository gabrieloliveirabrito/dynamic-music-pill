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
    set(_, prop, value) {
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
    this._playerPropertiesTimer = GLib4.timeout_add(GLib4.PRIORITY_DEFAULT, 1e3, this._playerTimerCallback.bind(this));
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
      GLib4.source_remove(this._playerPropertiesTimer);
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
    return GLib4.SOURCE_CONTINUE;
  }
};
GObject.registerClass(_MediaPlayer);
var MediaPlayer = _MediaPlayer;

// src/providers/mpris-provider/index.ts
var flags = Gio4.DBusConnectionFlags.AUTHENTICATION_CLIENT | Gio4.DBusConnectionFlags.MESSAGE_BUS_CONNECTION;
var _MPRISProvider = class _MPRISProvider extends GObject2.Object {
  constructor() {
    super();
    __publicField(this, "_address", getDBusSessionAddress());
    __publicField(this, "_connection", null);
    __publicField(this, "_nameOwnerChangedSignal", null);
    __publicField(this, "_players", /* @__PURE__ */ new Map());
  }
  start() {
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
      new GLib5.Variant("(s)", [name]),
      null,
      Gio4.DBusCallFlags.NONE,
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
      Gio4.DBusCallFlags.NONE,
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
    __publicField(this, "mpris");
    /**
     * Settings provider for extension configuration
     */
    __publicField(this, "settings");
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
    this.mpris.connect("player-added", this._playerAdded.bind(this));
    this.mpris.connect("player-removed", this._playerRemoved.bind(this));
    this.mpris.connect("player-state-changed", this._playerStateChanged.bind(this));
    this.mpris.connect("player-track-changed", this._playerTrackChanged.bind(this));
    this.mpris.connect("player-status-changed", this._playerPlaybackStatusChanged.bind(this));
  }
  /**
   * Enables the extension
   * Starts the MPRIS provider and logs information
   */
  enable() {
    logInfo("Extension enabled.");
    logInfo(isDevelopment() ? "Is Dev" : "Is Not Dev");
    this.mpris.start();
  }
  /**
   * Disables the extension
   * Stops the MPRIS provider and logs a warning
   */
  disable() {
    this.mpris.stop();
    logWarning("Extension disabled.");
  }
  _playerAdded(provider, name, player) {
    logInfo(`Player added: ${name} ${player.getOwner()}`);
  }
  _playerRemoved(provider, name) {
    logInfo(`Player removed: ${name}`);
  }
  _playerStateChanged(provider, name, player) {
    logInfo(`Player state changed: ${name} ${JSON.stringify(player.getPlayerInfo() || {})}`);
  }
  _playerTrackChanged(provider, name, player) {
    logInfo(`Player track changed: ${name} ${JSON.stringify(player.getTrackInfo() || {})}`);
  }
  _playerPlaybackStatusChanged(provider, name, status) {
    logInfo(`Player playback status changed: ${name} ${status}`);
  }
};
export {
  DynamicMusicPillExtension as default,
  getAppContext
};
//# sourceMappingURL=extension.js.map
