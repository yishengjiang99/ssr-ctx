import { Transform, TransformCallback } from "stream";
// L2 = L1 + 20log(r1/r2)dB;
export class DistanceTransform extends Transform {
  constructor(private x: number, private y: number) {
    super();
  }
  _transform(chunk: Buffer, enc: BufferEncoding, cb: TransformCallback) {
    for (let i = 0; i < chunk.byteLength - 3; i += 4) {
      chunk.readFloatLE(i);
    }
  }
}
