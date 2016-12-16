import { markFBSourcesAsAdded } from "../../src/js/config/reducers/FacebookReducer";
import { expect } from "chai";

describe("Facebook Reducer", () => {
    it("should add the added=true property to the configured facebook page", () => {
        let sources = [{ "id": 1, "name": "Page" }, { "id": 2, "name": "Page2" }];
        let sourcesToConfigure = [{ "id": 1, "name": "Page" }];
        expect(markFBSourcesAsAdded(sources, sourcesToConfigure)).to.deep.equal(
            [{ "_id": 1, "added": true, "name": "Page" }, { "id": 2, "name": "Page2" }]);
    });

    it("should add the added=true property to multiple sources", () => {
        let sources = [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }];
        let sourcesToConfigure = [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }];
        expect(markFBSourcesAsAdded(sources, sourcesToConfigure)).to.deep.equal([
            { "_id": 1, "added": true, "name": "Group" },
            { "_id": 2, "added": true, "name": "Group2" }
        ]);
    });
});
