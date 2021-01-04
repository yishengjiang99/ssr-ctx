import { Envelope } from "./envelope";
import { expect } from "chai";
import { PulseSource, SSRContext } from ".";
import { readFileSync } from "fs";
import { FileSource } from "./audio-sources";
describe("envelopes", () => {
  it("it has instantiated by sample rate and adsr", () => {
    const [a, d, s, r] = [0.01, 0.1, 0.5, 3];
    const env = new Envelope(1000, [a, d, s, r]);
    const sampleRate = 1000;
    expect(env.deltas).to.deep.eq([
      1 / 0.01 / 1000,
      -(1 - 0.5) / 0.1 / 1000,
      -(1 - s) / 2 / r / sampleRate,
      -(1 - s) / 2 / (3 * r) / sampleRate,
    ]);

    expect(env.shift()).to.eq(1 / 0.01 / 1000);
  });

  it("amps pulse source", () => {
    const ctx = new SSRContext({
      nChannels: 1,
      bitDepth: 32,
      fps: 1,
      sampleRate: 100,
    });
    const buf = new Float32Array(200);
    for (let i = 0; i < 100; i++) buf[i] = 0.5;
    expect(buf[5]).eq(0.5);

    const piper = new PulseSource(ctx, {
      buffer: new FileSource(ctx, { filePath: "samples/440.pcm" }).buffer,
      envelope: new Envelope(ctx.sampleRate, [1, 1, 0, 0.5]),
    });
    const pipe = new DataView(piper.read().buffer);

    expect(pipe.getFloat32(44, true) >= pipe.getFloat32(12, true)).true;
    expect(pipe.getFloat32(12, true) >= pipe.getFloat32(8, true));
  });
});
