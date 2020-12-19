import { AudioDataSource } from "./audio-data-source";
import { request } from "https";
import { ReadlineTransform } from "grep-transform";
import { SSRContext } from "../ssrctx";
import { FlatCache } from "flat-cache";
import { spawn } from "child_process";
import { openSync, closeSync, readSync } from "fs";
import { EventEmitter } from "events";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

import { SharedRingBuffer } from "grep-sbr";
import { EventSource } from "src/event-source";

// const service=createServer();
// service.listen('/tmp/memcache.d');
// serviceop
const ctx = new SSRContext(SSRContext.defaultProps);
const cache4 = new FlatCache(200, 0.25 * ctx.bytesPerSecond);

const cache2 = new FlatCache(30, 0.5 * ctx.bytesPerSecond);
const workerPool = [];
type seconds = number;

class EventSequenceSource extends AudioDataSource {
  srb: SharedRingBuffer;
  pendingWrites: number = 0;
  time: seconds;
  ticks: number;
  worker: Worker;
  bpm: number = 120;
  constructor(ctx: SSRContext, url) {
    super(ctx);

    this.srb = new SharedRingBuffer(this.ctx.bytesPerSecond * 5.2);
    const emit = new EventSource(ctx, url);
    this.worker = new Worker("./dist/audio-sources/event-sequence-source.js", {
      workerData: { sharedBuffer: this.srb.sharedBuffer },
    });
    this.worker.on("message", (wrote) => {
      this.pendingWrites--;
      //      console.log("pending write" + this.pendingWrites);
    });
    emit.on("#tempo", (data) => {
      this.bpm = data.bpm;
    });
    emit.on("note", (data) => {
      const path =
        "midisf/" +
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
  read(): Buffer | null {
    //   if (this.srb.wPtr - this.srb.readPtr < this.ctx.blockSize / 4) return null;
    const ret = this.srb.sharedBuffer.slice(
      this.srb.readPtr,
      this.srb.readPtr + this.ctx.blockSize
    );
    this.srb.readPtr += this.ctx.blockSize;
    return Buffer.from(ret);
    //this.sbr.readToBuffer()
  }
}

if (isMainThread) {
  const evt = new EventSequenceSource(ctx, "https://www.grepawk.com/bach/rt");
  ///ctx.inputs.push(evt);
  ctx.pipe(process.stdout);
  ctx.pipe(
    spawn("ffplay", "-i pipe:0 -f f32le -ac 1 -ar 48000".split(" ")).stdin
  );
  ctx.start();
} else {
  const u32intarr = new Uint32Array(workerData.sharedBuffer);
  const writePartial = (wptr, bufferFromFile: Buffer) => {
    let index = 0;
    while (index * 4 < bufferFromFile.byteLength - 4) {
      const dvv = new DataView(bufferFromFile.buffer);
      Atomics.add(u32intarr, wptr + index, dvv.getUint32(index * 4, true) / 5);
      index++;
      if (wptr + index >= u32intarr.length) {
        wptr = -1 * index;
      }
    }
    return index;
  };
  parentPort.on("message", (d) => {
    const { path, wptr, duration, velocity, retry } = d;
    const ticks = parseInt(duration);
    let cache = ticks < 0.25 ? cache4 : ticks < 0.5 ? cache2 : null;
    const ob = loadBuffer(path, cache, duration * ctx.bytesPerSecond);
    const dat = ob.slice(0, duration * ctx.bytesPerSecond);
    const n_wrote = writePartial(wptr, dat);
    parentPort.postMessage(n_wrote);
  });
}
export function loadBuffer(file: string, noteCache: FlatCache, bytes: number) {
  let ob;
  if (noteCache) {
    const cacheKey = file;
    if (
      noteCache &&
      noteCache.cacheKeys.includes(file) &&
      noteCache.read(file) !== null
    ) {
      //  console.log("cache hitt");
      return noteCache.read(file);
    }
    //console.log("cache miss " + cacheKey + "cache size ");
    ob = noteCache.malloc(file);
  } else {
    ob = Buffer.alloc(bytes);
  }
  const fd = openSync(file, "r");
  readSync(fd, ob, 0, ob.byteLength, 0);
  closeSync(fd);
  return ob;
}
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
