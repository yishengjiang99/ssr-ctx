import { AudioDataSource } from "./audio-data-source";
import { EventEmitter } from "events";
import { request } from "https";
import { ReadlineTransform } from "grep-transform";
import { SSRContext } from "src/ssrctx";

class EventSource extends EventEmitter {
  constructor(src: string) {
    super();
    request(src, (res) => {
      res.pipe(new ReadlineTransform("\n\n")).on("data", (d) => {
        let m = d.toString().match(/event\:(\w+)\\ndata:(.*?)/);
        if (m) this.emit(m[1], m[2]);
      });
    });
  }
}
class EventSequenceSource extends AudioDataSource {
  constructor(ctx: SSRContext, emitter: EventEmitter) {
    super(ctx);
    emitter.on("note", (d) => {});
  }
}
