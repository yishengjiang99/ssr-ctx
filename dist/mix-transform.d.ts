/// <reference types="node" />
import { Transform, TransformCallback } from "stream";
import { SSRContext } from "./ssrctx";
export declare class MixTransform extends Transform {
    ctx: SSRContext;
    pendingInput: number;
    currentChunks: Buffer[];
    constructor(ctx: SSRContext);
    _transform(chunk: Buffer, encoding: BufferEncoding, cb: TransformCallback): void;
    sumInputs(): void;
}
