"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSource = void 0;
const audio_data_source_1 = require("./audio-data-source");
const fs_1 = require("fs");
class FileSource extends audio_data_source_1.AudioDataSource {
    constructor(ctx, { filePath, }) {
        super(ctx);
        this.prepare = () => { };
        this.fd = fs_1.openSync(filePath, "r");
        this.size = fs_1.statSync(filePath).size;
        this.ctx = ctx;
        this.offset = 0;
    }
    read() {
        const ob = Buffer.allocUnsafe(this.ctx.blockSize);
        fs_1.readSync(this.fd, ob, 0, ob.byteLength, this.offset);
        this.offset += ob.byteLength;
        if (this.offset > this.size) {
            console.log("dd");
            this.emit("ended");
        }
        return ob;
    }
    free() {
        fs_1.close(this.fd, () => { });
    }
}
exports.FileSource = FileSource;
//# sourceMappingURL=file-source.js.map