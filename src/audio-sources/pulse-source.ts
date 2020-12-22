import { SSRContext } from "..";
import { AudioDataSource } from "./audio-data-source";
export type percent = number;
export type PulseSourceOptions = {
  buffer: Buffer;
};
export class PulseSource extends AudioDataSource {
  ctx: SSRContext;
  buffer: Buffer;
  envelopeIndex = 0;
  constructor(ctx: SSRContext, opts: PulseSourceOptions) {
    super(ctx);
    this.ctx = ctx;
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
