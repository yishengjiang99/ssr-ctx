"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MixTransform = void 0;
const stream_1 = require("stream");
class MixTransform extends stream_1.Transform {
    constructor(ctx) {
        super();
        this.ctx = ctx;
        this.pendingInput = 1;
        this.currentChunks = [];
    }
    _transform(chunk, encoding, cb) {
        this.currentChunks.push(chunk);
        if (this.currentChunks.length >= this.ctx.inputs.length) {
            this.sumInputs();
        }
        cb(null, null);
    }
    sumInputs() {
        const nSamples = this.ctx.blockSize / 4;
        const sumView = Buffer.allocUnsafe(this.ctx.blockSize);
        for (let i = 0; i < nSamples; i += 4) {
            const val = this.currentChunks.reduce((sum, input, iinputIdx, arr) => {
                return sum + input.readFloatLE(i);
            }, 0);
        }
    }
}
exports.MixTransform = MixTransform;
//# sourceMappingURL=mix-transform.js.map