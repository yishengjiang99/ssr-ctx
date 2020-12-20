/// <reference types="node" />
export declare class FlatCache {
    cache: Buffer;
    cacheKeys: string[];
    n: number;
    objectbyteLength: number;
    rfd: string | null;
    constructor(size: number, objectbyteLength: number, file?: string);
    set(key: string, value: Buffer): void;
    malloc(key: string): Buffer;
    reallocIfNeeded(): void;
    read(key: string): Buffer;
    get length(): number;
    persist(): void;
}
export declare function cacheStore(size: number, objectByteLength: number): FlatCache;