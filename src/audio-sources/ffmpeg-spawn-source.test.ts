import { expect } from "chai";
import { SSRContext } from "../ssrctx";
import { FFAEvalSource } from "./ffmpeg-spawn-source";

describe.skip("ffmpeg-spawn-source", () => {
  it("avalsrc", (done) => {
    const ctx = SSRContext.default();
    ctx.sampleRate = 44100;
    ctx.bitDepth = 32;
    ctx.fps = 31;
    ctx.nChannels = 1;
    // expect(ctx.blockSize).to.eq(ctx.sampleRate * 4);
    const src = new FFAEvalSource(ctx, "sin(2*PI*440*t)", 1);
    const g = src.read();
    expect(g[0]).eq(0);
    done();
    //src.pipe(process.stdout);

    // src.on("readable", () => {
    //   const buf = src.read();
    //   console.log(buf);
    //   expect(buf).exist;
    //   done();
    // });
    //    src.pipe(process.stdout);
  });
});
// });
// const ctx = SSRContext.default();
// ctx.sampleRate = 440;
// ctx.bitDepth = 32;
// ctx.fps = 1;
// ctx.nChannels = 1;
// expect(ctx.blockSize).to.eq(ctx.sampleRate * 4);
// const src = new FFAEvalSource(ctx, "sin(2*PI*440*t)", 1);
// src.pt.on("readable", () => {
//   const output = src.read();
//   console.log(output);
//   for (let i = 0; i < 440; i++) {
//     const flot = ctx.decoder.decode(val, i);
//     //console.log("\n" + val);
//   }
// });
