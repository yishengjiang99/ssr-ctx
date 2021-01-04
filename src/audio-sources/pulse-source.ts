import { SSRContext } from "..";
import { Envelope } from "../envelope";
import { AudioDataSource } from "./audio-data-source";
export type Second = number;
export type percent = number;
export type Radian = number; // time divided by sample rate
export type timeconstant = number;
export type PulseSourceOptions = {
  buffer: Buffer;
  envelope?: Envelope;
};

export class PulseSource extends AudioDataSource {
  ctx: SSRContext;
  buffer: Buffer;
  envelope: Envelope; // = 0;
  lastMultiplier: number;
  constructor(ctx: SSRContext, opts: PulseSourceOptions) {
    super(ctx);
    this.ctx = ctx;
    this.envelope = opts.envelope;
    if (opts.envelope) {
      for (let i = 0; i <= opts.buffer.byteLength - 4; i += 4) {
        const val = opts.buffer.readFloatLE(i) * this.envelope.shift();
        opts.buffer.writeFloatLE(val, i);
      }
    }
    this.buffer = opts.buffer; // || null;
    this.ctx.inputs.push(this);
  }

  isActive = (): boolean => {
    if (this.buffer.byteLength === 0) return false;
    return true;
  };
  read(): Buffer {
    const output = Buffer.alloc(this.ctx.blockSize).fill(0);
    output.set(this.buffer.slice(0, this.ctx.blockSize));
    this.buffer = this.buffer.slice(this.ctx.blockSize);
    return output;
  }
  addBuffer(buf: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, buf]);
  }
  free(): void {
    //  this.buffer = null;
  }
}
