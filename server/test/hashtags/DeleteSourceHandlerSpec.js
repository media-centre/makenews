import DeleteSourceHandler from "../../src/hashtags/DeleteSourceHandler";
import * as CollectionFeedsRequestHandler from "../../src/collection/CollectionFeedsRequestHandler";
import sinon from "sinon";
import { assert } from "chai";
import CouchClient from "../../src/CouchClient";

describe("DeleteSourceHandler", () => {
    let deleteSourceHandler = null, sandbox = null, couchClient = null, accessToken = null;

    beforeEach("DeleteSourceHandler", () => {
        deleteSourceHandler = DeleteSourceHandler.instance();
        sandbox = sinon.sandbox.create();
        accessToken = "accessToken";
        couchClient = CouchClient.instance(accessToken);
    });

    afterEach("DeleteSourceHandler", () => {
        sandbox.restore();
    });

    describe("deleteSources", () => {
        let getCollectionFeedIdsMock = null, collectionFeedIds = null;

        beforeEach("deleteSources", () => {
            collectionFeedIds = ["id2", "id3"];
            sandbox.mock(CouchClient).expects("instance").withExactArgs(accessToken).returns(couchClient);
            getCollectionFeedIdsMock = sandbox.mock(CollectionFeedsRequestHandler).expects("getCollectionFeedIds")
                .withExactArgs(couchClient).returns(Promise.resolve(collectionFeedIds));
        });

        it("should delete feeds of the given sources", async () => {
            let sources = ["newsClick"];
            let sourcesDoc = { "docs": [{ "_id": "source1" }] };
            let feedDocs = { "docs": [{ "_id": "id29" }, { "_id": "id30" }] };

            let findMock = sandbox.mock(couchClient).expects("findDocuments").twice();
            findMock.onFirstCall().returns(Promise.resolve(feedDocs));
            findMock.onSecondCall().returns(Promise.resolve(sourcesDoc));

            let saveMock = sandbox.mock(couchClient).expects("saveBulkDocuments").returns(Promise.resolve({ "ok": true }));

            let res = await deleteSourceHandler.deleteSources(sources, accessToken);

            getCollectionFeedIdsMock.verify();
            findMock.verify();
            saveMock.verify();
            assert.deepEqual(res, { "ok": true });
        });

        it("should delete hashtag feed when the sources are empty", async () => {
            let hashtagSources = { "docs": [{ "_id": "hashtag1" }] };
            let feeds = { "docs": [{ "_id": "id29" }, { "_id": "id30" }] };
            let sourcesDoc = { "docs": [{ "_id": "source1" }] };

            let findMock = sandbox.mock(couchClient).expects("findDocuments").thrice();
            findMock.onFirstCall().returns(Promise.resolve(hashtagSources));
            findMock.onSecondCall().returns(Promise.resolve(feeds));
            findMock.onThirdCall().returns(Promise.resolve(sourcesDoc));

            let saveMock = sandbox.mock(couchClient).expects("saveBulkDocuments").returns(Promise.resolve({ "ok": true }));

            const response = await deleteSourceHandler.deleteSources([], accessToken);
            assert.deepEqual(response, { "ok": true });
            saveMock.verify();
        });

        it("should iterate the findDocuments if the current result is 25 ", async () => {
            let sources = ["newsClick"];
            let sourcesDoc = { "docs": [{ "_id": "source1" }] };
            let firstResponse = { "docs": [{ "_id": "id1" }, { "_id": "id4" },
                { "_id": "id5" }, { "_id": "id6" }, { "_id": "id7" }, { "_id": "id8" }, { "_id": "id9" }, { "_id": "id10" },
                { "_id": "id11" }, { "_id": "id12" }, { "_id": "id13" }, { "_id": "id14" }, { "_id": "id15" }, { "_id": "id16" },
                { "_id": "id17" }, { "_id": "id18" }, { "_id": "id19" }, { "_id": "id20" }, { "_id": "id21" }, { "_id": "id22" },
                { "_id": "id23" }, { "_id": "id24" }, { "_id": "id25" }, { "_id": "id27" }, { "_id": "id28" }] };
            let secondResponse = { "docs": [{ "_id": "id29" }, { "_id": "id30" }] };

            let findDocs = sandbox.mock(couchClient).expects("findDocuments").thrice();
            findDocs.onFirstCall().returns(Promise.resolve(firstResponse));
            findDocs.onSecondCall().returns(Promise.resolve(secondResponse));
            findDocs.onThirdCall().returns(Promise.resolve(sourcesDoc));

            let saveDocs = sandbox.mock(couchClient).expects("saveBulkDocuments").returns(Promise.resolve({ "ok": true }));

            const response = await deleteSourceHandler.deleteSources(sources, accessToken);

            findDocs.verify();
            saveDocs.verify();
            getCollectionFeedIdsMock.verify();
            assert.deepEqual(response, { "ok": true });
        });
    });
});
