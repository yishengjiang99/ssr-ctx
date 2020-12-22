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
  buffer: Buffer = Buffer.alloc(0);
  constructor(ctx: SSRContext, expression: string, seconds: number) {
    super(ctx);
    this.pt = new PassThrough();
    this.proc = spawn(
      "ffmpeg",
      `-hide_banner -f lavfi -i aevalsrc='${expression}' -t ${seconds} ${fmtString(
        ctx
      )} -`.split(" ")
    );

    this.proc.stdout.on("data", (d) => {
      this.buffer = Buffer.concat([this.buffer, d]);
    });
    this.proc.stdout.on("end", () => {
      this.emit("end");
    });
    // this.proc.stderr.pipe(process.stderr);
    ctx.inputs.push(this);
  }
}
