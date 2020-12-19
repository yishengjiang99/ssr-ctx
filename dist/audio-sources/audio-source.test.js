"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ssrctx_1 = require("../ssrctx");
const audio_data_source_1 = require("./audio-data-source");
describe("audio-data-sources", () => {
    let ctx;
    beforeEach(() => {
        ctx = ssrctx_1.SSRContext.default();
    });
    afterEach(() => {
        ctx.stop();
    });
    it("sources", (done) => {
        let source = new audio_data_source_1.AudioDataSource(ctx, {
            start: 0.15,
        });
        chai_1.expect(ctx.currentTime).to.equal(0);
        ctx.start();
        chai_1.expect(ctx.currentTime).to.equal(ctx.secondsPerFrame);
        chai_1.expect(source.read()).to.equal(null);
        chai_1.expect(ctx.playing).true;
        done();
    });
});
//# sourceMappingURL=audio-source.test.js.map