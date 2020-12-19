"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBuffer = void 0;
const ssrctx_1 = require("./ssrctx");
const flat_cache_1 = require("flat-cache");
const worker_threads_1 = require("worker_threads");
const fs_1 = require("fs");
const sbr_1 = require("sbr");
// const service=createServer();
// service.listen('/tmp/memcache.d');
// serviceop
const ctx = new ssrctx_1.SSRContext(ssrctx_1.SSRContext.defaultProps);
const sharedArrayBuffer = new sbr_1.SharedRingBuffer(ctx.bytesPerSecond);
const cache4 = new flat_cache_1.FlatCache(200, 0.25 * ctx.bytesPerSecond);
const cache2 = new flat_cache_1.FlatCache(30, 0.5 * ctx.bytesPerSecond);
const workerPool = [];
if (worker_threads_1.isMainThread) {
    process.stdin.on("data", (d) => {
        const worker = !workerPool.length
            ? new worker_threads_1.Worker("./dist/memcached.js")
            : workerPool.shift();
        worker.on("message", (d) => {
            workerPool.push(d);
        });
        worker.on("error", (e) => {
            process.stdin.write(d + " -");
        });
        worker.postMessage(d + "|");
    });
}
else {
    //in worker context
    console.log(cache2);
    console.log(sharedArrayBuffer);
    worker_threads_1.parentPort.on("message", (d) => {
        const [filename, duration, velocity, retry] = d.toString().split("|");
        const ticks = parseInt(duration);
        let cache = ticks < 260 ? cache4 : ticks < 600 ? cache2 : null;
        loadBuffer(filename, cache);
    });
}
process.stdin.on("data", (d) => { });
function loadBuffer(file, noteCache) {
    let ob;
    if (noteCache) {
        const cacheKey = file;
        if (noteCache &&
            noteCache.cacheKeys.includes(file) &&
            noteCache.read(file) !== null) {
            console.log("cache hitt");
            return noteCache.read(file);
        }
        console.log("cache miss " + cacheKey + "cache size ");
        ob = noteCache.malloc(file);
    }
    else {
        ob = Buffer.alloc(ctx.bytesPerSecond * 2);
    }
    const fd = fs_1.openSync(file, "r");
    fs_1.readSync(fd, ob, 0, ob.byteLength, 0);
    fs_1.closeSync(fd);
    return ob;
}
exports.loadBuffer = loadBuffer;
process.stdin.on("done", () => {
    process.exit(0);
});
//# sourceMappingURL=memcached.js.map