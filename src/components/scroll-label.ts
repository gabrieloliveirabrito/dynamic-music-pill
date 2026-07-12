import St from "@girs/st-18/st-18"
import Clutter from "@girs/clutter-18/clutter-18"
import GObject from "@girs/gobject-2.0/gobject-2.0"
import Pango from "gi://Pango";
import GLib from "gi://GLib";
import { getAppContext } from "@/extension";
import { AppContext } from "@/types/app-context";
import { PixelSnappedBox } from "./pixel-snapped-box";
import { WidgetProps } from "@/types/shell-types";
import { TextFadeEffect } from "./effects/text-fade-effect";

export class ScrollLabel extends St.Widget {
    private _appContext: AppContext;
    private _text: string = "";
    private _gameMode: boolean = false;
    private _playerPaused: boolean = false;
    private _paused: boolean = false;
    private _isScrolling: boolean = false;
    private _hoverOnly: boolean = false;
    private _hovered: boolean = false;
    private _forceScroll: boolean = false;
    private _pendingScrollStop: boolean = false;
    private _lyricTime: number = 0;
    private _container: PixelSnappedBox;
    private _label1: St.Label;
    private _label2: St.Label;
    private _separator: St.Widget;
    private _fadeEffect: TextFadeEffect | null = null;
    private _fadeEffectAttached: boolean = false;
    private _resizeTimer: number | null = null;
    private _measureTimeout: number | null = null;
    private _idleResizeId: number | null = null;
    private _ignoreResizeUntil: number = 0;
    private _isFinalized: boolean = false;
    private _lyricFinished: boolean = false;
    private _scrollTimer : number | null = null;

    static {
        GObject.registerClass(this)
    }

