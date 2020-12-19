import { Readable } from "stream";
import { Decoder, Encoder } from "./codec";
//#endregion
export class SSRContext extends Readable {
    constructor({ nChannels, sampleRate, bitDepth } = SSRContext.defaultProps) {
        super();
        this.inputs = [];
        this.start = () => {
            if (this.playing === true)
                return;
            this.playing = true;
            this.t0 = process.uptime();
            let that = this;
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
            that.timer = setTimeout(loop, that.secondsPerFrame * 1000);
        };
        this.nChannels = nChannels;
        this.sampleRate = sampleRate;
        this.fps = this.sampleRate / 128;
        this.frameNumber = 0;
        this.bitDepth = bitDepth;
        this.encoder = new Encoder(this.bitDepth);
        this.decoder = new Decoder(this.bitDepth);
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
        if (!this.playing)
            this.start();
    }
    getRms() { }
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