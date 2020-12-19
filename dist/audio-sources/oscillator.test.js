"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ssrctx_1 = require("../ssrctx");
const Oscillator_1 = require("./Oscillator");
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
        const osc = new Oscillator_1.Oscillator(ssrctx_1.SSRContext.default(), { frequency: 440 });
        chai_1.expect(osc).instanceOf(stream_1.Readable);
        const read = osc.read();
        console.log(osc.read());
        for (let i = 0; i < 128; i++) {
            process.stdout.write(ctx.decoder.decode(read, i) + "\n"); //read[1]
        }
        done();
    });
});
//# sourceMappingURL=oscillator.test.js.map