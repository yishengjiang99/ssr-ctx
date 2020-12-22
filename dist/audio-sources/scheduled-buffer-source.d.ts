/// <reference types="node" />
import { SSRContext } from "../";
import { AudioDataSource } from "./audio-data-source";
export declare type ScheduledBufferSourceOptions = {
    start: number;
    end: number;
    buffer: Buffer;
};
export declare class ScheduledBufferSource extends AudioDataSource {
    ctx: SSRContext;
    start: number;
    end: number;
    buffer: Buffer;
    constructor(ctx: SSRContext, opts: ScheduledBufferSourceOptions);
    isActive: () => boolean;
    read(n: number): Buffer | null;
    addBuffer(buf: Buffer): void;
    free(): void;
}
