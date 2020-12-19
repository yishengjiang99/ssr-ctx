import { expect } from "chai";
import { EventSource } from "./event-source";
describe("EventSource", () => {
    let evt;
    it("parses an SSE straem", () => {
        evt = new EventSource("https://www.grepawk.com/bach/rt");
        evt.addListener("notes", (data) => {
            expect(data).include("midi");
        });
    });
    afterEach(() => {
        evt.close();
    });
});
//# sourceMappingURL=event-source.test.js.map