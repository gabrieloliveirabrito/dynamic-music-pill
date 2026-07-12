import { MetadataJson } from "node_modules/@girs/gnome-shell/dist/types/extension-metadata";
import { logDebug, logInfo, logWarning, logError } from "./utils/log";
import { isDevelopment } from "./utils/development";
import { IMPrisProvider } from "./interfaces/impris-provider";
import { Extension } from "@girs/gnome-shell/extensions/extension"
import Gio from "@girs/gio-2.0"
//import { createMPRISProvider } from "./providers/mpris-provider";
import { createMockMPRISProvider } from "./providers/mock";
import { AppContext } from "./types/app-context";
import { createSettingsProvider, SettingsProvider } from "./providers/settings-provider";
import { loadEnv } from "./utils/env";
import { DBusProvider } from "./providers/dbus-provider";

/**
 * Global variable to store the extension instance
 */
let instance: DynamicMusicPillExtension | null = null;

/**
 * Get the application context
 * @returns The application context
 * @throws Error if called before instance was created
 */
export function getAppContext() : AppContext {
    if (instance === null) {
        throw new Error("getAppContext called before instance was created!");
    }

    return instance.context;
}

/**
 * Main extension class for Dynamic Music Pill
 * This class manages the extension lifecycle and provides access to core components
 */
export default class DynamicMusicPillExtension extends Extension {
    /**
     * Application context containing references to key components
     */
    context: AppContext;
    
    /**
     * MPRIS provider for music control
     */
    //provider: IMPrisProvider;
    
    /**
     * Settings provider for extension configuration
     */
    settings: SettingsProvider;

    dbusProvider: DBusProvider;

    /**
     * Creates a new instance of the DynamicMusicPillExtension
     * @param metadata Extension metadata
     */
    constructor(metadata: MetadataJson) {
        super(metadata)
        instance = this;

        loadEnv();

        this.initTranslations("dynamic-music-pill");

        this.settings = createSettingsProvider(this.getSettings());
        this.dbusProvider = new DBusProvider();

        //this.provider = createMPRISProvider(this.dbusProvider);
        /*this.provider.addCallback("first", (track) => {
            logInfo(`Chegou aqui ${JSON.stringify(track)}`);
        })*/

        this.context = {
            extension: this,
            settings: this.settings,
            //mpris: this.provider
        };
    }

    /**
     * Enables the extension
     * Starts the MPRIS provider and logs information
     */
    enable() {
        logInfo("Extension enabled.");
        logInfo(isDevelopment() ? "Is Dev" : "Is Not Dev");
        
        this.dbusProvider.start();
        //this.provider.start();
    }

    /**
     * Disables the extension
     * Stops the MPRIS provider and logs a warning
     */
    disable() {
        //this.provider.stop();
        this.dbusProvider.stop();
        
        logWarning("Extension disabled.");
    }
}
