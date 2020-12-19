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
    end: number | void;
    _buffer: Buffer | null;
    constructor(ctx: SSRContext, opts?: Partial<AudioDataSourceOptions>);
    isActive: () => boolean;
    read(): Buffer | null;
    free(): void;
}
//# sourceMappingURL=audio-data-source.d.ts.map