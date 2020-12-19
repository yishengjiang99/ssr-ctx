"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheStore = exports.cacheStore = exports.FlatCache = void 0;
var fs_1 = require("fs");
var FlatCache = /** @class */ (function () {
    function FlatCache(size, objectbyteLength, file) {
        this.cache = Buffer.alloc(objectbyteLength * size);
        this.cacheKeys = Array(size).fill("");
        this.n = 0;
        this.rfd = file;
        this.objectbyteLength = objectbyteLength;
        if (file && fs_1.existsSync(file + ".cache.keys")) {
            this.cacheKeys = fs_1.readFileSync(file + ".cache.keys")
                .toString()
                .split("|");
            this.cache = fs_1.readFileSync(file + ".cache.pcm");
        }
    }
    FlatCache.prototype.set = function (key, value) {
        this.cacheKeys[this.n] = key;
        this.cache.set(value, this.n * this.objectbyteLength);
        this.n++;
        this.reallocIfNeeded();
    };
    FlatCache.prototype.malloc = function (key) {
        this.cacheKeys[this.n] = key;
        var ret = this.cache.slice(this.n * this.objectbyteLength, this.n * this.objectbyteLength + this.objectbyteLength);
        this.n++;
        this.reallocIfNeeded();
        return ret;
    };
    FlatCache.prototype.reallocIfNeeded = function () {
        if (this.n > 0.89 * this.cacheKeys.length) {
            this.n = 0; //reset/
            // const newbuf = Buffer.alloc(this.cache.byteLength * 2);
            // newbuf.set(this.cache, 0);
            // this.cache = newbuf;
        }
    };
    FlatCache.prototype.read = function (key) {
        for (var i = 0; i < this.n; i++) {
            if (this.cacheKeys[i] === key) {
                return this.cache.slice(i * this.objectbyteLength, i * this.objectbyteLength + this.objectbyteLength);
            }
        }
        return null;
    };
    Object.defineProperty(FlatCache.prototype, "length", {
        get: function () {
            return this.n;
        },
        enumerable: false,
        configurable: true
    });
    FlatCache.prototype.persist = function () {
        fs_1.writeFileSync(this.rfd + ".cache.pcm", this.cache);
        fs_1.writeFileSync(this.rfd + ".cache.keys", this.cacheKeys.join("|"));
    };
    return FlatCache;
}());
exports.FlatCache = FlatCache;
function cacheStore(size, objectByteLength) {
    return new FlatCache(size, objectByteLength);
}
exports.cacheStore = cacheStore;
exports.CacheStore = FlatCache;
