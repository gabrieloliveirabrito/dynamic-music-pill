import { TrackInfo } from "@/types/player-types";

export type MPRISCallback = (track: TrackInfo) => void;

export interface IMPrisProvider {
    start(): void;
    stop(): void;

    addCallback(name: string, callback: MPRISCallback): void;
    removeCallback(name: string): boolean;
}