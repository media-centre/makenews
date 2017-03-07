import {
    displayCollectionFeeds,
    setCurrentCollection,
    clearFeeds,
    COLLECTION_FEEDS,
    NO_COLLECTION_FEEDS,
    CURRENT_COLLECTION,
    CLEAR_COLLECTION_FEEDS } from "./../../../src/js/newsboard/actions/DisplayCollectionActions";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import mockStore from "../../helper/ActionHelper";
import sinon from "sinon";
import { assert } from "chai";

describe("DisplayCollectionAction", () => {
    let sandbox = null, collection = null;
    let ajaxClientInstance = null;

    beforeEach("DisplayCollectionAction", () => {
        collection = "test";
        sandbox = sinon.sandbox.create();

        ajaxClientInstance = AjaxClient.instance("/collectionFeeds");
        sandbox.mock(AjaxClient).expects("instance").returns(ajaxClientInstance);
    });

    afterEach("DisplayCollectionAction", () => {
        sandbox.restore();
    });

    it("should dispatch collection feeds when successful fetch of feeds", (done) => {
        let feeds = [{ "_id": "id", "title": "someTitle" }];
        let offset = 0;

        let getMock = sandbox.mock(ajaxClientInstance).expects("get")
            .withArgs({ collection, offset }).returns(Promise.resolve(feeds));

        let store = mockStore([], [{ "type": COLLECTION_FEEDS, feeds }], done);
        store.dispatch(displayCollectionFeeds(offset, collection, (result) => {
            try {
                assert.strictEqual(result.docsLength, 1); //eslint-disable-line no-magic-numbers
                assert.isFalse(result.hasMoreFeeds);
                getMock.verify();
            }catch(err) {
                done(err);
            }
        }));
    });

    it("should dispatch no collection feeds when failed to fetch the feeds", (done) => {
        let offset = 0;
        let getMock = sandbox.mock(ajaxClientInstance).expects("get")
            .withArgs({ collection, offset }).returns(Promise.reject("error"));

        let store = mockStore([], [{ "type": NO_COLLECTION_FEEDS }], done);
        store.dispatch(displayCollectionFeeds(offset, collection, () => {}));

        getMock.verify();
    });

    describe("set current collection", () => {
        it("should set collection Name", () => {
            collection = { "collection": "name", "_id": "aldkfjlasdfujuw_sdf23" };
            let result = setCurrentCollection(collection);
            assert.strictEqual(result.type, CURRENT_COLLECTION);
            assert.deepEqual(result.collection, { "name": collection.collection, "id": collection._id });
        });
    });

    describe("clear feeds", () => {
        it("should clear the feeds", () => {
            let result = clearFeeds();
            assert.strictEqual(result.type, CLEAR_COLLECTION_FEEDS);
        });
    });

});
