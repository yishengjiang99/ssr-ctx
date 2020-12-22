/// <reference types="node" />
import { AudioDataSource } from "./audio-data-source";
import { SSRContext } from "../ssrctx";
export declare class FileSource extends AudioDataSource {
    offset: number;
    fd: number;
    output: Buffer;
    wptr: number;
    size: number;
    constructor(ctx: SSRContext, { filePath, }: {
        filePath: string;
    });
    read(): Buffer;
    free(): void;
}
