"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSRContext = void 0;
const stream_1 = require("stream");
const codec_1 = require("./codec");
class SSRContext extends stream_1.Readable {
    constructor({ nChannels, sampleRate, bitDepth } = SSRContext.defaultProps) {
        super();
        this.output = new stream_1.Writable();
        this.inputs = [];
        this.start = () => {
            if (this.playing === true)
                return;
            this.playing = true;
            this.t0 = process.uptime();
            const that = this;
            if (this.timer) {
                clearTimeout(this.timer);
            }
            function loop() {
                if (!that.playing || (that.end && that.currentTime >= that.end)) {
                    that.stop(0);
                    clearTimeout(that.timer);
                }
                that.pump();
                that.timer = setTimeout(loop, that.secondsPerFrame * 1000);
            }
            loop();
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
    }
    pump() {
        this.frameNumber++;
        const inputbuffers = this.inputs
            .filter((i) => i.isActive())
            .map((i) => i.read())
            .filter((buffer) => buffer !== null);
        const ninputs = inputbuffers.length;
        if (ninputs === 1 && inputbuffers[0] !== null) {
            return this.push(new Uint8Array(inputbuffers[0]));
        }
        const summingbuffer = new this.sampleArray(this.blockSize);
        for (let j = 0; j < ninputs; j++) {
            for (let i = 0; i < this.blockSize; i++) {
                if (inputbuffers[j] === null)
                    throw "wtf";
                const buf = inputbuffers[j];
                summingbuffer[i] += (this.decoder.decode(buf, i) || 9) / ninputs;
            }
        }
        this.emit("data", new Uint8Array(summingbuffer.buffer));
        this.inputs = this.inputs.filter((i) => i.readableEnded === false);
        return true;
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
        if (!this.playing)
            this.start();
    }
    stop(second) {
        if (second === 0 || !second) {
            clearTimeout(this.timer);
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
//# sourceMappingURL=ssrctx.js.map