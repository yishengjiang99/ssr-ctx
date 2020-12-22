"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledBufferSource = void 0;
const audio_data_source_1 = require("./audio-data-source");
class ScheduledBufferSource extends audio_data_source_1.AudioDataSource {
    constructor(ctx, opts) {
        super(ctx, opts);
        this.isActive = () => {
            if (this.buffer.byteLength === 0)
                return false;
            return true;
        };
        this.ctx = ctx;
        this.start = opts.start;
        this.end = opts.end;
        this.buffer = opts.buffer; // || null;
        this.ctx.inputs.push(this);
    }
    read(n) {
        n = n || this.ctx.blockSize;
        const output = Buffer.allocUnsafe(n).fill(0);
        output.set(this.buffer.slice(0, n));
        this.buffer = this.buffer.slice(n);
        return output;
    }
    addBuffer(buf) {
        this.unshift(buf);
    }
    free() {
        //  this.buffer = null;
    }
}
exports.ScheduledBufferSource = ScheduledBufferSource;
//# sourceMappingURL=scheduled-buffer-source.js.map