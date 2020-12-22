"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSRContext = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
const stream_1 = require("stream");
const codec_1 = require("./codec");
const mix_transform_1 = require("./mix-transform");
//#endregion
class SSRContext extends stream_1.Readable {
    constructor({ nChannels, sampleRate, bitDepth, fps } = SSRContext.defaultProps) {
        super();
        this.activeInputs = 0;
        this.output = new stream_1.Writable();
        this.inputs = [];
        this.start = () => {
            if (this.playing === true)
                return;
            this.playing = true;
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
                that.timer = setTimeout(loop, that.secondsPerFrame * 1000); //that.secondsPerFrame);
            }
            loop();
        };
        this.nChannels = nChannels || 2;
        this.sampleRate = sampleRate || 44100;
        this.fps = fps || this.sampleRate / 128;
        this.frameNumber = 0;
        this.bitDepth = bitDepth || 32;
        this.encoder = new codec_1.Encoder(this.bitDepth);
        this.decoder = new codec_1.Decoder(this.bitDepth);
        this.playing = false;
        this.aggregate = new mix_transform_1.MixTransform(this);
    }
    static default() {
        return new SSRContext(SSRContext.defaultProps);
    }
    get secondsPerFrame() {
        return 1 / this.fps;
    }
    get samplesPerFrame() {
        return (this.sampleRate * this.nChannels) / this.fps;
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
        const summingbuffer = new DataView(new this.sampleArray(this.samplesPerFrame * 2).buffer);
        const inputviews = this.inputs.map((i) => new DataView(i.read(this.blockSize).buffer));
        //    const inputs =
        for (let k = 0; k < summingbuffer.byteLength / 2; k += 4) {
            let sum = 0;
            //    console.log(summingbuffer.byteLength);
            for (let j = 0; j < inputviews.length; j++) {
                sum += inputviews[j].getFloat32(k, true) / inputviews.length;
            }
            if (sum > 0.8)
                console.log(sum);
            if (sum > 0.8)
                sum = 0.8 + (sum - 0.8) / 20;
            if (sum > 0.9)
                sum = 0.9 + (sum - 0.9) / 40;
            if (sum > 0.99999)
                sum = 0.99999;
            // process.exit();
            summingbuffer.setFloat32(2 * k, sum, true);
            summingbuffer.setFloat32(2 * k + 4, sum, true);
        }
        this.emit("data", new Uint8Array(summingbuffer.buffer));
        this.frameNumber++;
        this.inputs = this.inputs.filter((i) => i.isActive());
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
        this.pipe(destination);
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
// playCSVmidi(ctx, resolve(__dirname, "../csv/midi.csv"));
// ctx.connect(createWriteStream("mid2.wav"));
// ctx.start();
// setInterval(() => {
//   ctx.read();
// }, 3.3);
// const ctx = SSRContext.default();
// ctx.start();
// process.stdout.write(ctx.frameNumber + "");
// process.stdout.write(ctx.frameNumber + "");
// setTimeout(() => {
//   // ctx.stop();
//   // ctx.start();
//   setTimeout(() => {
//     ctx.stop();
//     // const ct2 = SSRContext.default();
//     // ct2.start();
//     console.log(ctx.currentTime);
//     // ct2.stop(0.1);
//   }, 1300);
// }, 200);
//# sourceMappingURL=ssrctx.js.map