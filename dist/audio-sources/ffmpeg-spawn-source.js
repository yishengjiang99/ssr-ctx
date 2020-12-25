"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FFAEvalSource = void 0;
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
        this.buffer = Buffer.alloc(0);
        this.pt = new stream_1.PassThrough();
        this.proc = child_process_1.spawn("ffmpeg", `-hide_banner -f lavfi -i aevalsrc='${expression}' -t ${seconds} ${fmtString(ctx)} -`.split(" "));
        this.proc.stdout.on("data", (d) => {
            this.buffer = Buffer.concat([this.buffer, d]);
        });
        this.proc.stdout.on("end", () => {
            this.emit("end");
        });
        // this.proc.stderr.pipe(process.stderr);
        //ctx.inputs.push(this);
    }
    _read(n) {
        console.log(n);
    }
}
exports.FFAEvalSource = FFAEvalSource;
//# sourceMappingURL=ffmpeg-spawn-source.js.map