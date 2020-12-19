import { SSRContext } from "../ssrctx";
import { Readable, ReadableOptions } from "stream";
export interface AudioDataSourceOptions extends ReadableOptions {
  start?: number;
  end?: number;
}
export class AudioDataSource extends Readable {
  ctx: SSRContext;
  start: number | void;
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

  isActive = () => {
    if (this.readableEnded) return false;
    return true;
  };
  read(): Buffer | null {
    console.log("this is an abstract class");
    return null;
  }
  free(): void {}
}