    constructor(styleClass: string, properties?: Partial<St.Widget.ConstructorProps>, ...args: any[]) {
        super(properties, args);

        this.layoutManager = new Clutter.BinLayout();
        this.set_x_expand(true)
        this.set_y_expand(false);
        this.set_clip_to_allocation(true);

        this._appContext = getAppContext();
        const { scrollControls } = this._appContext.settings;

        this._hoverOnly = scrollControls.onHoverOnly;
        this._container = new PixelSnappedBox({
            x_expand: true,
            y_expand: true,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
            orientation: Clutter.Orientation.HORIZONTAL
        })
        this.add_child(this._container)

        this._label1 = new St.Label({
            style_class: styleClass,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._label1.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
        this._label1.clutter_text.line_wrap = false;

        this._label2 = new St.Label({
            style_class: styleClass,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._label2.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
        this._label2.clutter_text.line_wrap = false;

        this._separator = new St.Widget({ width: 30});

        this._container.add_child(this._label1);
        this._container.add_child(this._separator);
        this._container.add_child(this._label2);

        scrollControls.connect("changed::scroll-text", () => {
            this.setText(this._text, true)
        });

        scrollControls.connect("changed::scroll-on-hover-only", () => {
            this._hoverOnly = scrollControls.onHoverOnly;
            if (this._hoverOnly && !this._hovered) 
                this._stopAnimation();
            else 
                this.setText(this._text, true);
        });

        scrollControls.connect("changed::freeze-scroll-on-pause", () => {
            this._updatePausedState();
        });

        scrollControls.connect("notify::allocation", () => {
            if (this._resizeTimer) {
                GLib.Source.remove(this._resizeTimer);
            }

            this._resizeTimer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, () => {
                this._resizeTimer = null;
                if (this.has_allocation())  {
                    this._checkResize();
                }
                return GLib.SOURCE_REMOVE;
            });
        });

        this.connect("destroy", this._cleanup.bind(this));
    }

    override vfunc_get_preferred_width(forHeight: number): [number, number] {
        if (this._label1) {
            let [minW, natW] = this._label1.get_preferred_width(forHeight);
            return [0, natW];
        }
        return super.vfunc_get_preferred_width(forHeight);
    }

    setLabelStyle(css: string) {
        if (this._label1) {
            this._label1.set_style(css);
        }

        if (this._label2) {
            this._label2.set_style(css);
        }
    }

    private _setFadeOutEffect(enableLeft = true, enableRight = true, animate = false) {
        if (!this._label1) {
            return;
        }

        let fontDesc = this._label1.get_theme_node().get_font();
        let fadeWidth = (fontDesc.get_size() / Pango.SCALE) * 4;

        if (!this._fadeEffect) {
            this._fadeEffect = new TextFadeEffect(fadeWidth);
            this.add_effect(this._fadeEffect);
        } else  if (!this._fadeEffectAttached) {
            this.add_effect(this._fadeEffect);
        }
        this._fadeEffectAttached = true;

        this._fadeEffect.setFadePixels(fadeWidth);
        this._fadeEffect.setEdges(enableLeft, enableRight, animate);
    }

    private _clearFadeOutEffect() {
        if (!this._fadeEffect || !this._fadeEffectAttached) {
            return;
        }

        this._fadeEffect.setEdges(false, false, false);
        this.remove_effect(this._fadeEffect);
        this._fadeEffectAttached = false;
    }

    private _cleanup() {
        this._stopAnimation();

        if (this._fadeEffect) {
            if (this._fadeEffectAttached) {
                this.remove_effect(this._fadeEffect);
            }

            this._fadeEffect = null;
            this._fadeEffectAttached = false;
        }

        this._cleanupTimers();
    }

    private _cleanupTimers() {
        if (this._resizeTimer) {
            GLib.Source.remove(this._resizeTimer);
            this._resizeTimer = null;
        }

        if (this._measureTimeout) {
            GLib.Source.remove(this._measureTimeout);
            this._measureTimeout = null;
        }

        if (this._idleResizeId) {
            GLib.Source.remove(this._idleResizeId);
            this._idleResizeId = null;
        }
    }

    setGameMode(active: boolean) {
        this._gameMode = active;

        if (active) {
            this._stopAnimation();
        } else {
            this._checkResize();
        }
    }

    setPlayerPaused(isPaused: boolean) { 
        this._playerPaused = isPaused;

        this._updatePausedState();
    }

    private _updatePausedState() {
        let shouldPause = this._playerPaused && this._appContext.settings.scrollControls.freezeOnPause;
        if (shouldPause) {
            if (this._paused) {
                return;
            }

            this._cleanupTimers();
            this._stopAnimation(true);
        } else if (this._paused) {
            this._paused = false;
            this._checkResize();
        }
    }

    setHoverMode(hovered: boolean) {
        this._hovered = hovered;

        if (!this._hoverOnly) {
            return;
        }

        if (this._hovered) {
            this._checkResize();
            return;
        }

        if (this._lyricTime > 0) {
            return;
        }

        if (this._forceScroll) {
            return;
        }

        if (this._isScrolling) {
            this._pendingScrollStop = true;
        } else {
            this._stopAnimation(true);
            this._container.x_align = Clutter.ActorAlign.CENTER;

            this._label2.hide();
            this._separator.hide();
        }
    }

    setForceScroll(force: boolean) {
        this._forceScroll = force;

        if (force) {
            this._checkResize();
        }
    }

    setPendingScrollStop(stop: boolean) {
        this._pendingScrollStop = stop;
    }

    private _checkResize() {
        if (!this._text || this._gameMode || this._paused) {
            return;
        }

        if (this._ignoreResizeUntil && Date.now() < this._ignoreResizeUntil) {
            return;
        }

        if (this._idleResizeId) {
            GLib.Source.remove(this._idleResizeId);
            this._idleResizeId = null;
        }

        this._idleResizeId = GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
            if (!this) {
                return GLib.SOURCE_REMOVE;
            }
            this._idleResizeId = null;

            if (this._isFinalized || !this.get_parent()) {
                return GLib.SOURCE_REMOVE;
            }

            if (this._lyricFinished) {
                return GLib.SOURCE_REMOVE;
            }

            let boxWidth = this.get_allocation_box().get_width();
            if (boxWidth <= 1) {
                return GLib.SOURCE_REMOVE;
            }
            
            this._label1.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
            let textWidth = this._label1.get_preferred_width(-1)[1] || 0;

            let needsScroll = (textWidth > boxWidth + 5) && this._appContext.settings.scrollControls.scrollText || this._lyricTime > 0;
            let isScrolling = (this._scrollTimer != null) || this._isScrolling;

            if (needsScroll && !isScrolling) {
                this._container.x_align = Clutter.ActorAlign.START;
                if (this._lyricTime > 0) {
                    this._startLyricScroll(textWidth);
                } else if (!this._hoverOnly || this._hovered || this._forceScroll) {
                    this._startInfiniteScroll(textWidth);
                }
            } else if (!needsScroll && isScrolling) {
                this._stopAnimation(true);
                this._container.x_align = Clutter.ActorAlign.CENTER;
                this._label2.hide();
                this._separator.hide();
            } else if (!needsScroll) {
                this._stopAnimation(true);
                this._container.x_align = Clutter.ActorAlign.CENTER;
            }

            return GLib.SOURCE_REMOVE;
        });
    }

    setText(text: string, force = false, lyricTime = 0) {
        if (!force && this._text === text) {
            return;
        }

        const { scrollControls, lyrics, pill }= this._appContext.settings;

        this._text = text || "";
        this._lyricTime = lyricTime;
        this._lyricFinished = false;

        this._stopAnimation(true);
        this._container.x_align = Clutter.ActorAlign.CENTER;

        this._label1.text = this._text;
        this._label2.text = this._text;
        this._label2.hide();
        this._separator.hide();
        this._label1.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;

        this._label1.remove_transition('opacity');
        let isLyric = lyricTime > 0;
        let lyricFadeEnabled = lyrics.fade;

        if (!isLyric || (isLyric && lyricFadeEnabled)) {
            let duration = isLyric ? lyrics.fadeDuration : 300;
            this._label1.opacity = 0;
            this._label1.ease({
                opacity: 255,
                duration: duration,
                mode: Clutter.AnimationMode.EASE_OUT_QUAD
            });
        } else {
            this._label1.opacity = 255;
        }

        if (!scrollControls.scrollText && !this._lyricTime || this._paused) {
            return;
        }

        if(pill.dynamicWidth) {
            this._ignoreResizeUntil = Date.now() + 450;
        }

        let delay = pill.dynamicWidth ? 450 : 100;

        if (this._measureTimeout) {
            GLib.Source.remove(this._measureTimeout);
            this._measureTimeout = null;
        }

        this._measureTimeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, () => {
            this._measureTimeout = null;

            if (this.has_allocation()) {
                this._checkOverflow();
            }

            return GLib.SOURCE_REMOVE;
        });
    }

