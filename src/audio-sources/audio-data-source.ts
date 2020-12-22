import { SSRContext } from "../ssrctx";
import { Readable, ReadableOptions } from "stream";
export interface AudioDataSourceOptions extends ReadableOptions {
  start?: number;
  end?: number;
}
export class AudioDataSource extends Readable {
  ctx: SSRContext;
  start: number | void;
  buffer: Buffer = Buffer.alloc(0);
  end: number | null;
  constructor(
    ctx: SSRContext,
    { start, end }: Partial<AudioDataSourceOptions> = {}
  ) {
    super();
    this.ctx = ctx;
    this.start = start || 0;
    this.end = end || null;
  }

  isActive = (): boolean => {
    if (this.readableEnded) return false;
    return true;
  };
  read(n?: number): Buffer {
    n = n || this.ctx.blockSize;
    const output = Buffer.allocUnsafe(n).fill(0);
    output.set(this.buffer.slice(0, n));
    this.buffer = this.buffer.slice(n);
    return null;
  }
}
