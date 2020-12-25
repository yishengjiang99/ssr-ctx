import { Transform } from "stream";

export class Gain extends Transform {
  gain: number = 1;
  delta: number = 0;
  target: number = 1;
  constructor({ value }) {
    super();
    this.gain = value;
  }
  rampValueTo(newValue: number, atTime: number) {
    this.delta = newValue / atTime;
    this.target = newValue;
  }
  get gainVal() {
    if (this.gain != this.target) this.gain += this.delta;
    return this.gain + 1;
  }
  _transform(c: Buffer, enc, cb) {
    for (let i = 0; i < c.byteLength; i += 4) {
      c.writeFloatLE(c.readFloatLE(i) * this.gainVal, i);
    }
    cb(null, c);
  }
  _flush(cb) {
    cb(null);
  }
}
