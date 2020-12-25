import { expect } from "chai";
import { PassThrough } from "stream";
import { FFAEvalSource, Oscillator } from "../audio-sources";
import { SSRContext } from "../ssrctx";
import { Gain } from "./gain";

describe("filters/gain.test.ts", () => {
  it("filters/gain.test.ts", (done) => {
    const r = new Oscillator(new SSRContext(SSRContext.defaultProps), { frequency: 1 });
    // r.pipe(process.stdout);
    r.pipe(new Gain({ value: 0.001 })).on("data", (d) => {
      expect(d.readFloatLE(0)).lessThan(0.1);
      r.unpipe();
      done();
    });
  });

  // console.log(r.read());
  // let pt = new PassThrough();
  // r.pipe(new Gain({ value: 1.2 })).pipe(pt);
  // pt.on("data", (d) => {
  //   console.log(d);
  //   done();
  // });
  //  console.log(r.listeners("data"));

  //    console.log(r.read());
});
