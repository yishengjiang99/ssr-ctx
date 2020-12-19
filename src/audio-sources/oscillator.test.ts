import { expect } from "chai";
import { SSRContext } from "../ssrctx";
import { Oscillator } from "./oscillator";
import { Readable } from "stream";
describe("oscillator", () => {
  it("it has a frequency", (done) => {
    const ctx = new SSRContext({
      nChannels: 1,
      sampleRate: 44100,
      bitDepth: 32,
    });
    expect(ctx.samplesPerFrame).to.equal(128);
    expect(ctx.blockSize).to.equal(
      ctx.samplesPerFrame * ctx.sampleArray.BYTES_PER_ELEMENT
    );
    const osc = new Oscillator(SSRContext.default(), { frequency: 440 });
    expect(osc).instanceOf(Readable);

    done();
  });
});
