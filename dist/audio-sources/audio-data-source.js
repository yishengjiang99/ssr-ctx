"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioDataSource = void 0;
const stream_1 = require("stream");
class AudioDataSource extends stream_1.Readable {
    constructor(ctx, { start, end } = {}) {
        super();
        this.isActive = () => {
            if (this.readableEnded)
                return false;
            return true;
        };
        this.ctx = ctx;
        this.start = start || 0;
        this.end = end || null;
    }
    read() {
        console.log("this is an abstract class");
        return null;
    }
    free() { }
}
exports.AudioDataSource = AudioDataSource;
//# sourceMappingURL=audio-data-source.js.map