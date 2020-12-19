/// <reference types="node" />
export declare class Encoder {
    bitDepth: number;
    constructor(bitDepth: number);
    encode(buffer: Buffer, value: number, index: number): void;
}
export declare class Decoder {
    bitDepth: any;
    constructor(bitDepth: number);
    decode(buffer: Buffer | null, index: number): number | null;
}
//# sourceMappingURL=codec.d.ts.map