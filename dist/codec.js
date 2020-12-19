"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decoder = exports.Encoder = void 0;
class Encoder {
    constructor(bitDepth) {
        this.bitDepth = bitDepth;
    }
    encode(buffer, value, index) {
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
exports.Encoder = Encoder;
class Decoder {
    constructor(bitDepth) {
        this.bitDepth = bitDepth;
    }
    decode(buffer, index) {
        try {
            if (!buffer)
                return null;
            const dv = new DataView(buffer.buffer);
            switch (this.bitDepth) {
                case 32:
                    return dv.getFloat32(index * 4, true);
                case 16:
                    return dv.getInt16(index * 2, true);
                case 8:
                    return dv.getUint8(index * 2);
                default:
                    throw new Error("unsupported bitdepth");
            }
        }
        finally {
            return null;
        }
    }
}
exports.Decoder = Decoder;
//# sourceMappingURL=codec.js.map