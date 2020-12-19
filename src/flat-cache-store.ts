/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { existsSync, readFileSync, writeFileSync } from "fs";

export class FlatCache {
  cache: Buffer;
  cacheKeys: string[];
  n: number;
  objectbyteLength: number;
  rfd: string | null;
  constructor(size: number, objectbyteLength: number, file?: string) {
    this.cache = Buffer.alloc(objectbyteLength * size);
    this.cacheKeys = Array(size).fill("");
    this.n = 0;
    this.rfd = file ? file : null;
    this.objectbyteLength = objectbyteLength;
    if (file && existsSync(file + ".cache.keys")) {
      this.cacheKeys = readFileSync(file + ".cache.keys")
        .toString()
        .split("|");
      this.cache = readFileSync(file + ".cache.pcm");
    }
  }
  set(key: string, value: Buffer) {
    this.cacheKeys[this.n] = key;
    this.cache.set(value, this.n * this.objectbyteLength);
    this.n++;
    this.reallocIfNeeded();
  }
  malloc(key: string) {
    this.cacheKeys[this.n] = key;
    const ret = this.cache.slice(
      this.n * this.objectbyteLength,
      this.n * this.objectbyteLength + this.objectbyteLength
    );
    this.n++;
    this.reallocIfNeeded();
    return ret;
  }
  reallocIfNeeded() {
    if (this.n > 0.89 * this.cacheKeys.length) {
      this.n = 0; //reset/
    }
  }
  read(key: string) {
    for (let i = 0; i < this.n; i++) {
      if (this.cacheKeys[i] === key) {
        return this.cache.slice(
          i * this.objectbyteLength,
          i * this.objectbyteLength + this.objectbyteLength
        );
      }
    }
    return null;
  }
  get length() {
    return this.n;
  }
  persist() {
    writeFileSync(this.rfd + ".cache.pcm", this.cache);
    writeFileSync(this.rfd + ".cache.keys", this.cacheKeys.join("|"));
  }
}
export function cacheStore(size: number, objectByteLength: number): FlatCache {
  return new FlatCache(size, objectByteLength);
}
