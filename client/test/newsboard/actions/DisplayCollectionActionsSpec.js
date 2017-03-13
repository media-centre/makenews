import {
    displayCollectionFeeds,
    setCurrentCollection,
    deleteCollection,
    clearFeeds,
    deleteCollectionFeed,
    COLLECTION_FEEDS,
    NO_COLLECTION_FEEDS,
    CURRENT_COLLECTION,
    CLEAR_COLLECTION_FEEDS,
    DELETE_COLLECTION,
    DELETE_COLLECTION_FEED
} from "./../../../src/js/newsboard/actions/DisplayCollectionActions";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import Toast from "../../../src/js/utils/custom_templates/Toast";
import mockStore from "../../helper/ActionHelper";
import sinon from "sinon";
import { assert } from "chai";

describe("DisplayCollectionAction", () => {
    let sandbox = null, collection = null;
    let ajaxClientInstance = null;

    describe("displayCollectionFeed", () => {

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
                } catch(err) {
                    done(err);
                }
            }));
        });

        it("should dispatch no collection feeds when failed to fetch the feeds", (done) => {
            let offset = 0;
            let getMock = sandbox.mock(ajaxClientInstance).expects("get")
                .withArgs({ collection, offset }).returns(Promise.reject("error"));

            let store = mockStore([], [{ "type": NO_COLLECTION_FEEDS }], done);
            store.dispatch(displayCollectionFeeds(offset, collection, () => {
            }));

            getMock.verify();
        });
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

    describe("deleteCollection", () => {
        collection = "testID";
        const event = { "target": {
            "parentNode": "collection-name"
        } };
        const firstCollection = {};

        beforeEach("deleteCollection", () => {
            sandbox = sinon.sandbox.create();
            ajaxClientInstance = AjaxClient.instance("/collection");
            sandbox.mock(AjaxClient).expects("instance").withExactArgs("/collection").returns(ajaxClientInstance);
        });

        afterEach("deleteCollection", () => {
            sandbox.restore();
        });

        it("should dispatch deletecCollection when successfully delete collection", (done) => {
            let response = { "ok": true };

            const deleteMock = sandbox.mock(ajaxClientInstance).expects("deleteRequest")
                .withExactArgs({ collection }).returns(Promise.resolve(response));
            let store = mockStore([], [{ "type": DELETE_COLLECTION, "collection": collection },
                { "type": CLEAR_COLLECTION_FEEDS }
            ], done);
            store.dispatch(deleteCollection(event, collection, firstCollection));

            deleteMock.verify();
        });

        it("should display toast message on failure", async () => {

            const deleteMock = sandbox.mock(ajaxClientInstance).expects("deleteRequest")
                .withExactArgs({ collection }).returns(Promise.reject());

            const toastMock = sandbox.mock(Toast).expects("show").withExactArgs("Could not delete collection");

            try {
                let dispatchFunc = deleteCollection(event, collection, firstCollection);
                await dispatchFunc();
                assert.fail();
            } catch(error) {
                deleteMock.verify();
                toastMock.verify();
            }
        });


        it("should display toast when there is no response", async () => {
            const deleteMock = sandbox.mock(ajaxClientInstance).expects("deleteRequest")
                .withExactArgs({ collection }).returns(Promise.resolve({}));
            const toastMock = sandbox.mock(Toast).expects("show").withExactArgs("Could not delete collection");

            try {
                let dispatchFunc = deleteCollection(event, collection, firstCollection);
                await dispatchFunc();
                assert.fail();
            } catch(error) {
                deleteMock.verify();
                toastMock.verify();
            }
        });

    });

    describe("deleteCollectionFeed", () => {
        const feedId = "feedId";
        const collectionId = "collectionId";
        beforeEach("deleteCollectionFeed", () => {
            sandbox = sinon.sandbox.create();
            ajaxClientInstance = AjaxClient.instance("./collection-feed");
            sandbox.stub(AjaxClient, "instance").returns(ajaxClientInstance);
        });

        afterEach("deleteCollectionFeed", () => {
            sandbox.restore();
        });

        it("should delete selected feed from the collection", (done) => {
            const deleteMock = sandbox.mock(ajaxClientInstance).expects("deleteRequest")
                .withExactArgs({ feedId, collectionId }).returns(Promise.resolve({ "ok": true }));

            const actions = [{ "type": DELETE_COLLECTION_FEED, feedId }];
            const store = mockStore([], actions, done);

            store.dispatch(deleteCollectionFeed(feedId, collectionId));

            deleteMock.verify();
        });

        it("should show toast message on failure", async () => {
            const toastMock = sandbox.mock(Toast).expects("show").withExactArgs("Could not to delete article");
            const deleteMock = sandbox.mock(ajaxClientInstance).expects("deleteRequest")
                .withExactArgs({ feedId, collectionId }).returns(Promise.reject());
            try {
                const dispatchFn = deleteCollectionFeed(feedId, collectionId);
                await dispatchFn();
            } catch(error) {
                toastMock.verify();
                deleteMock.verify();
            }
        });

        it("should show toast message when there is no response from db", async () => {
            const toastMock = sandbox.mock(Toast).expects("show").withExactArgs("Could not to delete article");
            const deleteMock = sandbox.mock(ajaxClientInstance).expects("deleteRequest")
                .withExactArgs({ feedId, collectionId }).returns(Promise.resolve({}));
            try {
                const dispatchFn = deleteCollectionFeed(feedId, collectionId);
                await dispatchFn();
            } catch(error) {
                toastMock.verify();
                deleteMock.verify();
            }
        });
    });

});
