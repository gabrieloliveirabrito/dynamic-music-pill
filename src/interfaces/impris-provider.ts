import { TrackInfo } from "@/types/track-info";

export type MPRISCallback = (track: TrackInfo) => void;

export interface IMPrisProvider {
    start(): void;
    stop(): void;

    addCallback(name: string, callback: MPRISCallback): void;
    removeCallback(name: string): boolean;
}