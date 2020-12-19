"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const event_source_1 = require("./event-source");
describe("EventSource", () => {
    let evt;
    it("parses an SSE straem", () => {
        evt = new event_source_1.EventSource("https://www.grepawk.com/bach/rt");
        evt.addListener("notes", (data) => {
            chai_1.expect(data).include("midi");
        });
    });
    afterEach(() => {
        evt.close();
    });
});
//# sourceMappingURL=event-source.test.js.map