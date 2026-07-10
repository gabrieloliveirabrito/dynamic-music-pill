import { SettingsProvider } from "@/providers/settings-provider";
import { PreferencesGroupProps } from "@/types/shell-types";
import Adw from "gi://Adw"
import GObject from "gi://GObject"
import GLib from "gi://GLib"
import Gio from "gi://Gio"
import { t } from "@/utils/translate"
import { CacheRow } from "./components/cache-row";
export class CacheGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        const ownCacheDir = GLib.build_filenamev([GLib.get_user_cache_dir(), 'music-pill', 'art']);
        const cacheRow = new CacheRow(ownCacheDir, {
            title: t('Album Art Cache')
        });
        this.add(cacheRow);
    }
}