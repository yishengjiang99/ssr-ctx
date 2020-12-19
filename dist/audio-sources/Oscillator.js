"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oscillator = void 0;
const audio_data_source_1 = require("./audio-data-source");
class Oscillator extends audio_data_source_1.AudioDataSource {
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
exports.Oscillator = Oscillator;
//# sourceMappingURL=Oscillator.js.map
