import { Extension } from "@girs/gnome-shell/src/extensions/extension"
import { logDebug, logInfo, logWarning, logError } from "./utils/log";
import { isDevelopment } from "./utils/development";
import { IMPrisProvider } from "./interfaces/impris-provider";
import { createMockMPRISProvider } from "./providers/mock";
import { createMPRISProvider } from "./providers/mpris-provider";

let instance: DynamicMusicPillExtension | null = null;

export function getInstance(): DynamicMusicPillExtension | null {
    if (instance === null) {
        throw new Error("getInstance called before instance was created");
    }
    return instance;
}

export default class DynamicMusicPillExtension {
    extension: Extension;
    provider: IMPrisProvider;

    constructor(extension: Extension) {
        this.extension = extension;
        instance = this;

        this.provider = createMPRISProvider();
        this.provider.addCallback("first", (track) => {
            logInfo(`Chegou aqui ${JSON.stringify(track)}`);
        })
    }

    enable() {
        logInfo("Extension enabled.");
        logInfo(isDevelopment() ? "Is Dev" : "Is Not Dev");
        
        this.provider.start();
    }

    disable() {
        this.provider.stop();
        
        logWarning("Extension disabled.");
    }
}