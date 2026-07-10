import Adw from "gi://Adw"
import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";
import { t } from "@/utils/translate"
import { logError } from "@/utils/log"

export class CacheRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    private _ownCacheDir: string;

    constructor(ownCacheDir: string, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        this._ownCacheDir = ownCacheDir;

        const cacheBtn = new Gtk.Button({
            label: t('Clear'),
            valign: Gtk.Align.CENTER,
            css_classes: ['destructive-action']
        });

        cacheBtn.connect('clicked', () => {
            this.clearCache();
        });

        this.add_suffix(cacheBtn);
        this.subtitle = this.buildSubtitle(this.getCacheInfo());
    }

    private clearCache() {
        let en: Gio.FileEnumerator | null = null;
        try {
            const dir = Gio.File.new_for_path(this._ownCacheDir);
            if (!dir.query_exists(null)) {
                return;
            }

            en = dir.enumerate_children('standard::name', Gio.FileQueryInfoFlags.NONE, null);

            let fi;
            while ((fi = en.next_file(null)) !== null) { 
                dir.get_child(fi.get_name()).delete(null);
            }
        }
        catch (error) {
            logError(error);
        }
        finally {
            en?.close(null);
        }

        this.subtitle = this.buildSubtitle(this.getCacheInfo());
    }

    private getCacheInfo() {
        let en: Gio.FileEnumerator | null = null;
        try {
            const dir = Gio.File.new_for_path(this._ownCacheDir);
            if (!dir.query_exists(null)) {
                return { count: 0, size: 0 };
            }

            en = dir.enumerate_children('standard::size', Gio.FileQueryInfoFlags.NONE, null);
            let count = 0, size = 0, fi;
            while ((fi = en.next_file(null)) !== null) {
                count++;
                size += fi.get_size();
            }
            en.close(null);
            return { count, size };
        } catch (error) {
            logError(error);
            return { count: 0, size: 0 };
        } finally {
            en?.close(null);
        }
    }

    private kiloPow(power: number) {
        return Math.pow(1024, power);
    }

    private formatSize(size: number) {
        if (size < this.kiloPow(1)) {
            return `${size} B`;
        }

        if (size < this.kiloPow(2)) {
            return `${(size / this.kiloPow(1)).toFixed(1)} KB`;
        } else if (size < this.kiloPow(3)) {
            return `${(size / this.kiloPow(2)).toFixed(1)} MB`;
        } else {
            return `${(size / this.kiloPow(3)).toFixed(1)} GB`;
        }
    }

    private buildSubtitle(info: { count: number, size: number }) {
        return `${info.count} ${t('covers cached')}  —  ${this.formatSize(info.size)}`;
    }
}