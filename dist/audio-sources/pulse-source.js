"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PulseSource = void 0;
const audio_data_source_1 = require("./audio-data-source");
class PulseSource extends audio_data_source_1.AudioDataSource {
    constructor(ctx, opts) {
        super(ctx);
        this.envelopeIndex = 0;
        this.isActive = () => {
            if (this.buffer.byteLength === 0)
                return false;
            return true;
        };
        this.ctx = ctx;
        this.buffer = opts.buffer; // || null;
        this.ctx.inputs.push(this);
    }
    read() {
        const output = Buffer.alloc(this.ctx.blockSize).fill(0);
        output.set(this.buffer.slice(0, this.ctx.blockSize));
        this.buffer = this.buffer.slice(this.ctx.blockSize);
        return output;
    }
    addBuffer(buf) {
        this.buffer = Buffer.concat([this.buffer, buf]);
    }
    free() {
        //  this.buffer = null;
    }
}
exports.PulseSource = PulseSource;
//# sourceMappingURL=pulse-source.js.map