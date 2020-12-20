/// <reference types="node" />
export declare class Encoder {
    bitDepth: number;
    constructor(bitDepth: number);
    encode(buffer: Buffer, value: number, index: number): void;
}
export declare class Decoder {
    bitDepth: number;
    constructor(bitDepth: number);
    decode(buffer: Buffer | null, index: number): number;
}
