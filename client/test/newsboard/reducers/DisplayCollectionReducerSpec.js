import { displayCollection } from "./../../../src/js/newsboard/reducers/DisplayCollectionReducer";
import { COLLECTION_FEEDS } from "./../../../src/js/newsboard/actions/DisplayCollectionActions";
import { assert } from "chai";

describe("DisplayCollectionReducer", () => {

    describe("displayCollection", () => {

        it("should return feeds with type collection feeds", () => {
            let feeds = [{ "_id": "id", "title": "someTitle" }];
            let action = { "type": COLLECTION_FEEDS, "feeds": feeds };

            assert.deepEqual(displayCollection([], action), feeds);
        });

        it("should return empty array by default", () => {
            assert.deepEqual(displayCollection(), []);
        });
    });
});
