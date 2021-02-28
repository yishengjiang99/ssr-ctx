import { presetEnvelops } from "./preset-adsr";

export type Second_ = number;
export type percent_ = number;
export class Envelope {
  private _multi: number;
  private _index: Second_;
  adsr: [Second_, Second_, percent_, Second_];
  attackRate: number;
  linearDecay: number;
  tau: Second_;
  deltas: number[];
  parts: number[];
  phases: number[];
  static fromPreset = (presetId: number): Envelope => {
    const [a, h, d, s, r] = presetEnvelops[presetId];
    return new Envelope(48000, [a, s, d, r]);
  };

  constructor(
    sampleRate: number,
    [a, d, s, r]: [Second_, Second_, percent_, Second_]
  ) {
    a = Math.max(1 / sampleRate, a);
    d = Math.max(1 / sampleRate, d);
    this._multi = 0;
    this._index = 0;
    this.adsr = [a, d, s, r];
    this.tau = r;
    this.phases = [
      a * sampleRate,
      (a + d) * sampleRate,
      sampleRate * (a + d + r),
    ];
    this.deltas = [
      1 / a / sampleRate,
      (s - 1) / d / sampleRate,
      -s / 2 / r / sampleRate,
      -s / 2 / (3 * r) / sampleRate,
    ];
  }
  velocityModulate(velocity: number): Envelope {
    this.adsr[0] = (145 - velocity) / 144;
    return this;
  }
  shift(): number {
    let delta;
    if (this._index < this.phases[0]) {
      delta = this.deltas[0];
    } else if (this._index < this.phases[1]) {
      delta = this.deltas[1];
    } else if (this._index < this.phases[2]) {
      delta = this.deltas[2];
    } else {
      delta = this.deltas[3];
    }

    this._multi += delta;
    this._index++;

    if (this._multi < 0) {
      return 0;
    }
    return this._multi;
  }
}
