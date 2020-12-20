/// <reference types="node" />
import { ChildProcess } from "child_process";
import { PassThrough } from "stream";
import { SSRContext } from "../ssrctx";
import { AudioDataSource } from "./audio-data-source";
export declare class FFAEvalSource extends AudioDataSource {
    proc: ChildProcess;
    pt: PassThrough;
    buffer: Buffer;
    constructor(ctx: SSRContext, expression: string, seconds: number);
    read(): Buffer | null;
}
export declare const cspawnToBuffer: (prco: ChildProcess, ob?: Buffer) => Promise<Buffer>;
