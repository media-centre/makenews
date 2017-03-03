import { markSourcesAsAdded, unmarkDeletedSource } from "../../../src/js/sourceConfig/reducers/SourceConfiguraionReducersUtils";
import { expect } from "chai";

describe("SourceConfiguraionReducersUtils", () => {
    describe("markSourcesAsAdded", () => {
        it("should add the added=true property to the configured facebook page", () => {
            let sources = [{ "id": 1, "name": "Page" }, { "id": 2, "name": "Page2" }];
            let sourcesToConfigure = [{ "id": 1, "name": "Page" }];
            expect(markSourcesAsAdded(sources, sourcesToConfigure, "id")).to.deep.equal(
                [{ "_id": 1, "id": 1, "added": true, "name": "Page" }, { "id": 2, "name": "Page2" }]);
        });

        it("should add the added=true property to multiple sources", () => {
            let sources = [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }];
            let sourcesToConfigure = [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }];
            expect(markSourcesAsAdded(sources, sourcesToConfigure, "id")).to.deep.equal([
                { "_id": 1, "id": 1, "added": true, "name": "Group" },
                { "_id": 2, "id": 2, "added": true, "name": "Group2" }
            ]);
        });
    });

    describe("unmarkDeletedSource", () => {
        it("should change added property to false when the configure source is deleted", () => {
            let sources = [{ "_id": 1, "name": "Group", "added": true }, { "_id": 2, "name": "Group2" }];
            let expectedSources = [{ "_id": 1, "name": "Group", "added": false }, { "_id": 2, "name": "Group2" }];
            let sourceToDelete = 1;
            expect(unmarkDeletedSource(sources, sourceToDelete)).to.deep.equal(expectedSources);
        });
    });
});
