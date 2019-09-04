import DeleteSourceHandler from "../../src/hashtags/DeleteSourceHandler";
import sinon from "sinon";
import { assert } from "chai";
import CouchClient from "../../src/CouchClient";
import DateUtil from "../../src/util/DateUtil";
import * as Constants from "./../../src/util/Constants";

describe("DeleteSourceHandler", () => {
    let deleteSourceHandler = null, sandbox = null, couchClient = null, accessToken = null;

    beforeEach("DeleteSourceHandler", () => {
        accessToken = "accessToken";
        sandbox = sinon.sandbox.create();
        couchClient = CouchClient.instance(accessToken);
        sandbox.mock(CouchClient).expects("instance").withExactArgs(accessToken).returns(couchClient);
        deleteSourceHandler = DeleteSourceHandler.instance(accessToken);
    });

    afterEach("DeleteSourceHandler", () => {
        sandbox.restore();
    });

    describe("deleteSources", () => {
        const feedsLimitOriginal = Constants.FEED_LIMIT_TO_DELETE_IN_QUERY;

        beforeEach("deleteSources", () => {
            Constants.FEED_LIMIT_TO_DELETE_IN_QUERY = 25;
        });

        afterEach("deleteSources", () => {
            Constants.FEED_LIMIT_TO_DELETE_IN_QUERY = feedsLimitOriginal;
        });

        it("should delete feeds of the given sources", async() => {
            let sources = ["newsClick"];
            let sourcesDoc = { "docs": [{ "_id": "source1" }] };
            let feedDocs = { "docs": [{ "_id": "id29", "docType": "feed" },
                { "_id": "id29-collection1", "docType": "collectionFeed", "feedId": "id29" },
                { "_id": "id29-collection2", "docType": "collectionFeed", "feedId": "id29" },
                { "_id": "id30", "docType": "feed" }] };

            let findMock = sandbox.mock(couchClient).expects("findDocuments").twice();
            findMock.onFirstCall().returns(Promise.resolve(sourcesDoc));
            findMock.onSecondCall().returns(Promise.resolve(feedDocs));

            let saveMock = sandbox.mock(couchClient).expects("saveBulkDocuments").returns(Promise.resolve({ "ok": true }));
            let deleteMock = sandbox.mock(couchClient).expects("deleteBulkDocuments")
                .withExactArgs([{ "_id": "id29", "docType": "feed" }, { "_id": "id30", "docType": "feed" }, { "_id": "source1" }]).returns(Promise.resolve({ "ok": true }));

            let res = await deleteSourceHandler.deleteSources(sources);

            findMock.verify();
            saveMock.verify();
            deleteMock.verify();
            assert.deepEqual(res, { "ok": true });
        });


        it("should iterate the findDocuments if the current result is 25 ", async() => {
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
            let deleteMock = sandbox.mock(couchClient).expects("deleteBulkDocuments").returns(Promise.resolve({ "ok": true }));
            const response = await deleteSourceHandler.deleteSources(sources);
            deleteMock.verify();
            findDocs.verify();
            saveDocs.verify();
            assert.deepEqual(response, { "ok": true });
        });

        it("should update the collection feed docs of the given sources to delete", async() => {
            const sources = ["NewsClick"];
            const sourcesDoc = { "docs": [{ "_id": "newsclick" }] };
            const collectionFeedDoc = { "_id": "collectionFeedId1", "docType": "collectionFeed", "_rev": "rev1", "collectionId": "collectionId1" };
            const feedDoc = { "_id": "feedId1", "docType": "feed", "sourceId": "newsClick", "title": "title",
                "description": "description", "link": "link", "tags": [], "sourceType": "web", "pubDate": "20170520" };
            const feedsDoc = { "docs": [feedDoc, collectionFeedDoc] };
            const updatedDoc = { "_id": "collectionFeedId1", "docType": "collectionFeed", "_rev": "rev1", "collectionId": "collectionId1",
                "title": "title", "description": "description", "link": "link",
                "tags": [], "sourceType": "web", "pubDate": "20170520", "sourceDeleted": true, "selectText": true };

            let findMock = sandbox.mock(couchClient).expects("findDocuments").twice();
            findMock.onFirstCall().returns(Promise.resolve(sourcesDoc));
            findMock.onSecondCall().returns(Promise.resolve(feedsDoc));

            let deleteBulkMock = sandbox.mock(couchClient).expects("deleteBulkDocuments").withArgs([feedDoc, { "_id": "newsclick" }]);
            let saveBulkMock = sandbox.mock(couchClient).expects("saveBulkDocuments").withArgs({ "docs": [updatedDoc] });

            await deleteSourceHandler.deleteSources(sources);

            findMock.verify();
            deleteBulkMock.verify();
            saveBulkMock.verify();
        });
    });

    describe("deleteHashtags", () => {
        it("should delete feeds of the hashtags sources", async() => {
            let sourcesDoc = { "docs": [{ "_id": "#abc" }] };
            let feedDocs = { "docs": [{ "_id": "id29", "docType": "feed" }, { "_id": "id29-collection1", "docType": "collectionFeed", "feedId": "id29" },
                { "_id": "id29-collection2", "docType": "collectionFeed", "feedId": "id29" }, { "_id": "id30", "docType": "feed" }] };
            let findMock = sandbox.mock(couchClient).expects("findDocuments").twice();
            findMock.onFirstCall().returns(Promise.resolve(sourcesDoc));
            findMock.onSecondCall().returns(Promise.resolve(feedDocs));
            let saveMock = sandbox.mock(couchClient).expects("saveBulkDocuments").returns(Promise.resolve({ "ok": true }));
            let deleteMock = sandbox.mock(couchClient).expects("deleteBulkDocuments")
                .withExactArgs([{ "_id": "id29", "docType": "feed" }, { "_id": "id30", "docType": "feed" }, { "_id": "#abc" }]).returns(Promise.resolve({ "ok": true }));
            await deleteSourceHandler.deleteHashTags();
            findMock.verify();
            saveMock.verify();
            deleteMock.verify();
        });
    });

    describe("deleteOldFeeds", () => {
        it("should delete all feeds whose published date is older than 30 days from the present day", async() => {
            let docs = [
                {
                    "images": [{ "url": "image url" }],
                    "videos": [{ "thumbnail": "video image url" }],
                    "title": "Some Title",
                    "description": "Some Description",
                    "sourceType": "facebook",
                    "tags": ["Hindu"],
                    "pubDate": "2017-01-31T06:58:27.000Z",
                    "bookmark": false,
                    "_id": "123"
                },
                {
                    "images": [{ "url": "image url" }],
                    "videos": [{ "thumbnail": "video image url" }],
                    "title": "Some Title",
                    "description": "Some Description",
                    "sourceType": "facebook",
                    "tags": ["Hindu"],
                    "pubDate": "2017-01-31T06:58:27.000Z",
                    "bookmark": false,
                    "_id": "123"
                }];
            let data = {
                "docs": docs
            };
            let getUTCDateAndTimeMock = sandbox.stub(DateUtil, "getUTCDateAndTime");
            getUTCDateAndTimeMock.returns("2017-03-27T14:07:37.000Z");
            let findMock = sandbox.mock(couchClient).expects("findDocuments").twice();
            findMock.onFirstCall().returns(Promise.resolve(data));
            findMock.onSecondCall().returns(Promise.resolve({ "docs": [] }));
            let deleteMock = sandbox.mock(couchClient).expects("deleteBulkDocuments").withExactArgs(docs).once();
            await deleteSourceHandler.deleteOldFeeds(couchClient);
            findMock.verify();
            deleteMock.verify();
        });
    });
});
