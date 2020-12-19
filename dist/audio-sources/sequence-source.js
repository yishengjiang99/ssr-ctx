"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const audio_data_source_1 = require("./audio-data-source");
const events_1 = require("events");
const https_1 = require("https");
const grep_transform_1 = require("grep-transform");
class EventSource extends events_1.EventEmitter {
    constructor(src) {
        super();
        https_1.request(src, (res) => {
            res.pipe(new grep_transform_1.ReadlineTransform("\n\n")).on("data", (d) => {
                let m = d.toString().match(/event\:(\w+)\\ndata:(.*?)/);
                if (m)
                    this.emit(m[1], m[2]);
            });
        });
    }
}
class EventSequenceSource extends audio_data_source_1.AudioDataSource {
    constructor(ctx, emitter) {
        super(ctx);
        emitter.on("note", (d) => { });
    }
}
//# sourceMappingURL=sequence-source.js.map