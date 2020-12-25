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
    _read(n: any): void;
}
