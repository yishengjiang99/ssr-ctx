/* eslint-disable @typescript-eslint/no-explicit-any */
export class Encoder {
  bitDepth: number;
  constructor(bitDepth: number) {
    this.bitDepth = bitDepth;
  }
  encode(buffer: Buffer, value: number, index: number): void {
    const dv = new DataView(buffer.buffer);
    switch (this.bitDepth) {
      case 32:
        dv.setFloat32(index * 4, value, true);
        break;
      case 16:
        value = Math.min(Math.max(-1, value), 1);
        value < 0
          ? dv.setInt16(index * 2, value * 0x8000, true)
          : dv.setInt16(index * 2, value * 0x7fff, true);
        break;
      case 8:
        buffer.writeUInt8(value, index * Uint8Array.BYTES_PER_ELEMENT);
        break;
      default:
        throw new Error("unsupported bitdepth");
    }
  }
}
export class Decoder {
  bitDepth: number;
  constructor(bitDepth: number) {
    this.bitDepth = bitDepth;
  }
  decode(buffer: Buffer | null, index: number): number {
    if (typeof buffer === null) return 0;
    try {
      if (!buffer) return 0;
      const dv = new DataView(buffer.buffer);
      switch (this.bitDepth) {
        case 32:
          return dv.getFloat32(index * 4, true);
        case 16:
          return dv.getInt16(index * 2, true);
        case 8:
          return dv.getUint8(index * 2);
        default:
          return dv.getInt16(index * 2, true);
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  }
}
