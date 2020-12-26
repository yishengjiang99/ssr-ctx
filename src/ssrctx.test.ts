import { expect } from "chai";
import { execFileSync } from "child_process";
import { execFile } from "child_process";
import { openSync, readFileSync, readSync } from "fs";
import { PulseSource } from "./audio-sources";
import { SSRContext } from "./ssrctx";
import { ffplay } from "./sinks";
describe("ssrctx", () => {
  it('stands for server side render of "context"', (done) => {
    expect(SSRContext.default()).to.exist;
    const ctx = new SSRContext({
      bitDepth: 32,
      nChannels: 1,
      sampleRate: 44100,
    });
    const fd = openSync("./samples/440.pcm", "r"); //fish.pcm", "r");
    [1, 3, 5].map((offset) => {
      const ob = Buffer.allocUnsafe(352800);
      readSync(fd, ob, 0, 352800, offset * 352800);
      return new PulseSource(ctx, { buffer: ob });
    });
    // ctx.on("data", (d: Buffer) => {
    //   for (let i = 0; i < d.byteLength / 4 - 4; i++) {
    //     console.log(d.readFloatLE(i * 4));
    //     expect(d.readFloatLE(i * 4)).lessThan(1);
    //     //expect(i).lessThan(1.0);
    //   }
    // });
    ctx.once("end", () => {
      expect(true);
      return done();
    });
    // ctx.pipe(ffplay());
    ctx.start();
    // ctx.pump();
  }).timeout(10000);
});
