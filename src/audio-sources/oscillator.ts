import { SSRContext } from "../ssrctx";
import { AudioDataSource, AudioDataSourceOptions } from "./audio-data-source";
export interface OscillatorProps extends AudioDataSourceOptions {
  frequency: number;
}
export class Oscillator extends AudioDataSource {
  frequency: any;

  constructor(ctx: SSRContext, opts: OscillatorProps) {
    super(ctx, opts);
    this.frequency = opts.frequency;
  }

  read(): Buffer {
    const twopie = 3.1415;
    const frames = Buffer.allocUnsafe(this.ctx.blockSize);

    const phase = (this.ctx.currentTime / this.frequency) * twopie;
    const cyclePerSample = (3.14 * 2 * this.frequency) / this.ctx.sampleRate;
    for (let i = 0; i < 128; i++) {
      const idx = ~~(i / this.ctx.nChannels);
      this.ctx.encode(frames, Math.sin(phase + cyclePerSample * idx) * 0.2, i);
    }
    this.emit("data", frames);
    return frames;
  }
  _read(n) {
    this.push(this.read());
  }
}
