"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ssrctx_1 = require("../ssrctx");
const ffmpeg_spawn_source_1 = require("./ffmpeg-spawn-source");
describe("ffmpeg-spawn-source", () => {
    it("avalsrc", () => {
        const ctx = ssrctx_1.SSRContext.default();
        ctx.sampleRate = 440;
        ctx.bitDepth = 32;
        ctx.fps = 32;
        ctx.nChannels = 1;
        // expect(ctx.blockSize).to.eq(ctx.sampleRate * 4);
        const src = new ffmpeg_spawn_source_1.FFAEvalSource(ctx, "sin(2*PI*440*t)", 1);
        src.pipe(process.stdout);
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
//# sourceMappingURL=ffmpeg-spawn-source.test.js.map