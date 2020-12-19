import { AudioDataSource } from "./audio-data-source";
export class Oscillator extends AudioDataSource {
    constructor(ctx, opts) {
        super(ctx, opts);
        this.frequency = opts.frequency;
    }
    read() {
        const twopie = 3.1415;
        const frames = Buffer.allocUnsafe(this.ctx.blockSize);
        const phase = (this.ctx.currentTime / this.frequency) * twopie;
        const cyclePerSample = (3.14 * 2 * this.frequency) / this.ctx.sampleRate;
        for (let i = 0; i < 128; i++) {
            const idx = ~~(i / this.ctx.nChannels);
            this.ctx.encode(frames, Math.sin(phase + cyclePerSample * idx) * 0.2, i);
        }
        return frames;
    }
}
//# sourceMappingURL=Oscillator.js.map