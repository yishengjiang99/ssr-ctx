"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// { expect } from "chai";
const ssrctx_1 = require("../ssrctx");
const audio_data_source_1 = require("./audio-data-source");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const expect = require("chai").expect;
describe("audio-data-sources", () => {
    it("before start, connect source", (done) => {
        const ctx = new ssrctx_1.SSRContext({ nChannels: 1, sampleRate: 44100 });
        expect(ctx.playing).false;
        const source = new audio_data_source_1.AudioDataSource(ctx, {
            start: 0.15,
        });
        expect(ctx.playing).false;
        expect(ctx.currentTime).to.equal(0);
        expect(source.read()).to.equal(null);
        ctx.stop();
        done();
    });
    it("starts currentime increase by frame", (done) => {
        const ctx = new ssrctx_1.SSRContext({ nChannels: 2, sampleRate: 48000 });
        expect(ctx.playing).false;
        ctx.start();
        expect(ctx.playing).true;
        // ctx.connect(process.stdout);
        setTimeout(() => {
            ctx.stop();
            expect(ctx.currentTime).gt(0.9).lt(1.4);
            done();
        }, 1101);
    });
});
//# sourceMappingURL=audio-source.test.js.map