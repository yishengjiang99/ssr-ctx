"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Oscillator_1 = require("./audio-sources/Oscillator");
const ssrctx_1 = require("./ssrctx");
const chai_1 = require("chai");
describe("ssrctx", () => {
    let ctx;
    afterEach(() => {
        ctx.stop();
    });
    it("provides different confs", (done) => {
        ctx = new ssrctx_1.SSRContext({
            sampleRate: 8000,
            nChannels: 1,
            bitDepth: 16,
        });
        const osc = new Oscillator_1.Oscillator(ctx, { frequency: 440 });
        chai_1.expect(osc.read().byteLength).to.equal(ctx.blockSize);
        done();
    });
});
//# sourceMappingURL=ssr-ctx.test.js.map