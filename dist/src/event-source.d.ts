/// <reference types="node" />
import { EventEmitter } from "events";
import { ChildProcess } from "child_process";
export declare class EventSource extends EventEmitter {
    proc: ChildProcess;
    constructor(src: string);
    close(): void;
}
//# sourceMappingURL=event-source.d.ts.map