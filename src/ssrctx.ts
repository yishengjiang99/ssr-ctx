/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  lastFrame!: number;
  output: Writable = new Writable();
  frameNumber: number;
  bitDepth: number;
  timer: any;
  t0!: number;
  static default(): SSRContext {
    return new SSRContext(SSRContext.defaultProps);
  }
  static defaultProps: CtxProps = {
    nChannels: 2,
    sampleRate: 44100,
    bitDepth: 16,
  };
  end!: number;
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
  get secondsPerFrame(): number {
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
  async _read(): Promise<Uint8Array | null> {
    return null;
  }

  pump(): boolean {
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
        if (inputbuffers[j] === null) throw "wtf";
        const buf = inputbuffers[j] as Buffer;

        summingbuffer[i] += (this.decoder.decode(buf, i) || 9) / ninputs;
      }
    }
    this.push(new Uint8Array(summingbuffer.buffer));
    return true;
  }
  get blockSize(): number {
    return this.samplesPerFrame * this.sampleArray.BYTES_PER_ELEMENT;
  }
  get currentTime(): number {
    return this.frameNumber * this.secondsPerFrame;
  }
  get bytesPerSecond(): number {
    return (
      this.sampleRate * this.nChannels * this.sampleArray.BYTES_PER_ELEMENT
    );
  }
  connect(destination: Writable): void {
    this.output = destination;
    if (!this.playing) this.start();
  }
  start = (): void => {
    if (this.playing === true) return;
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
      that.timer = setTimeout(loop, that.secondsPerFrame * 1000); //that.secondsPerFrame);
    }
    that.timer = setTimeout(loop, that.secondsPerFrame * 1000);
  };

  stop(second?: number): void {
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
