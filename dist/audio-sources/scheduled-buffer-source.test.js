"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ssrctx_1 = require("../ssrctx");
const scheduled_buffer_source_1 = require("./scheduled-buffer-source");
describe("audio buffer source", () => {
    it("contains attributes start,end,_buffer", () => {
        const ctx = new ssrctx_1.SSRContext({
            nChannels: 1,
            bitDepth: 32,
            sampleRate: 48000,
            fps: 10,
        });
        const sprite = new scheduled_buffer_source_1.ScheduledBufferSource(ctx, {
            start: 0,
            end: 1,
            buffer: Buffer.allocUnsafe(48000 * 4),
        });
        chai_1.expect(sprite.isActive()).true;
        chai_1.expect(ctx.inputs.length).eq(1);
        chai_1.expect(ctx.playing).false;
        // ctx.pipe(process.stdout);
        ctx.pump();
        console.log(ctx.blockSize);
        chai_1.expect(sprite.buffer.byteLength).to.equal(48000 * 4 * 0.9);
        ctx.pump();
        chai_1.expect(ctx.frameNumber).to.eq(2);
        for (let i = 18; i > 0; i--)
            ctx.pump();
        chai_1.expect(sprite.isActive()).false;
        chai_1.expect(ctx.inputs.length).to.equal(0);
        ctx.stop();
    });
    it("can read from flat cache");
});
//# sourceMappingURL=scheduled-buffer-source.test.js.map