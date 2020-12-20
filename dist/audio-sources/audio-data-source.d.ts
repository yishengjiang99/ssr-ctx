/// <reference types="node" />
import { SSRContext } from "../ssrctx";
import { Readable, ReadableOptions } from "stream";
export interface AudioDataSourceOptions extends ReadableOptions {
    start?: number;
    end?: number;
}
export declare class AudioDataSource extends Readable {
    ctx: SSRContext;
    start: number | void;
    end: number | null;
    constructor(ctx: SSRContext, { start, end }?: Partial<AudioDataSourceOptions>);
    isActive: () => boolean;
    read(): Buffer | null;
    free(): void;
}
