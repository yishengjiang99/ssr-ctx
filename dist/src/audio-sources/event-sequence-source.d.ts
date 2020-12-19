/// <reference types="node" />
import { AudioDataSource } from "./audio-data-source";
import { SSRContext } from "../ssrctx";
import { FlatCache } from "flat-cache";
import { Worker } from "worker_threads";
import { SharedRingBuffer } from "grep-sbr";
declare type seconds = number;
export declare class EventSequenceSource extends AudioDataSource {
    srb: SharedRingBuffer;
    pendingWrites: number;
    time: seconds;
    ticks: number;
    worker: Worker;
    bpm: number;
    constructor(ctx: SSRContext, url: string);
    read(): Buffer | null;
}
export declare function loadBuffer(file: string, noteCache: FlatCache | null, bytes: number): Buffer;
export {};
//# sourceMappingURL=event-sequence-source.d.ts.map