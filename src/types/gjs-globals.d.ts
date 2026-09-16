/** Minimal Soup types — recommend installing @girs/libsoup-3.0 for full typings. */
declare module "gi://Soup" {
    interface SoupBytes {
        get_data(): Uint8Array;
    }

    class SoupSession {
        constructor();
        send_and_read_async(msg: SoupMessage, priority: number, cancellable: null): Promise<SoupBytes>;
        abort(): void;
    }

    class SoupMessage {
        static new(method: string, uri: string): SoupMessage | null;
        status_code: number;
    }

    class SoupStatus {
        static OK: number;
    }

    const Soup: {
        Session: typeof SoupSession;
        Message: typeof SoupMessage;
        Status: typeof SoupStatus;
    };

    export default Soup;
}

declare const global: {
    display: {
        get_size(): [number, number];
    };
    stage: {
        set_key_focus(actor: unknown): void;
    };
};
