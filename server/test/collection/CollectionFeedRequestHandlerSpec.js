import { getCollectedFeeds } from "./../../src/collection/CollectionFeedsRequestHandler";
import CouchClient from "../../src/CouchClient";
import sinon from "sinon";
import { assert } from "chai";

describe("CollectionFeedsRequestHandler", () => {

    describe("getCollectedFeeds", () => {
        let sandbox = null, authSession = null, couchClient = null, selector = null;
        let offset = 0, collection = "test";

        beforeEach("getCollectedFeeds", () => {
            sandbox = sinon.sandbox.create();
            selector = {
                "selector": {
                    "docType": {
                        "$eq": "collectionFeed"
                    },
                    "collection": {
                        "$eq": collection
                    }
                },
                "skip": offset
            };
            authSession = "test_session";
            couchClient = new CouchClient();
            sandbox.stub(CouchClient, "instance").returns(couchClient);
        });

        afterEach("getCollectedFeeds", () => {
            sandbox.restore();
        });

        it("should get Collection Feeds from the database", async () => {
            let feeds = {
                "docs": [
                    {
                        "_id": "b9c4a434f0e4aa72f7cf55f21ac1c18218a22d896dbfcd39fec7e55e9cbefd7352853c9656edcb45308bf0476e000678",
                        "docType": "collectionFeed",
                        "feedId": "b9c4a434f0e4aa72f7cf55f21ac1c18218a22d896dbfcd39fec7e55e9cbefd73",
                        "collection": collection
                    }
                ]
            };
            let findDocumentsMock = sandbox.mock(couchClient).expects("findDocuments");
            findDocumentsMock.withArgs(selector).returns(Promise.resolve(feeds));

            let docs = await getCollectedFeeds(authSession, collection, offset);
            assert.deepEqual(docs, feeds);
            findDocumentsMock.verify();
        });

        it("should reject with error when database throws unexpected response", async () => {
            let findDocumentsMock = sandbox.mock(couchClient).expects("findDocuments");
            findDocumentsMock.withArgs(selector).returns(Promise.reject("unexpected response from the db"));
            try{
                await getCollectedFeeds(authSession, collection, offset);
                findDocumentsMock.verify();
            } catch(error) {
                assert.strictEqual(error, "unexpected response from the db");
            }
        });
    });
});
