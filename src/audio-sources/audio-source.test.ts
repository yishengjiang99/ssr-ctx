import { expect } from "chai";
import { SSRContext } from "../ssrctx";
import { AudioDataSource } from "./audio-data-source";

describe("audio-data-sources", () => {
  let ctx: SSRContext;
  beforeEach(() => {
    ctx = SSRContext.default();
  });
  afterEach(() => {
    ctx.stop();
  });

  it("sources", (done) => {
    let source = new AudioDataSource(ctx, {
      start: 0.15,
    });
    expect(ctx.currentTime).to.equal(0);

    ctx.start();
    expect(ctx.currentTime).to.equal(ctx.secondsPerFrame);
    expect(source.read()).to.equal(null);
    expect(ctx.playing).true;
    done();
  });
});
