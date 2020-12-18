import { AudioDataSource } from "./audio-data-source";
import { EventEmitter } from "events";
import { request } from "https";
import { ReadlineTransform } from "grep-transform";

class EventSource extends EventEmitter {
  constructor(src: string) {
    super();
    request(src, (res) => {
      res.pipe(new ReadlineTransform("\n\n"));
    });
  }
}
class EventSequenceSource extends AudioDataSource {}
