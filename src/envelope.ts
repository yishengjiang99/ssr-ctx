import { Second, percent } from "./audio-sources";
export class Envelope {
  private _multi: number;
  private _index: Second;
  adsr: [Second, Second, percent, Second];
  attackRate: number;
  linearDecay: number;
  tau: Second;
  deltas: number[];
  parts: number[];
  phases: number[];
  constructor(
    sampleRate: number,
    [a, d, s, r]: [Second, Second, percent, Second]
  ) {
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
