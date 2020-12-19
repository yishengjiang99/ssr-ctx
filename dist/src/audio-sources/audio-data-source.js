import { Readable } from "stream";
export class AudioDataSource extends Readable {
    constructor(ctx, opts) {
        super();
        this.isActive = () => {
            if (this.readableEnded)
                return false;
            if (this.start !== null && this.start > this.ctx.currentTime)
                return false;
            if (this.end !== null && this.end < this.ctx.currentTime)
                return false;
            if (this._buffer && this._buffer.byteLength === 0)
                return false;
            return true;
        };
        this.ctx = ctx;
        this.start = opts === null || opts === void 0 ? void 0 : opts.start;
        this.end = opts === null || opts === void 0 ? void 0 : opts.end;
        ctx.inputs.push(this);
    }
    read() {
        if (!this.isActive() || !this._buffer || this._buffer === null)
            return null;
        const ret = this._buffer.slice(0, this.ctx.blockSize);
        if (this._buffer && this._buffer.byteLength === 0) {
            this.emit("ended");
        }
        return ret;
    }
    free() {
        this._buffer = null;
    }
}
//# sourceMappingURL=audio-data-source.js.map