    private _stopAnimation(resetPosition = true) {
        this._isScrolling = false;
        this._clearFadeOutEffect();
        this._container.remove_all_transitions();

        if (resetPosition) {
            this._container.translation_x = 0;
        }

        if (this._scrollTimer) {
            GLib.Source.remove(this._scrollTimer);
            this._scrollTimer = null;
        }
    }

    private _checkOverflow() {
        if (this._gameMode || this._paused || !this.get_parent()) {
            return;
        }

        let boxWidth = this.get_allocation_box().get_width();
        if (boxWidth <= 1) {
            return;
        }

        let textWidth = this._label1.get_preferred_width(-1)[1] || 0;
        let needsScroll = textWidth > boxWidth + 5;

        if (needsScroll) {
            this._container.x_align = Clutter.ActorAlign.START;

            if (this._lyricTime > 0) {
                this._startLyricScroll(textWidth);
            } else if (this._appContext.settings.scrollControls.scrollText) {
                if (!this._hoverOnly || this._hovered || this._forceScroll) {
                    this._startInfiniteScroll(textWidth);
                }
            }
        } else {
            this._stopAnimation(true);
            this._container.x_align = Clutter.ActorAlign.CENTER;
        }
    }

    private _startInfiniteScroll(textWidth: number) {
        this._stopAnimation(true);
        this._isScrolling = true;
        this._label2.show();
        this._separator.show();

        const distance = textWidth + 30;
        const duration = (distance / 30) * 1000;

        const loop = () => {
            if (this._gameMode || !this.get_parent()) {
                return GLib.SOURCE_REMOVE;
            }

            if (this._pendingScrollStop) {
                this._pendingScrollStop = false;
                this._isScrolling = false;
                this._stopAnimation(true);
                this._container.x_align = Clutter.ActorAlign.CENTER;
                this._label2.hide();
                this._separator.hide();

                return GLib.SOURCE_REMOVE;
            }

            this._setFadeOutEffect(true, true, true);

            this._container.ease({
                translationX: -distance,
                duration: duration,
                mode: Clutter.AnimationMode.LINEAR,
                onStopped: (isFinished) => {
                    if (!isFinished || this._gameMode || this._pendingScrollStop) {
                        this._isScrolling = false;
                        this._pendingScrollStop = false;

                        return;
                    }

                    this._container.translation_x = 0;
                    loop();
                }
            });

            return GLib.SOURCE_REMOVE;
        }
        loop();
    }

    private _startLyricScroll(textWidth: number) {
        this._stopAnimation(true);
        this._isScrolling = true;
        this._label2.hide();
        this._separator.hide();

        let boxWidth = this.get_allocation_box().get_width();
        const distance = textWidth - boxWidth;

        if (distance <= 5) {
            return;
        }

        const totalDurationMs = this._lyricTime * 1000;
        const pauseTime = (boxWidth / textWidth) * totalDurationMs * 0.5;
        const tailTime = totalDurationMs * 0.2;
        const scrollDuration = totalDurationMs - pauseTime - tailTime;

        if (scrollDuration <= 0) {
            return;
        }

        this._clearFadeOutEffect();
        if (this._scrollTimer) {
            GLib.Source.remove(this._scrollTimer);
        }

        this._scrollTimer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, Math.max(100, pauseTime), () => {
            this._scrollTimer = null;
            if (this._gameMode || !this.get_parent()) {
                return GLib.SOURCE_REMOVE;
            }

            this._container.ease({
                translationX: -distance,
                duration: scrollDuration,
                mode: Clutter.AnimationMode.LINEAR,
                onStopped: () => {
                    this._isScrolling = false;
                    this._lyricFinished = true;
                }
            });

            return GLib.SOURCE_REMOVE;
        })
    }
}

export function _addBtnPressAnim(btn: St.Button) {
    btn.set_pivot_point(0.5, 0.5);
    btn.connect('button-press-event', () => {
        btn.remove_all_transitions();
        btn.ease({
            scaleX: 0.84, 
            scaleY: 0.84, 
            duration: 75, 
            mode: Clutter.AnimationMode.EASE_OUT_QUAD
        })
    });

    btn.connect('button-release-event', () => {
        btn.ease({
            scaleX: 1.0, scaleY: 1.0,
            duration: 160, mode: Clutter.AnimationMode.EASE_OUT_BACK
        });
        return Clutter.EVENT_PROPAGATE;
    })
    btn.connect('leave-event', () => {
        btn.ease({
            scaleX: 1.0, scaleY: 1.0,
            duration: 100, mode: Clutter.AnimationMode.EASE_OUT_QUAD
        });
        return Clutter.EVENT_PROPAGATE;
    })
}