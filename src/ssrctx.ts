/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Readable, Writable } from "stream";
import { AudioDataSource } from "./audio-sources/audio-data-source";

import { Decoder, Encoder } from "./codec";
import { compression } from "./dynamicCompression";
import { MixTransform } from "./mix-transform";
export interface CtxProps {
  nChannels?: number;
  sampleRate?: number;
  fps?: number;
  bitDepth?: number;
}

//#endregion
export class SSRContext extends Readable {
  activeInputs = 0;
  encoder: Encoder;
  nChannels: number;
  playing: boolean;
  sampleRate: number;
  fps: number;
  output: Writable = new Writable();
  frameNumber: number;
  bitDepth: number;
  timer: any;
  aggregate: MixTransform;
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
    { nChannels, sampleRate, bitDepth, fps }: CtxProps = SSRContext.defaultProps
  ) {
    super();

    this.nChannels = nChannels || 2;
    this.sampleRate = sampleRate || 44100;
    this.fps = fps || this.sampleRate / 128;
    this.frameNumber = 0;
    this.bitDepth = bitDepth || 32;
    this.encoder = new Encoder(this.bitDepth);
    this.decoder = new Decoder(this.bitDepth);
    this.playing = false;
    this.aggregate = new MixTransform(this);
  }
  get secondsPerFrame(): number {
    return 1 / this.fps;
  }
  get samplesPerFrame() {
    return (this.sampleRate * this.nChannels) / this.fps;
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
    const summingbuffer = new DataView(
      new this.sampleArray(this.samplesPerFrame * 2).buffer
    );

    const inputviews = this.inputs.map(
      (i) => new DataView(i.read(this.blockSize).buffer)
    );

    //    const inputs =
    for (let k = 0; k < summingbuffer.byteLength / 2; k += 4) {
      let sum = 0;
      for (let j = inputviews.length - 1; j >= 0; j--) {
        if (sum > 0.6) sum += 0.4 * inputviews[j].getFloat32(k, true);
        else sum += inputviews[j].getFloat32(k, true);
      }

      summingbuffer.setFloat32(2 * k, compression(sum), true);

      summingbuffer.setFloat32(2 * k + 4, compression(sum), true);
    }

    this.emit("data", new Uint8Array(summingbuffer.buffer));
    this.frameNumber++;
    this.inputs = this.inputs.filter((i) => i.isActive());
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
    this.pipe(destination);
  }
  start = (): void => {
    if (this.playing === true) return;
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
