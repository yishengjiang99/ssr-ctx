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
    if (this.readableEnded) return false;
    if (this.start > this.ctx.currentTime) return false;
    if (this.end < this.ctx.currentTime) return false;
    if (this.buffer.byteLength === 0) return false;
    return true;
  };
  read(): Buffer | null {
    const ret = this.buffer.slice(0, this.ctx.blockSize);
    this.buffer = this.buffer.slice(this.ctx.blockSize);
    if (this.buffer.byteLength === 0) {
      this.emit("end", true);
    }
    return ret;
  }
  addBuffer(buf: Buffer): void {
    this.unshift(buf);
  }
  free(): void {
    //  this.buffer = null;
  }
}
