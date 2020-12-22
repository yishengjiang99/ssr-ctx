"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ssrctx_1 = require("../ssrctx");
const file_source_1 = require("./file-source");
const pulse_source_1 = require("./pulse-source");
describe("pulse souce", () => {
    it("it an addable stream of buffers", (done) => {
        const ctx = new ssrctx_1.SSRContext({
            nChannels: 1,
            bitDepth: 32,
            fps: 100,
            sampleRate: 48000,
        });
        const fss = new file_source_1.FileSource(ctx, {
            filePath: "midisf/acoustic_grand_piano/60.pcm",
        });
        const pipe = new pulse_source_1.PulseSource(ctx, {
            buffer: Buffer.concat([fss.read(), fss.read(), fss.read()]),
        });
        chai_1.expect(pipe.buffer.byteLength).eq(ctx.blockSize * 3);
        ctx.on("data", (d) => {
            chai_1.expect(d.byteLength).to.eq(ctx.blockSize * 2);
            // process.stdout.write(d);
            done();
        });
        ctx.pump();
    });
});
//# sourceMappingURL=pulse-source.test.js.map