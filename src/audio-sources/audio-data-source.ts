import { SSRContext } from "../ssrctx";
import { Readable, ReadableOptions } from "stream";
export interface AudioDataSourceOptions extends ReadableOptions {
  start?: number;
  end?: number;
}
export class AudioDataSource extends Readable {
  ctx: SSRContext;
  start: number | void;
  end: number | void;
  _buffer: Buffer | null;
  constructor(ctx: SSRContext, opts?: Partial<AudioDataSourceOptions>) {
    super();
    this.ctx = ctx;
    this.start = opts?.start;
    this.end = opts?.end;
    ctx.inputs.push(this);
  }

  isActive = () => {
    if (this.readableEnded) return false;
    if (this.start !== null && this.start > this.ctx.currentTime) return false;
    if (this.end !== null && this.end < this.ctx.currentTime) return false;
    if (this._buffer && this._buffer.byteLength === 0) return false;
    return true;
  };
  read(): Buffer | null {
    if (!this.isActive() || !this._buffer || this._buffer === null) return null;
    const ret = this._buffer!.slice(0, this.ctx.blockSize);
    if (this._buffer && this._buffer.byteLength === 0) {
      this.emit("ended");
    }
    return ret;
  }
  free(): void {
    this._buffer = null;
  }
}
