/// <reference types="node" />
import { Readable, Writable } from "stream";
import { AudioDataSource } from "./audio-sources/audio-data-source";
import { Decoder, Encoder } from "./codec";
export interface CtxProps {
    nChannels?: number;
    sampleRate?: number;
    fps?: number;
    bitDepth?: number;
}
export declare class SSRContext extends Readable {
    encoder: Encoder;
    nChannels: number;
    playing: boolean;
    sampleRate: number;
    fps: number;
    lastFrame: number;
    output: Writable;
    frameNumber: number;
    bitDepth: number;
    timer: any;
    t0: number;
    static default(): SSRContext;
    static defaultProps: CtxProps;
    end: number;
    decoder: Decoder;
    inputs: AudioDataSource[];
    constructor({ nChannels, sampleRate, bitDepth }?: CtxProps);
    get secondsPerFrame(): number;
    get samplesPerFrame(): number;
    encode(buffer: Buffer, value: number, index: number): void;
    get sampleArray(): Uint8ArrayConstructor | Int16ArrayConstructor | Float32ArrayConstructor;
    _read(): Promise<Uint8Array> | null;
    pump(): boolean;
    get blockSize(): number;
    get currentTime(): number;
    get bytesPerSecond(): number;
    connect(destination: Writable): void;
    start: () => void;
    getRms(): void;
    stop(second?: number): void;
}
//# sourceMappingURL=ssrctx.d.ts.map