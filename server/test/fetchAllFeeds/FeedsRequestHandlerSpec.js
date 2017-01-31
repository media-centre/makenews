import FeedsRequestHandler from "../../src/fetchAllFeeds/FeedsRequestHandler";
import CouchClient from "../../src/CouchClient";
import chai, { assert } from "chai";
import sinon from "sinon";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

describe("FeedsRequestHandler", () => {
    describe("fetch feeds", () => {
        let feed = null;
        let authSession = null;
        let feedsRequestHandler = null;
        let couchClientInstanceMock = null;
        let dbName = "dbName", body = null;
        let offset = null, sourceType = ["web"];
        let sandbox = null;

        beforeEach("fetch feeds", () => {
            feed = [{
                "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
                "docType": "feed",
                "sourceType": "web",
                "url": "http://bala.swecha/",
                "status": "valid"
            }];
            authSession = "Access Token";
            feedsRequestHandler = new FeedsRequestHandler();
            offset = 0;  //eslint-disable-line no-magic-numbers
            body = {
                "selector": {
                    "docType": {
                        "$eq": "feed"
                    },
                    "sourceType": {
                        "$in": sourceType
                    },
                    "pubDate": {
                        "$gt": null
                    }
                },
                "fields": ["_id", "title", "description", "link", "sourceType", "bookmark", "tags", "pubDate", "videos", "images"],
                "skip": 0,
                "sort": [{ "pubDate": "desc" }]
            };
            couchClientInstanceMock = new CouchClient(authSession, dbName);
            sandbox = sinon.sandbox.create();
        });

        afterEach("fetch feeds", () => {
            sandbox.restore();
        });

        it("should throw an unexpected response from db", async () => {
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("findDocuments")
                .withArgs(body).returns(Promise.reject("unexpected response from db"));
            await assert.isRejected(feedsRequestHandler.fetchFeeds(authSession, offset, sourceType), "unexpected response from db");
        });

        it("should fetch feeds from the db", async () => {
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("findDocuments")
                .withArgs(body).returns(Promise.resolve(feed));
            let expectedFeeds = await feedsRequestHandler.fetchFeeds(authSession, offset, sourceType);

            assert.deepEqual(expectedFeeds, feed);
        });
    });
});
