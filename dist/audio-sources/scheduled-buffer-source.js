"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledBufferSource = void 0;
const audio_data_source_1 = require("./audio-data-source");
class ScheduledBufferSource extends audio_data_source_1.AudioDataSource {
    constructor(ctx, opts) {
        super(ctx, opts);
        this.isActive = () => {
            if (this.readableEnded)
                return false;
            if (this.start > this.ctx.currentTime)
                return false;
            if (this.end < this.ctx.currentTime)
                return false;
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
    read() {
        const ret = this.buffer.slice(0, this.ctx.blockSize);
        this.buffer = this.buffer.slice(this.ctx.blockSize);
        console.log(this.buffer.byteLength);
        if (this.buffer.byteLength === 0) {
            this.emit("end", true);
            console.log(this);
        }
        return ret;
    }
    free() {
        //  this.buffer = null;
    }
}
exports.ScheduledBufferSource = ScheduledBufferSource;
//# sourceMappingURL=scheduled-buffer-source.js.map