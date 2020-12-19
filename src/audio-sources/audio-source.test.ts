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
    expect(ctx.blockSize).eq(128 * 2);
    expect(ctx.playing).false;

    ctx.start();
    expect(ctx.playing).true;

    // ctx.connect(process.stdout);
    setTimeout(() => {
      ctx.stop();
      expect(ctx.currentTime).gt(1).lt(1.2);

      done();
    }, 1101);
  });
});

describe("scheduled audio sprites", () => {
  it("schedules a sequence os sounds", () => {
    const ctx = new SSRContext({
      nChannels: 2,
      bitDepth: 32,
      sampleRate: 48000,
    });
    const sprites = [
      new AudioDataSource(ctx, {
        start: 0.1245,
        end: 0.254,
      }),
    ];
  });
});
