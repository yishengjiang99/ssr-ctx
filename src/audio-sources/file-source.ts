import { AudioDataSource } from "./audio-data-source";
import { openSync, readSync, close, statSync } from "fs";
import { SSRContext } from "../ssrctx";
//https://www.grepawk.com/bach/notes/french_horn/49
export class FileSource extends AudioDataSource {
  offset: number;
  fd: number;
  output: Buffer;
  wptr: number;
  size: number;

  constructor(
    ctx: SSRContext,
    {
      filePath,
    }: {
      filePath: string;
    }
  ) {
    super(ctx);
    this.fd = openSync(filePath, "r");
    this.size = statSync(filePath).size;
    this.ctx = ctx;
    this.offset = 0;
  }

  prepare?: (currentTime: number) => void = () => {};

  read(): Buffer {
    const ob = Buffer.allocUnsafe(this.ctx.blockSize);
    readSync(this.fd, ob, 0, ob.byteLength, this.offset);
    this.offset += ob.byteLength;
    if (this.offset > this.size) {
      console.log("dd");
      this.emit("ended");
    }
    return ob;
  }
  free() {
    close(this.fd, () => {});
  }
}
