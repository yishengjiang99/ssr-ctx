"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBuffer = exports.EventSource = void 0;
const audio_data_source_1 = require("./audio-data-source");
const grep_transform_1 = require("grep-transform");
const ssrctx_1 = require("../ssrctx");
const flat_cache_1 = require("flat-cache");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const events_1 = require("events");
const worker_threads_1 = require("worker_threads");
const grep_sbr_1 = require("grep-sbr");
// const service=createServer();
// service.listen('/tmp/memcache.d');
// serviceop
const ctx = new ssrctx_1.SSRContext(ssrctx_1.SSRContext.defaultProps);
const cache4 = new flat_cache_1.FlatCache(200, 0.25 * ctx.bytesPerSecond);
const cache2 = new flat_cache_1.FlatCache(30, 0.5 * ctx.bytesPerSecond);
const workerPool = [];
class EventSource extends events_1.EventEmitter {
    constructor(ctx, src) {
        super();
        const { stdin, stdout, stderr } = child_process_1.spawn("curl", ["-s", src, "-o", "-"]);
        stderr.on("data", (d) => console.error(d.toString()));
        stdout.pipe(new grep_transform_1.ReadlineTransform("\n\n")).on("data", (d) => {
            const match = d.toString().match(/event: (\S+)\ndata: (\S+)$/);
            if (match === null)
                console.error(d.toString());
            else
                this.emit(match[1], JSON.parse(match[2]));
        });
    }
}
exports.EventSource = EventSource;
class EventSequenceSource extends audio_data_source_1.AudioDataSource {
    constructor(ctx, url) {
        super(ctx);
        this.pendingWrites = 0;
        this.bpm = 120;
        this.srb = new grep_sbr_1.SharedRingBuffer(this.ctx.bytesPerSecond * 5.2);
        const emit = new EventSource(ctx, url);
        this.worker = new worker_threads_1.Worker("./dist/audio-sources/event-sequence-source.js", {
            workerData: { sharedBuffer: this.srb.sharedBuffer },
        });
        this.worker.on("message", (wrote) => {
            console.log(wrote);
            this.pendingWrites--;
            console.log("pending write" + this.pendingWrites);
        });
        emit.on("#tempo", (data) => {
            this.bpm = data.bpm;
        });
        emit.on("note", (data) => {
            const path = "midisf/" +
                data.instrument +
                "/48000-mono-f32le-" +
                (data.midi - 21) +
                ".pcm";
            const duration = (parseInt(data.durationTicks) * 60) / this.bpm / 256;
            const velocity = parseInt(data.velicity);
            const wptr = ((parseFloat(data.start) % 5.0) * ctx.bytesPerSecond) / 4;
            this.worker.postMessage({
                duration,
                path,
                velocity,
                wptr: wptr,
            });
            this.pendingWrites++;
        });
    }
    read() {
        console.log(this.srb);
        //   if (this.srb.wPtr - this.srb.readPtr < this.ctx.blockSize / 4) return null;
        return this.srb.readBytes(this.ctx.blockSize);
        //this.sbr.readToBuffer()
    }
}
if (worker_threads_1.isMainThread) {
    const evt = new EventSequenceSource(ctx, "https://www.grepawk.com/bach/rt");
    ///ctx.inputs.push(evt);
    ctx.pipe(process.stdout);
    ctx.start();
}
else {
    console.log(" in worker ");
    const u32intarr = new Uint32Array(worker_threads_1.workerData.sharedBuffer);
    const writePartial = (wptr, bufferFromFile) => {
        let index = 0;
        while (index * 4 < bufferFromFile.byteLength - 4) {
            console.log(index, wptr);
            const dvv = new DataView(bufferFromFile.buffer);
            console.log(wptr, index, dvv.byteLength);
            Atomics.add(u32intarr, wptr + index, dvv.getUint32(index * 4, true));
            index++;
            if (wptr + index >= u32intarr.length) {
                wptr = -1 * index;
            }
        }
        return index;
    };
    worker_threads_1.parentPort.on("message", (d) => {
        console.log(d);
        console.log(worker_threads_1.workerData.sharedBuffer);
        const { path, wptr, duration, velocity, retry } = d;
        const ticks = parseInt(duration);
        let cache = ticks < 0.25 ? cache4 : ticks < 0.5 ? cache2 : null;
        const ob = loadBuffer(path, cache, duration * ctx.bytesPerSecond);
        const dat = ob.slice(0, duration * ctx.bytesPerSecond);
        const n_wrote = writePartial(wptr, dat);
        worker_threads_1.parentPort.postMessage(n_wrote);
    });
}
function loadBuffer(file, noteCache, bytes) {
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
        ob = Buffer.alloc(bytes);
    }
    const fd = fs_1.openSync(file, "r");
    fs_1.readSync(fd, ob, 0, ob.byteLength, 0);
    fs_1.closeSync(fd);
    return ob;
}
exports.loadBuffer = loadBuffer;
/*
      const path =
        "midisf/" + data.instrument + "/" + (data.midi - 21) + ".pcm";
      const duration = parseFloat(data.durationTime);
      const velocity = parseInt(data.velocity);
      const start = parseFloat(data.start);
      const worker = !workerPool.length
        ? new Worker("./dist/audio-sources/event-sequence-source.js", {
            workerData: { sharedBuffer: this.srb },
          })
        : workerPool.shift();
      this.pendingWrites++;
      console.log("peneing writes", this.pendingWrites);

      worker.once("message", (d) => {
        console.log("write", d.wrote);
        workerPool.push(d);
        this.pendingWrites--;
        console.log("peneing writes", this.pendingWrites);
      });
      worker.on("error", (e) => {
        // process.stdin.write(d + " -");
      });
      worker.postMessage({
        path,
        wptr: (data.start % 5) * this.ctx.bytesPerSecond,
        duration,
        velocity,
        start,
      });
    });
  }
  read(): Buffer | null {
    if (this.srb.wPtr - this.srb.readPtr < this.ctx.blockSize / 4) return null;
    return this.srb.readBytes(this.ctx.blockSize);
    //this.sbr.readToBuffer()
  }
}

if (isMainThread) {
  const evt = new EventSequenceSource(ctx, "https://www.grepawk.com/bach/rt");
  ///ctx.inputs.push(evt);
  ctx.pipe(process.stdout);
} else {
  parentPort.on("message", (d) => {
    console.log(" in worker ");
    const [path, wptr, duration, velocity, retry] = d;
    const ticks = parseInt(duration);
    let cache = ticks < 0.25 ? cache4 : ticks < 0.5 ? cache2 : null;
    const ob = loadBuffer(path, cache);
    ob.slice(0, duration * ctx.bytesPerSecond);
    const n_wrote = workerData.sharedBuffer.writePartial(wptr, ob);
    parentPort.postMessage(n_wrote);
  });
}
*/
//# sourceMappingURL=event-sequence-source.js.map