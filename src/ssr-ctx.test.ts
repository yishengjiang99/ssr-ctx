import { Oscillator } from "./audio-sources/Oscillator";
import { SSRContext } from "./ssrctx";

import { expect } from "chai";
describe("ssrctx", () => {
  let ctx: SSRContext;
  afterEach(() => {
    ctx.stop();
  });
  it("provides different confs", (done) => {
    ctx = new SSRContext({
      sampleRate: 8000,
      nChannels: 1,
      bitDepth: 16,
    });
    const osc = new Oscillator(ctx, { frequency: 440 });
    expect(osc.read().byteLength).to.equal(ctx.blockSize);
    done();
  });
});
