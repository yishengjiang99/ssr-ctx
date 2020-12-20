/// <reference types="node" />
import { SSRContext } from "../ssrctx";
import { AudioDataSource, AudioDataSourceOptions } from "./audio-data-source";
export interface OscillatorProps extends AudioDataSourceOptions {
    frequency: number;
}
export declare class Oscillator extends AudioDataSource {
    frequency: any;
    constructor(ctx: SSRContext, opts: OscillatorProps);
    read(): Buffer;
}
