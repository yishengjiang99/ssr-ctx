import { SSRContext } from "src";
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

  isActive = () => {
    if (this.readableEnded) return false;
    if (this.start > this.ctx.currentTime) return false;
    if (this.end < this.ctx.currentTime) return false;
    if (this.buffer.byteLength === 0) return false;
    return true;
  };
  read(): Buffer | null {
    const ret = this.buffer.slice(0, this.ctx.blockSize);
    this.buffer = this.buffer.slice(this.ctx.blockSize);
    console.log(this.buffer.byteLength);
    if (this.buffer.byteLength === 0) {
      this.emit("end", true);
      console.log(this);
    }
    return ret;
  }
  free(): void {
    //  this.buffer = null;
  }
}
