import { SSRContext } from "../";
import { AudioDataSource } from "./audio-data-source";

export type ScheduledBufferSourceOptions = {
  start: number;
  end: number;
  buffer: Buffer;
};
export class ScheduledBufferSource extends AudioDataSource {
  ctx: SSRContext;
  start: number;
  end: number;
  buffer: Buffer;
  constructor(ctx: SSRContext, opts: ScheduledBufferSourceOptions) {
    super(ctx, opts);
    this.ctx = ctx;
    this.start = opts.start;
    this.end = opts.end;
    this.buffer = opts.buffer; // || null;
    this.ctx.inputs.push(this);
  }

  isActive = (): boolean => {
    if (this.buffer.byteLength === 0) return false;
    return true;
  };
  read(n: number): Buffer | null {
    n = n || this.ctx.blockSize;
    const output = Buffer.allocUnsafe(n).fill(0);
    output.set(this.buffer.slice(0, n));
    this.buffer = this.buffer.slice(n);
    return output;
  }
  addBuffer(buf: Buffer): void {
    this.unshift(buf);
  }
  free(): void {
    //  this.buffer = null;
  }
}
