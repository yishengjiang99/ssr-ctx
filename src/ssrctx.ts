import { Readable, Writable } from "stream";
import { AudioDataSource } from "./audio-sources/audio-data-source";

import { Decoder, Encoder } from "./codec";
export interface CtxProps {
  nChannels?: number;
  sampleRate?: number;
  fps?: number;
  bitDepth?: number;
}

//#endregion
export class SSRContext extends Readable {
  encoder: Encoder;
  nChannels: number;
  playing: boolean;
  sampleRate: number;
  fps: number;
  lastFrame: number;
  output: Writable;
  frameNumber: number;
  bitDepth: number;
  timer: any;
  t0: number;
  static default(): SSRContext {
    return new SSRContext(SSRContext.defaultProps);
  }
  static defaultProps: CtxProps = {
    nChannels: 2,
    sampleRate: 44100,
    bitDepth: 16,
  };
  end: number;
  decoder: Decoder;
  inputs: AudioDataSource[] = [];

  constructor(
    { nChannels, sampleRate, bitDepth }: CtxProps = SSRContext.defaultProps
  ) {
    super();

    this.nChannels = nChannels!;
    this.sampleRate = sampleRate!;
    this.fps = this.sampleRate / 128;
    this.frameNumber = 0;
    this.bitDepth = bitDepth!;
    this.encoder = new Encoder(this.bitDepth);
    this.decoder = new Decoder(this.bitDepth);
    this.playing = false;
  }
  get secondsPerFrame() {
    return 1 / this.fps;
  }
  get samplesPerFrame() {
    return 128;
  }

  encode(buffer: Buffer, value: number, index: number): void {
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
  async _read(): Promise<Uint8Array> | null {
    return null;

    // return this.pump();
  }

  pump(): boolean {
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
    return (
      this.sampleRate * this.nChannels * this.sampleArray.BYTES_PER_ELEMENT
    );
  }
  connect(destination: Writable) {
    this.output = destination;
    if (!this.playing) this.start();
  }
  start = () => {
    if (this.playing === true) return;
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
  getRms() {}

  stop(second?: number) {
    if (second === 0 || !second) {
      clearTimeout(this.timer);
      this.playing = false;
      this.emit("finish");
    } else {
      if (second) this.end = second;
      this.end = second!;
    }
  }
}

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
