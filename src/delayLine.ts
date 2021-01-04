import { openSync, readSync } from "fs";
import { Readable, Transform } from "stream";
import { PulseSource } from "./audio-sources";
import { SSRContext } from "./ssrctx";
export class DelayLine extends Transform {
  delayedVals: Float32Array;
  constructor(lookAhead: number) {
    super();
    this.delayedVals = new Float32Array(lookAhead);
  }
  _transform(chunk, encoding: BufferEncoding, cb) {
    console.log(chunk);
  }
}
