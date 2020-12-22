"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackSource = exports.trackSourceFactory = void 0;
const _1 = require(".");
const ssrctx_1 = require("../ssrctx");
const trackSources = [];
let _ctx;
exports.trackSourceFactory = (id) => {
    if (!_ctx)
        _ctx = new ssrctx_1.SSRContext({ nChannels: 2 });
    if (!trackSources[id])
        trackSources[id] = new TrackSource();
    return trackSources[id];
};
class TrackSource extends _1.AudioDataSource {
    constructor(ctx, trackID) {
        super(ctx);
        this.trackID = trackID;
    }
}
exports.TrackSource = TrackSource;
//# sourceMappingURL=track-source.js.map