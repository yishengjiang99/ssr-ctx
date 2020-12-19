"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSRContext = void 0;
const stream_1 = require("stream");
const codec_1 = require("./codec");
//#endregion
class SSRContext extends stream_1.Readable {
    constructor({ nChannels, sampleRate, bitDepth } = SSRContext.defaultProps) {
        super();
        this.inputs = [];
        this.start = () => {
            this.playing = true;
            if (this.output === null)
                return;
            let that = this;
            this.timer = setInterval(() => {
                that.pump();
                if (!that.playing || (that.end && that.currentTime >= that.end)) {
                    that.stop(0);
                    clearInterval(this.timer);
                }
            }, this.secondsPerFrame);
        };
        this.nChannels = nChannels;
        this.sampleRate = sampleRate;
        this.fps = this.sampleRate / 128;
        this.frameNumber = 0;
        this.bitDepth = bitDepth;
        this.encoder = new codec_1.Encoder(this.bitDepth);
        this.decoder = new codec_1.Decoder(this.bitDepth);
        this.playing = false;
    }
    static default() {
        return new SSRContext(SSRContext.defaultProps);
    }
    get secondsPerFrame() {
        return 1 / this.fps;
    }
    get samplesPerFrame() {
        return 128;
    }
    encode(buffer, value, index) {
        this.encoder.encode(buffer, value, index);
    }
    get sampleArray() {
        switch (this.bitDepth) {
            case 32:
                return Float32Array;
            case 16:
                return Int16Array;
            case 8:
                return Uint8Array;
            default:
                return Int16Array;
        }
    }
    async _read() {
        return null;
        // return this.pump();
    }
    pump() {
        let ok = true;
        this.frameNumber++;
        const inputbuffers = this.inputs
            .filter((i) => i.isActive())
            .map((i) => i.read());
        const ninputs = inputbuffers.length;
        if (ninputs === 1) {
            this.push(new Uint8Array(inputbuffers[0]));
            return ok;
        }
        const summingbuffer = new this.sampleArray(this.blockSize);
        for (let i = 0; i < this.blockSize; i++) {
            for (let j = 0; j < ninputs; j++) {
                summingbuffer[i] += this.decoder.decode(inputbuffers[j], i) / ninputs;
            }
        }
        this.push(new Uint8Array(summingbuffer.buffer));
        return ok;
    }
    get blockSize() {
        return this.samplesPerFrame * this.sampleArray.BYTES_PER_ELEMENT;
    }
    get currentTime() {
        return this.frameNumber * this.secondsPerFrame;
    }
    get bytesPerSecond() {
        return (this.sampleRate * this.nChannels * this.sampleArray.BYTES_PER_ELEMENT);
    }
    connect(destination) {
        this.output = destination;
        this.start();
    }
    getRms() { }
    stop(second) {
        if (second === 0) {
            this.playing = false;
            this.emit("finish");
        }
        else {
            if (second)
                this.end = second;
            this.end = second;
        }
    }
}
exports.SSRContext = SSRContext;
SSRContext.defaultProps = {
    nChannels: 2,
    sampleRate: 44100,
    bitDepth: 16,
};
// playCSVmidi(ctx, resolve(__dirname, "../csv/midi.csv"));
// ctx.connect(createWriteStream("mid2.wav"));
// ctx.start();
// setInterval(() => {
//   ctx.read();
// }, 3.3);
//# sourceMappingURL=ssrctx.js.map