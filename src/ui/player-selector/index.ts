import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { SettingsProvider } from "@/providers/settings-provider";
import { MediaPlayer } from "@/providers/mpris-provider/media-player";
import { gettext as _ } from "resource:///org/gnome/shell/extensions/extension.js";
import { getPlayerIcon } from "@/utils/player-icon";

export type PlayerSelectorHost = {
    settings: SettingsProvider;
    getPlayers(): MediaPlayer[];
    selectPlayer(busName: string): void;
    closePlayerMenu(): void;
};

export class PlayerSelectorMenu extends St.Widget {
    static {
        GObject.registerClass(this);
    }

    private _host: PlayerSelectorHost;
    private _box: St.BoxLayout;
    private _bg: St.Button;

    constructor(host: PlayerSelectorHost) {
        const [bgW, bgH] = global.display.get_size();
        super({
            width: bgW,
            height: bgH,
            reactive: true,
            visible: false,
            x: 0,
            y: 0,
        } as unknown as St.Widget.ConstructorProps);

        this._host = host;

        this._bg = new St.Button({
            style: "background-color: transparent;",
            reactive: true,
            x_expand: true,
            y_expand: true,
            width: bgW,
            height: bgH,
        });
        this._bg.connect("clicked", () => this.hideMenu());
        this.add_child(this._bg);

        this._box = new St.BoxLayout({
            vertical: true,
            reactive: true,
            style: "padding: 12px; border-radius: 12px; background-color: rgba(30,30,30,0.95); spacing: 6px;",
        });
        this.add_child(this._box);

        this.connect("key-press-event", (_a, event) => {
            if (event.get_key_symbol() === Clutter.KEY_Escape) {
                this.hideMenu();
                return Clutter.EVENT_STOP;
            }
            return Clutter.EVENT_PROPAGATE;
        });
    }

    populate(): void {
        this._box.destroy_all_children();

        const title = new St.Label({
            text: _("Select Media Player"),
            style: "font-weight: bold; margin-bottom: 8px;",
            x_align: Clutter.ActorAlign.CENTER,
        });
        this._box.add_child(title);

        const current = this._host.settings.popup.selectedPlayerBus;

        if (!this._host.settings.popup.autoHidePlayer) {
            this._box.add_child(this._row(
                _("Auto (Smart Selection)"),
                "emblem-system-symbolic",
                current === "",
                () => this._host.selectPlayer("")
            ));
        }

        for (const player of this._host.getPlayers()) {
            const bus = player.getBusName();
            const identity = player.getIdentity()
                || bus.replace("org.mpris.MediaPlayer2.", "").split(".")[0];
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

    showMenu(anchorX: number, anchorY: number, anchorW: number, anchorH: number): void {
        this.populate();
        this.visible = true;
        this.opacity = 0;

        const [, natW] = this._box.get_preferred_width(-1);
        const [, natH] = this._box.get_preferred_height(natW);
        const w = Math.max(natW || 220, 200);
        const h = natH || 120;
        let x = anchorX + (anchorW - w) / 2;
        let y = anchorY - h - 10;
        const monitor = Main.layoutManager.primaryMonitor;
        if (!monitor) {
            return;
        }
        if (y < monitor.y + 8) {
            y = anchorY + anchorH + 10;
        }
        x = Math.max(monitor.x + 8, Math.min(x, monitor.x + monitor.width - w - 8));
        this._box.set_position(Math.round(x), Math.round(y));
        this._box.set_size(Math.round(w), Math.round(h));

        (this as unknown as { ease: Function }).ease({
            opacity: 255,
            duration: 150,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
        });
        global.stage.set_key_focus(this);
    }

    hideMenu(): void {
        (this as unknown as { ease: Function }).ease({
            opacity: 0,
            duration: 120,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            onStopped: () => {
                this.visible = false;
                this._host.closePlayerMenu();
            },
        });
    }

    private _row(
        label: string,
        iconName: string | null,
        selected: boolean,
        onClick: () => void,
        player?: MediaPlayer,
        busName?: string
    ): St.Button {
        const content = new St.BoxLayout({ vertical: false, style: "spacing: 10px;" });
        const icon = new St.Icon({
            icon_size: 22,
            gicon: iconName
                ? null
                : getPlayerIcon(player ?? null, busName ?? ""),
            icon_name: iconName ?? undefined,
        });
        if (iconName) {
            icon.icon_name = iconName;
        }
        content.add_child(icon);
        content.add_child(new St.Label({ text: label, y_align: Clutter.ActorAlign.CENTER }));

        const btn = new St.Button({
            child: content,
            reactive: true,
            can_focus: true,
            x_expand: true,
            style: `border-radius: 10px; padding: 8px; background-color: ${selected ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)"};`,
        });
        btn.connect("clicked", () => {
            onClick();
            this.hideMenu();
        });
        return btn;
    }
}
