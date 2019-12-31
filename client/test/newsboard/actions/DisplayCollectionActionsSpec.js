import {
    displayCollectionFeeds,
    setCurrentCollection,
    deleteCollection,
    clearFeeds,
    deleteCollectionFeed,
    renameCollection,
    COLLECTION_FEEDS,
    NO_COLLECTION_FEEDS,
    CURRENT_COLLECTION,
    CLEAR_COLLECTION_FEEDS,
    DELETE_COLLECTION,
    DELETE_COLLECTION_FEED,
    RENAMED_COLLECTION
} from "./../../../src/js/newsboard/actions/DisplayCollectionActions";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import Toast from "../../../src/js/utils/custom_templates/Toast";
import mockStore from "../../helper/ActionHelper";
import sinon from "sinon";
import { assert } from "chai";
import Locale from "./../../../src/js/utils/Locale";

describe("DisplayCollectionAction", () => {
    let sandbox = null;
    let collection = null;
    let ajaxClientInstance = null;

    describe("displayCollectionFeed", () => {
        beforeEach("DisplayCollectionAction", () => {
            collection = "test";
            sandbox = sinon.sandbox.create();

            ajaxClientInstance = AjaxClient.instance("/collection-feeds");
            sandbox.mock(AjaxClient).expects("instance").returns(ajaxClientInstance);
        });

        afterEach("DisplayCollectionAction", () => {
            sandbox.restore();
        });

        it("should dispatch collection feeds when successful fetch of feeds", (done) => {
            const feeds = [{ "_id": "id", "title": "someTitle" }];

            const getMock = sandbox.mock(ajaxClientInstance).expects("get")
                .withArgs({ collection }).returns(Promise.resolve(feeds));

            const store = mockStore([], [{ "type": COLLECTION_FEEDS, feeds }], done);
            store.dispatch(displayCollectionFeeds(collection));
            getMock.verify();
        });

        it("should dispatch no collection feeds when failed to fetch the feeds", (done) => {
            const getMock = sandbox.mock(ajaxClientInstance).expects("get")
                .withArgs({ collection }).returns(Promise.reject("error"));

            const store = mockStore([], [{ "type": NO_COLLECTION_FEEDS }], done);
            store.dispatch(displayCollectionFeeds(collection));

            getMock.verify();
        });
    });

    describe("set current collection", () => {
        it("should set collection Name", () => {
            collection = { "collection": "name", "_id": "aldkfjlasdfujuw_sdf23" };
            const result = setCurrentCollection(collection);
            assert.strictEqual(result.type, CURRENT_COLLECTION);
            assert.deepEqual(result.collection, { "name": collection.collection, "id": collection._id });
        });
    });

    describe("clear feeds", () => {
        it("should clear the feeds", () => {
            const result = clearFeeds();
            assert.strictEqual(result.type, CLEAR_COLLECTION_FEEDS);
        });
    });

    describe("deleteCollection", () => {
        collection = "testID";
        const event = { "target": {
            "parentNode": {
                "className": "collection-name active"
            }
        }
        };

        beforeEach("deleteCollection", () => {
            sandbox = sinon.sandbox.create();
            const newsBoardStrings = {
                "collection": {
                    "deleteFailure": "Could not able to delete collection"
                }
            };
            sandbox.stub(Locale, "applicationStrings").returns({
                "messages": {
                    "newsBoard": newsBoardStrings
                }
            });
            ajaxClientInstance = AjaxClient.instance("/collection");
            sandbox.mock(AjaxClient).expects("instance").withExactArgs("/collection").returns(ajaxClientInstance);
        });

        afterEach("deleteCollection", () => {
            sandbox.restore();
        });

        it("should dispatch deleteCollection and clearFeeds when active collection is deleted", (done) => {
            const response = { "ok": true };

            const deleteMock = sandbox.mock(ajaxClientInstance).expects("deleteRequest")
                .withExactArgs({ collection }).returns(Promise.resolve(response));
            const store = mockStore([], [{ "type": CLEAR_COLLECTION_FEEDS },
                { "type": DELETE_COLLECTION, "collection": collection }
            ], done);
            store.dispatch(deleteCollection(event, collection));

            deleteMock.verify();
        });

        it("should dispatch deleteCollection when successfully delete collection", (done) => {
            const response = { "ok": true };
            const collectionEvent = {
                "target": {
                    "parentNode": {
                        "className": "collection-name"
                    }
                }
            };

            const deleteMock = sandbox.mock(ajaxClientInstance).expects("deleteRequest")
                .withExactArgs({ collection }).returns(Promise.resolve(response));
            const store = mockStore([], [{ "type": DELETE_COLLECTION, "collection": collection }], done);
            store.dispatch(deleteCollection(collectionEvent, collection));

            deleteMock.verify();
        });

        it("should display toast message on failure", async() => {
            const deleteMock = sandbox.mock(ajaxClientInstance).expects("deleteRequest")
                .withExactArgs({ collection }).returns(Promise.reject());

            const toastMock = sandbox.mock(Toast).expects("show").withExactArgs("Could not able to delete collection");

            try {
                const dispatchFunc = deleteCollection(event, collection);
                await dispatchFunc();
                assert.fail();
            } catch(error) {
                deleteMock.verify();
                toastMock.verify();
            }
        });


        it("should display toast when there is no response", async() => {
            const deleteMock = sandbox.mock(ajaxClientInstance).expects("deleteRequest")
                .withExactArgs({ collection }).returns(Promise.resolve({}));
            const toastMock = sandbox.mock(Toast).expects("show").withExactArgs("Could not able to delete collection");

            try {
                const dispatchFunc = deleteCollection(event, collection);
                await dispatchFunc();
                assert.fail();
            } catch(error) {
                deleteMock.verify();
                toastMock.verify();
            }
        });

    });

    describe("deleteCollectionFeed", () => {
        const intermediateDocId = "intermediateDocId";
        const event = { "target": {} };

        beforeEach("deleteCollectionFeed", () => {
            sandbox = sinon.sandbox.create();
            const newsBoardStrings = {
                "article": {
                    "deleteFailure": "Could not able to delete article"
                }
            };
            sandbox.stub(Locale, "applicationStrings").returns({
                "messages": {
                    "newsBoard": newsBoardStrings
                }
            });
            ajaxClientInstance = AjaxClient.instance("/collection-feed");
            sandbox.stub(AjaxClient, "instance").returns(ajaxClientInstance);
        });

        afterEach("deleteCollectionFeed", () => {
            sandbox.restore();
        });

        it("should delete selected feed from the collection", (done) => {
            const deleteMock = sandbox.mock(ajaxClientInstance).expects("deleteRequest")
                .withExactArgs({ intermediateDocId }).returns(Promise.resolve({ "ok": true, "deleteFeed": intermediateDocId }));

            const actions = [{ "type": DELETE_COLLECTION_FEED, "deleteFeed": intermediateDocId }];
            const store = mockStore([], actions, done);

            store.dispatch(deleteCollectionFeed(event, intermediateDocId));

            deleteMock.verify();
        });

        it("should show toast message on failure", async() => {
            const toastMock = sandbox.mock(Toast).expects("show").withExactArgs("Could not able to delete article");
            const deleteMock = sandbox.mock(ajaxClientInstance).expects("deleteRequest")
                .withExactArgs({ intermediateDocId }).returns(Promise.reject());

            try {
                const dispatchFn = deleteCollectionFeed(event, intermediateDocId);
                await dispatchFn();
            } catch(error) {
                toastMock.verify();
                deleteMock.verify();
            }
        });

        it("should show toast message when there is no response from db", async() => {
            const toastMock = sandbox.mock(Toast).expects("show").withExactArgs("Could not able to delete article");
            const deleteMock = sandbox.mock(ajaxClientInstance).expects("deleteRequest")
                .withExactArgs({ intermediateDocId }).returns(Promise.resolve({}));

            try {
                const dispatchFn = deleteCollectionFeed(event, intermediateDocId);
                await dispatchFn();
            } catch(error) {
                toastMock.verify();
                deleteMock.verify();
            }
        });
    });

    describe("rename Collection", () => {
        const collectionId = "1234";
        const newCollectionName = "test";

        beforeEach("rename Collection", () => {
            sandbox = sinon.sandbox.create();
            ajaxClientInstance = AjaxClient.instance("/rename-collection");
            sandbox.stub(AjaxClient, "instance").returns(ajaxClientInstance);
        });

        afterEach("rename Collection", () => {
            sandbox.restore();
        });

        it("should dispatch rename Collection", (done) => {
            const response = { "ok": true };
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };

            const putMock = sandbox.mock(ajaxClientInstance).expects("put")
                .withExactArgs(headers, { collectionId, newCollectionName }).returns(Promise.resolve(response));
            const actions = [{ "type": RENAMED_COLLECTION, collectionId, newCollectionName }];
            const store = mockStore([], actions, done);

            store.dispatch(renameCollection(collectionId, newCollectionName));

            putMock.verify();
        });

        it("should show toast message on failed to rename the collection", async() => {
            const response = { "message": "unable to rename the Collection" };
            const toastMock = sandbox.mock(Toast).expects("show").withExactArgs("unable to rename the Collection");
            const putMock = sandbox.mock(ajaxClientInstance).expects("put")
                .returns(Promise.reject(response));

            const renameCollectionAction = await renameCollection({ collectionId, newCollectionName });
            renameCollectionAction();

            return Promise.resolve().then(() => {
                putMock.verify();
                toastMock.verify();
            });
        });
    });
});
