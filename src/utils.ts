import { expect } from "chai";
import { AudioDataSource } from "./audio-sources/audio-data-source";
import { SSRContext } from "./ssrctx";
const ctx: SSRContext = SSRContext.default();

let source = new AudioDataSource(ctx, {
  start: 0.15,
});
ctx.start();

source.read();

setInterval(() => {
  console.log(ctx.currentTime, process.uptime);
}, 1000);
