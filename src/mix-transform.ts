import { expect } from "chai";
import { Transform, TransformCallback } from "stream";
import { SSRContext } from "./ssrctx";

export class MixTransform extends Transform {
  ctx: SSRContext;
  pendingInput: number;
  currentChunks: Buffer[];
  constructor(ctx: SSRContext) {
    super();
    this.ctx = ctx;
    this.pendingInput = 1;
    this.currentChunks = [];
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    cb: TransformCallback
  ): void {
    this.currentChunks.push(chunk);
    if (this.currentChunks.length >= this.ctx.inputs.length) {
      this.sumInputs();
    }
    cb(null, null);
  }

  sumInputs() {
    const nSamples = this.ctx.blockSize / 4;
    const sumView = Buffer.allocUnsafe(this.ctx.blockSize);
    for (let i = 0; i < nSamples; i += 4) {
      const val = this.currentChunks.reduce((sum, input, iinputIdx, arr) => {
        return sum + input.readFloatLE(i);
      }, 0);
    }
  }
}
