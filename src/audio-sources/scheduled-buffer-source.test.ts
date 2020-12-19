import { expect } from "chai";
import { SSRContext } from "../ssrctx";
import { ScheduledBufferSource } from "./scheduled-buffer-source";

describe("audio buffer source", () => {
  it("contains attributes start,end,_buffer", () => {
    const ctx = new SSRContext({
      nChannels: 1,
      bitDepth: 32,
      sampleRate: 48000,
      fps: 10,
    });
    const sprite = new ScheduledBufferSource(ctx, {
      start: 0,
      end: 1,
      buffer: Buffer.allocUnsafe(48000 * 4),
    });
    expect(sprite.isActive()).true;
    expect(ctx.inputs.length).eq(1);
    expect(ctx.playing).false;
   // ctx.pipe(process.stdout);
    ctx.pump();
    console.log(ctx.blockSize);
    expect(sprite.buffer.byteLength).to.equal(48000 * 4 * 0.9);

    ctx.pump();
    expect(ctx.frameNumber).to.eq(2);
    for (let i = 18; i > 0; i--) ctx.pump();
    expect(sprite.isActive()).false;
    expect(ctx.inputs.length).to.equal(0);
    ctx.stop();
  });

  it("can read from flat cache");
});
