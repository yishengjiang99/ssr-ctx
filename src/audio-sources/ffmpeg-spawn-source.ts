import { ChildProcess, spawn } from "child_process";
import { PassThrough } from "stream";
import { SSRContext } from "../ssrctx";
import { AudioDataSource } from "./audio-data-source";

function fmtString(ctx: SSRContext) {
  const fmts = { 8: "u8", 16: "s16le", 32: "f32le" };
  return `-ac ${ctx.nChannels} -ar ${ctx.sampleRate} -f ${fmts[ctx.bitDepth]}`;
}
export class FFAEvalSource extends AudioDataSource {
  proc: ChildProcess;
  pt: PassThrough;
  buffer: Buffer;
  constructor(ctx: SSRContext, expression: string, seconds: number) {
    super(ctx);
    this.pt = new PassThrough();
    this.proc = spawn(
      "ffmpeg",
      `-show_banner=0 -f lavfi -i aevalsrc='${expression}' -t ${seconds} ${fmtString(
        ctx
      )} -`.split(" ")
    );
    this.proc.stdout.on("data", (d) => {
      this.emit("data", d);
      console.log(d);
    });
    this.proc.stdout.on("end", () => {
      console.log(this.proc.exitCode);
    });
  }

  read(): Buffer | null {
    if (!this.buffer) return null;
    else {
      const ret = this.buffer.slice(0, this.ctx.blockSize);

      this.buffer = this.buffer.slice(this.ctx.blockSize);
      if (this.buffer.byteLength === 0) {
        this.emit("end", true);
      }
      return ret;
    }
  }
}
//1-i aevalsrc="sin(333*2*PI*t)" -t 1 -f f32le
export const cspawnToBuffer = (
  prco: ChildProcess,
  ob: Buffer = Buffer.alloc(1024)
): Promise<Buffer> => {
  const { stdout } = prco;
  return new Promise((resolve) => {
    let offset = 0;
    stdout.on("data", (chunk: Buffer) => {
      if (offset + chunk.byteLength > ob.byteLength) {
        const newOb = Buffer.alloc(ob.byteLength + 1024 + chunk.byteLength);
        newOb.set(ob, offset);
        ob = newOb;
      }
      ob.set(chunk, offset);
      offset += chunk.byteLength;
      console.log(chunk);
    });
    ob.slice(0, offset);
    // stderr.on("data", reject);
    stdout.on("end", () => resolve(ob));
  });
};
