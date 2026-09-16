import { MetadataJson } from "node_modules/@girs/gnome-shell/dist/types/extension-metadata";
import { logInfo, logWarning } from "./utils/log";
import { isDevelopment } from "./utils/development";
import { Extension } from "@girs/gnome-shell/extensions/extension";
import { AppContext } from "./types/app-context";
import { createSettingsProvider, SettingsProvider } from "./providers/settings-provider";
import { loadEnv } from "./utils/env";
import { MPRISProvider } from "./providers/mpris-provider";
import { MusicController } from "./controllers/music-controller";

let instance: DynamicMusicPillExtension | null = null;

export function getAppContext(): AppContext {
    if (instance === null) {
        throw new Error("getAppContext called before instance was created!");
    }
    return instance.context;
}

export default class DynamicMusicPillExtension extends Extension {
    context: AppContext;
    mpris: MPRISProvider;
    settings: SettingsProvider;
    controller: MusicController;

    constructor(metadata: MetadataJson) {
        super(metadata);
        instance = this;

        loadEnv();
        this.initTranslations("dynamic-music-pill");

        this.settings = createSettingsProvider(this.getSettings());
        this.mpris = new MPRISProvider();

        this.context = {
            extension: this,
            settings: this.settings,
            mpris: this.mpris,
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
}
