"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cspawnToBuffer = exports.FFAEvalSource = void 0;
const child_process_1 = require("child_process");
const stream_1 = require("stream");
const audio_data_source_1 = require("./audio-data-source");
function fmtString(ctx) {
    const fmts = { 8: "u8", 16: "s16le", 32: "f32le" };
    return `-ac ${ctx.nChannels} -ar ${ctx.sampleRate} -f ${fmts[ctx.bitDepth]}`;
}
class FFAEvalSource extends audio_data_source_1.AudioDataSource {
    constructor(ctx, expression, seconds) {
        super(ctx);
        this.pt = new stream_1.PassThrough();
        this.proc = child_process_1.spawn("ffmpeg", `-show_banner=0 -f lavfi -i aevalsrc='${expression}' -t ${seconds} ${fmtString(ctx)} -`.split(" "));
        this.proc.stdout.on("data", (d) => {
            this.emit("data", d);
            console.log(d);
        });
        this.proc.stdout.on("end", () => {
            console.log(this.proc.exitCode);
        });
    }
    read() {
        if (!this.buffer)
            return null;
        else {
            const ret = this.buffer.slice(0, this.ctx.blockSize);
            this.buffer = this.buffer.slice(this.ctx.blockSize);
            if (this.buffer.byteLength === 0) {
                this.emit("end", true);
            }
            return ret;
        }
    }
}
exports.FFAEvalSource = FFAEvalSource;
//1-i aevalsrc="sin(333*2*PI*t)" -t 1 -f f32le
exports.cspawnToBuffer = (prco, ob = Buffer.alloc(1024)) => {
    const { stdout } = prco;
    return new Promise((resolve) => {
        let offset = 0;
        stdout.on("data", (chunk) => {
            if (offset + chunk.byteLength > ob.byteLength) {
                const newOb = Buffer.alloc(ob.byteLength + 1024 + chunk.byteLength);
                newOb.set(ob, offset);
                ob = newOb;
            }
            ob.set(chunk, offset);
            offset += chunk.byteLength;
            console.log(chunk);
        });
        ob.slice(0, offset);
        // stderr.on("data", reject);
        stdout.on("end", () => resolve(ob));
    });
};
//# sourceMappingURL=ffmpeg-spawn-source.js.map