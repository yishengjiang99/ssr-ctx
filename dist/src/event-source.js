import { EventEmitter } from "events";
import { spawn } from "child_process";
import { ReadlineTransform } from "grep-transform";
export class EventSource extends EventEmitter {
    constructor(src) {
        super();
        this.proc = spawn("curl", ["-s", src, "-o", "-"]);
        const { stdout, stderr } = this.proc;
        stderr.on("data", (d) => console.error(d.toString()));
        stdout.pipe(new ReadlineTransform("\n\n")).on("data", (d) => {
            const match = d.toString().match(/event: (\S+)\ndata: (\S+)$/);
            if (match === null)
                console.error(d.toString());
            else
                this.emit(match[1], JSON.parse(match[2]));
        });
    }
    close() {
        this.proc.kill(9);
    }
}
//# sourceMappingURL=event-source.js.map