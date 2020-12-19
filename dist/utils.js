"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const audio_data_source_1 = require("./audio-sources/audio-data-source");
const ssrctx_1 = require("./ssrctx");
const ctx = ssrctx_1.SSRContext.default();
let source = new audio_data_source_1.AudioDataSource(ctx, {
    start: 0.15,
});
ctx.start();
source.read();
setInterval(() => {
    console.log(ctx.currentTime, process.uptime);
}, 1000);
//# sourceMappingURL=utils.js.map