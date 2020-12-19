"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBuffer = exports.EventSource = void 0;
const audio_data_source_1 = require("./audio-sources/audio-data-source");
const https_1 = require("https");
const grep_transform_1 = require("grep-transform");
const ssrctx_1 = require("./ssrctx");
const flat_cache_1 = require("flat-cache");
const fs_1 = require("fs");
const worker_threads_1 = require("worker_threads");
const grep_sbr_1 = require("grep-sbr");
// const service=createServer();
// service.listen('/tmp/memcache.d');
// serviceop
const ctx = new ssrctx_1.SSRContext(ssrctx_1.SSRContext.defaultProps);
const sharedArrayBuffer = new grep_sbr_1.SharedRingBuffer(ctx.bytesPerSecond);
const cache4 = new flat_cache_1.FlatCache(200, 0.25 * ctx.bytesPerSecond);
const cache2 = new flat_cache_1.FlatCache(30, 0.5 * ctx.bytesPerSecond);
const workerPool = [];
class EventSource extends audio_data_source_1.AudioDataSource {
    constructor(ctx, src) {
        super(ctx);
        this.pendingWrites = 0;
        debugger;
        this.tempo = {
            bpm: 60,
            beatLengthMs: 1000,
            ticksPerbeat: 256,
        };
        this.srb = new grep_sbr_1.SharedRingBuffer(1024 * 24);
        https_1.request(src, this.handleMsg.bind(this));
    }
    handleMsg(res) {
        console.log(res);
        res.pipe(new grep_transform_1.ReadlineTransform("\n\n")).on("data", (d) => {
            console.log(d);
            const match = d.toString().match(/event: (\w+)\n\ndata: \(S+)/);
            if (!match)
                return;
            let data = JSON.parse(match[2]);
            switch (match[1]) {
                case "#tempo":
                    this.tempo = data;
                    break;
                case "#time":
                    const [second, ticks, measure] = data;
                    this.time = second;
                    break;
                case "note":
                    const path = "midisf/" + data.instrument + "/" + (data.midi - 21) + ".pcm";
                    const duration = parseInt(data.duration.ticks);
                    const velocity = parseInt(data.velocity);
                    const worker = !workerPool.length
                        ? new worker_threads_1.Worker("./dist/event-source.js", {
                            workerData: { sharedBuffer: this.srb },
                        })
                        : workerPool.shift();
                    this.pendingWrites++;
                    worker.on("message", (d) => {
                        console.log("write", d.wrote);
                        workerPool.push(d);
                        this.pendingWrites--;
                    });
                    worker.on("error", (e) => {
                        process.stdin.write(d + " -");
                    });
                    worker.postMessage({
                        path,
                        wptr: this.srb.wPtr,
                        duration,
                        velocity,
                    });
                    break;
            }
        });
    }
    read() {
        if (this.srb.wPtr - this.srb.readPtr < this.ctx.blockSize / 4)
            return null;
        return this.srb.readBytes(this.ctx.blockSize);
        //this.sbr.readToBuffer()
    }
}
exports.EventSource = EventSource;
if (worker_threads_1.isMainThread) {
    const ctx = new ssrctx_1.SSRContext({
        bitDepth: 32,
        nChannels: 1,
        sampleRate: 48000,
    });
    const evt = new EventSource(ctx, "https://www.grepawk.com/bach/rt");
    ctx.connect(process.stdout);
    ctx.start();
}
else {
    worker_threads_1.parentPort.on("message", (d) => {
        const [path, wptr, duration, velocity, retry] = d;
        const ticks = parseInt(duration);
        let cache = ticks < 260 ? cache4 : ticks < 600 ? cache2 : null;
        const ob = loadBuffer(path, cache);
        const n_wrote = worker_threads_1.workerData.sharedBuffer.writePartial(wptr, ob);
        worker_threads_1.parentPort.postMessage(n_wrote);
    });
}
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
//# sourceMappingURL=event-source.js.map