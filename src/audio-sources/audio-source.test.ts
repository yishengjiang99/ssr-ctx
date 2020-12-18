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
    ctx.start();

    console.log(ctx.pump());
    expect(source.read()).to.equal(null);
    expect(ctx.currentTime).to.equal(0);
    expect(ctx.playing).true;
    done();
    console.log(ctx.listenerCount);
  });
});
