"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSource = void 0;
const events_1 = require("events");
const child_process_1 = require("child_process");
const grep_transform_1 = require("grep-transform");
class EventSource extends events_1.EventEmitter {
    constructor(src) {
        super();
        this.proc = child_process_1.spawn("curl", ["-s", src, "-o", "-"]);
        const { stdout, stderr } = this.proc;
        stderr.on("data", (d) => console.error(d.toString()));
        stdout.pipe(new grep_transform_1.ReadlineTransform("\n\n")).on("data", (d) => {
            console.log("--------", d.toString(), "------");
            const match = d.toString().match(/event: (\S+)\ndata: (\S+)/);
            if (match === null) {
                console.log("xxxxxxx", console.error(d.toString()));
            }
            else
                this.emit(match[1], JSON.parse(match[2]));
        });
    }
    close() {
        this.proc.kill(9);
    }
}
exports.EventSource = EventSource;
//# sourceMappingURL=event-source.js.map