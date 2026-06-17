import { Extension } from "@girs/gnome-shell/extensions/extension"
import { logDebug, logInfo, logWarning, logError } from "./utils/log";

let instance : DynamicMusicPillExtension | null = null;

export function getInstance() : DynamicMusicPillExtension | null {
    if (instance === null) {
        throw new Error("getInstance called before instance was created");
    }
    return instance;
}

export default class DynamicMusicPillExtension {
    extension: Extension;

    constructor(extension: Extension) {
        this.extension = extension;
        instance = this;
    }

    enable() { 
        logInfo("Extension enabled.");
    }

    disable() {
        logWarning("Extension disabled.");
    }
}