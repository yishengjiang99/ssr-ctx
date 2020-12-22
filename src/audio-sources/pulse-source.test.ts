import { expect } from "chai";
import { SSRContext } from "../ssrctx";
import { FileSource } from "./file-source";
import { PulseSource } from "./pulse-source";

describe("pulse souce", () => {
  it("it an addable stream of buffers", (done) => {
    const ctx = new SSRContext({
      nChannels: 1,
      bitDepth: 32,
      fps: 100,
      sampleRate: 48000,
    });
    const fss = new FileSource(ctx, {
      filePath: "midisf/acoustic_grand_piano/60.pcm",
    });
    const pipe = new PulseSource(ctx, {
      buffer: Buffer.concat([fss.read(), fss.read(), fss.read()]),
    });
    expect(pipe.buffer.byteLength).eq(ctx.blockSize * 3);
    ctx.on("data", (d) => {
      expect(d.byteLength).to.eq(ctx.blockSize * 2);
      // process.stdout.write(d);
      done();
    });
    ctx.pump();
  });
});
