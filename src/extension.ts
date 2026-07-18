import { MetadataJson } from "node_modules/@girs/gnome-shell/dist/types/extension-metadata";
import { logDebug, logInfo, logWarning, logError } from "./utils/log";
import { isDevelopment } from "./utils/development";
import { IMPrisProvider } from "./interfaces/impris-provider";
import { Extension } from "@girs/gnome-shell/extensions/extension"
import Gio from "@girs/gio-2.0"
import { AppContext } from "./types/app-context";
import { createSettingsProvider, SettingsProvider } from "./providers/settings-provider";
import { loadEnv } from "./utils/env";
import { MPRISProvider } from "./providers/mpris-provider";
import { MediaPlayer } from "./providers/mpris-provider/media-player";
import { PlaybackStatus } from "./types/player-types";

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
    mpris: MPRISProvider;
    
    /**
     * Settings provider for extension configuration
     */
    settings: SettingsProvider;

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
        this.mpris = new MPRISProvider();

        //this.provider = createMPRISProvider(this.dbusProvider);
        /*this.provider.addCallback("first", (track) => {
            logInfo(`Chegou aqui ${JSON.stringify(track)}`);
        })*/

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
        //this.provider.start();
    }

    /**
     * Disables the extension
     * Stops the MPRIS provider and logs a warning
     */
    disable() {
        //this.provider.stop();
        this.mpris.stop();
        
        logWarning("Extension disabled.");
    }

    private _playerAdded(provider: MPRISProvider, name: string, player: MediaPlayer) {
        logInfo(`Player added: ${name} ${player.getOwner()}`);
    }

    private _playerRemoved(provider: MPRISProvider, name: string) {
        logInfo(`Player removed: ${name}`);
    }

    private _playerStateChanged(provider: MPRISProvider, name: string, player: MediaPlayer) {
        logInfo(`Player state changed: ${name} ${JSON.stringify(player.getPlayerInfo() || {})}`);
    }

    private _playerTrackChanged(provider: MPRISProvider, name: string, player: MediaPlayer) {
        logInfo(`Player track changed: ${name} ${JSON.stringify(player.getTrackInfo() || {})}`);
    }
    
    private _playerPlaybackStatusChanged(provider: MPRISProvider, name: string, status: PlaybackStatus) {
        logInfo(`Player playback status changed: ${name} ${status}`);
    }
}
