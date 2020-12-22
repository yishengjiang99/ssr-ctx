"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioDataSource = void 0;
const stream_1 = require("stream");
class AudioDataSource extends stream_1.Readable {
    constructor(ctx, { start, end } = {}) {
        super();
        this.buffer = Buffer.alloc(0);
        this.isActive = () => {
            if (this.readableEnded)
                return false;
            return true;
        };
        this.ctx = ctx;
        this.start = start || 0;
        this.end = end || null;
    }
    read(n) {
        n = n || this.ctx.blockSize;
        const output = Buffer.allocUnsafe(n).fill(0);
        output.set(this.buffer.slice(0, n));
        this.buffer = this.buffer.slice(n);
        return output;
    }
}
exports.AudioDataSource = AudioDataSource;
//# sourceMappingURL=audio-data-source.js.map