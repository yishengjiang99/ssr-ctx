"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ssrctx_1 = require("../ssrctx");
const oscillator_1 = require("./oscillator");
const stream_1 = require("stream");
describe("oscillator", () => {
    it("it has a frequency", (done) => {
        const ctx = new ssrctx_1.SSRContext({
            nChannels: 1,
            sampleRate: 44100,
            bitDepth: 32,
        });
        chai_1.expect(ctx.samplesPerFrame).to.equal(128);
        chai_1.expect(ctx.blockSize).to.equal(ctx.samplesPerFrame * ctx.sampleArray.BYTES_PER_ELEMENT);
        const osc = new oscillator_1.Oscillator(ssrctx_1.SSRContext.default(), { frequency: 440 });
        chai_1.expect(osc).instanceOf(stream_1.Readable);
        done();
    });
});
//# sourceMappingURL=oscillator.test.js.map