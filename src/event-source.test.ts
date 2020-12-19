import { expect } from "chai";
import { EventSource } from "./event-source";
import * as ipc from "node-ipc";

describe("EventSource", () => {
  let evt;
  it("parses an SSE straem", () => {
    evt = new EventSource("https://www.grepawk.com/bach/rt");
    evt.addListener("notes", (data) => {});
  });
  afterEach(() => {
    evt.close();
  });
});
