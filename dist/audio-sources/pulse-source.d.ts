/// <reference types="node" />
import { SSRContext } from "..";
import { AudioDataSource } from "./audio-data-source";
export declare type PulseSourceOptions = {
    buffer: Buffer;
};
export declare class PulseSource extends AudioDataSource {
    ctx: SSRContext;
    buffer: Buffer;
    envelopeIndex: number;
    constructor(ctx: SSRContext, opts: PulseSourceOptions);
    isActive: () => boolean;
    read(): Buffer;
    addBuffer(buf: Buffer): void;
    free(): void;
}
