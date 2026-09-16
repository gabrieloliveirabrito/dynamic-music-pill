import St from "gi://St";
import Clutter from "gi://Clutter";

type DashDelegate = {
    handleDragOver?: (...args: unknown[]) => unknown;
    acceptDrop?: (...args: unknown[]) => unknown;
    _musicPillOrigHandleDragOver?: (...args: unknown[]) => unknown;
    _musicPillOrigAcceptDrop?: (...args: unknown[]) => unknown;
};

export function setupDragFix(
    container: St.BoxLayout,
    pill: St.Widget,
    getIsMoving: () => boolean,
    setIsMoving: (value: boolean) => void
): void {
    const dash = (container as St.BoxLayout & { _delegate?: DashDelegate })._delegate;
    if (!dash?.handleDragOver || dash._musicPillOrigHandleDragOver) {
        return;
    }

    const adjustX = (x: number): number => {
        if (!pill || pill.get_parent() !== container) {
            return x;
        }
        const pillWidth = pill.get_width();
        const pillX = pill.x;
        if (x > pillX + pillWidth) {
            return x - pillWidth;
        }
        if (x >= pillX) {
            return pillX;
        }
        return x;
    };

    const adjustWidth = <T>(fn: () => T): T => {
        const pillWidth = pill?.get_parent() === container ? pill.get_width() : 0;
        if (pillWidth > 0) {
            Object.defineProperty(container, "width", {
                get() { return container.get_width() - pillWidth; },
                configurable: true,
                enumerable: false,
            });
        }
        try {
            return fn();
        } finally {
            if (pillWidth > 0) {
                Reflect.deleteProperty(container, "width");
            }
        }
    };

    dash._musicPillOrigHandleDragOver = dash.handleDragOver;
    dash.handleDragOver = (source, actor, x, y, time) =>
        adjustWidth(() =>
            dash._musicPillOrigHandleDragOver!.call(dash, source, actor, adjustX(x as number), y, time));

    if (typeof dash.acceptDrop === "function") {
        dash._musicPillOrigAcceptDrop = dash.acceptDrop;
        dash.acceptDrop = (source, actor, x, y, time) => {
            const parent = pill.get_parent();
            if (parent) {
                setIsMoving(true);
                parent.remove_child(pill);
            }
            const result = dash._musicPillOrigAcceptDrop!.call(dash, source, actor, adjustX(x as number), y, time);
            if (parent) {
                parent.insert_child_at_index(pill, 0);
            }
            setIsMoving(false);
            return result;
        };
    }
}

export function teardownDragFix(container: St.BoxLayout): void {
    const dash = (container as St.BoxLayout & { _delegate?: DashDelegate })._delegate;
    if (!dash) {
        return;
    }
    if (dash._musicPillOrigHandleDragOver) {
        dash.handleDragOver = dash._musicPillOrigHandleDragOver;
        delete dash._musicPillOrigHandleDragOver;
    }
    if (dash._musicPillOrigAcceptDrop) {
        dash.acceptDrop = dash._musicPillOrigAcceptDrop;
        delete dash._musicPillOrigAcceptDrop;
    }
}
