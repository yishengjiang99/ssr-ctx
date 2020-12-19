export {};
// { expect } from "chai";
import { SSRContext } from "../ssrctx";
import { AudioDataSource } from "./audio-data-source";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const expect = require("chai").expect;
describe("audio-data-sources", () => {
  it("before start, connect source", (done) => {
    const ctx = new SSRContext({ nChannels: 1, sampleRate: 44100 });
    expect(ctx.playing).false;

    const source: AudioDataSource = new AudioDataSource(ctx, {
      start: 0.15,
    });
    expect(ctx.playing).false;

    expect(ctx.currentTime).to.equal(0);
    expect(source.read()).to.equal(null);
    ctx.stop();
    done();
  });

  it("starts currentime increase by frame", (done) => {
    const ctx = new SSRContext({ nChannels: 2, sampleRate: 48000 });
    expect(ctx.playing).false;

    ctx.start();
    expect(ctx.playing).true;

    // ctx.connect(process.stdout);
    setTimeout(() => {
      ctx.stop();
      expect(ctx.currentTime).gt(0.9).lt(1.4);

      done();
    }, 1101);
  });
});
