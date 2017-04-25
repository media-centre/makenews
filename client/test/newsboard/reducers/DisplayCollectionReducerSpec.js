import { displayCollection, currentCollection } from "./../../../src/js/newsboard/reducers/DisplayCollectionReducer";
import {
    COLLECTION_FEEDS,
    CURRENT_COLLECTION,
    CLEAR_COLLECTION_FEEDS,
    DELETE_COLLECTION_FEED
} from "./../../../src/js/newsboard/actions/DisplayCollectionActions";
import { assert } from "chai";

describe("DisplayCollectionReducer", () => {

    describe("displayCollection", () => {

        it("should return feeds with type collection feeds", () => {
            let feeds = [{ "_id": "id", "title": "someTitle" }];
            let action = { "type": COLLECTION_FEEDS, "feeds": feeds };

            assert.deepEqual(displayCollection([], action), feeds);
        });

        it("should return feeds with type collection feeds", () => {
            let action = { "type": CLEAR_COLLECTION_FEEDS };

            assert.deepEqual(displayCollection([], action), []);
        });

        it("should return empty array by default", () => {
            assert.deepEqual(displayCollection(), []);
        });

        it("should return all the feeds except deleted feed", () => {
            const state = [{ "_id": 1 }, { "_id": 2 }, { "_id": 3 }];
            const expectedState = [{ "_id": 1 }, { "_id": 3 }];
            const feedId = 2;
            const action = { "type": DELETE_COLLECTION_FEED, "deleteFeed": feedId };

            assert.deepEqual(displayCollection(state, action), expectedState);
        });
    });

    describe("currentCollection", () => {
        it("should return feeds with type collection name", () => {
            const collection = { "name": "test", "id": "xskdfhnasdflkiej123" };
            const action = { "type": CURRENT_COLLECTION, collection };

            assert.deepEqual(currentCollection({}, action), collection);
        });

        it("should return empty string by default", () => {
            assert.deepEqual(currentCollection(), { "name": "", "id": "" });
        });
    });
});
