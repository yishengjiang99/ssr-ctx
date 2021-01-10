import { expect } from "chai";
import { execFileSync } from "child_process";
import { execFile } from "child_process";
import { openSync, readFileSync, readSync } from "fs";
import { FFAEvalSource, PulseSource } from "./audio-sources";
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
    const fd = openSync("./samples/440.pcm", "r");
    [1, 3, 5].map((offset) => {
      const ob = Buffer.allocUnsafe(441000);
      readSync(fd, ob, 0, 44100, offset * 44100);
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
describe("pump", () => {
  it("pull sound from ctx", () => {
    const ctx = new SSRContext({ bitDepth: 32 });

    ctx.inputs.push(new FFAEvalSource(ctx, "0.1", 1));
    ctx.on("data", (d) => {
      console.log(d);
      const dv = new DataView(d.buffer);
      expect(dv.getFloat32(1, true)).to.eq(0.25);
    });
    ctx.pump({ preamp: 0.5 });
  });
});
