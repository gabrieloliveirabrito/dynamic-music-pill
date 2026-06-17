import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import DistributionExtension from "./dist/extension.js";
//import { MusicController } from './src/controller.js';

export default class DynamicMusicExtension extends Extension {
    _distributionExtension = null;

    constructor(metadata) {
        super(metadata);
        this._distributionExtension = new DistributionExtension(this);
    }

    enable() {
        // if (this._controller) {
        //     this.disable();
        // }
        // this._settings = this.getSettings();

        // this._controller = new MusicController(this);
        // this._controller.enable();
        
        console.log("[DMP] Base enabled");
        this._distributionExtension.enable();
    }

    disable() {
        // if (this._controller) {
        //     this._controller.disable();
        //     this._controller = null;
        // }
        // this._settings = null;
        console.log("[DMP] Base disabled");
        this._distributionExtension.disable();
    }
}
