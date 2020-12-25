import { ChildProcess, spawn } from "child_process";
import { PassThrough } from "stream";
import { Gain } from "../filters/gain";
import { SSRContext } from "../ssrctx";
import { AudioDataSource } from "./audio-data-source";
import { PulseSource } from "./pulse-source";

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
    this.proc = spawn("ffmpeg", `-hide_banner -f lavfi -i aevalsrc='${expression}' -t ${seconds} ${fmtString(ctx)} -`.split(" "));

    this.proc.stdout.on("data", (d) => {
      this.buffer = Buffer.concat([this.buffer, d]);
      console.log("d");
      this.push(d);
    });
    this.proc.stdout.on("error", (e) => {
      console.log(e);
    });
    this.proc.stdout.on("end", () => {
      this.emit("end");
      this.destroy();
    });
    // this.proc.stderr.pipe(process.stderr);
    //ctx.inputs.push(this);
  }
  _read(n) {
    this.push(this.read());
  }
}
const g = new Gain({ value: 1 });
g.rampValueTo(2, 48000);
let gg = new SSRContext();
const c = new PulseSource(gg, {
  buffer: Buffer.alloc(16).fill(1),
});
console.log(gg.pump());
