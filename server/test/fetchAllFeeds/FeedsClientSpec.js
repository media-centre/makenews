import FeedsClient from "../../src/fetchAllFeeds/FeedsClient";
import CouchClient from "../../src/CouchClient";
import { assert } from "chai";
import sinon from "sinon";

describe("FeedsClient", () => {
    describe("getfeeds", () => {
        let authSession = null, dbName = null, body = null, couchClientInstanceMock = null, feedsClientInstance = null;
        beforeEach("getfeeds", () => {
            authSession = "access Token";
            dbName = "dbName";
            body = { "selector": { "docType": { "$eq": "feed" } } };
            couchClientInstanceMock = new CouchClient(dbName, authSession);
            feedsClientInstance = new FeedsClient();

        });
        afterEach("getfeeds", () => {
            CouchClient.createInstance.restore();
            couchClientInstanceMock.findDocuments.restore();
        });
        it("should throw unexpected response from db", async () => {
            try {
                sinon.mock(CouchClient).expects("createInstance").withArgs(authSession).returns(couchClientInstanceMock);
                sinon.mock(couchClientInstanceMock).expects("findDocuments").withArgs(body).returns(Promise.reject("unexpected response from db"));
                await feedsClientInstance.getFeeds(authSession);
                assert.fail();

            } catch (error) {
                assert.equal(error, "unexpected response from db");
            }
        });

        it("should return feeds from the db when doctype should be feed", async () => {
            let feed = [{
                "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
                "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
                "docType": "feed",
                "sourceType": "web",
                "url": "@balaswecha",
                "categoryIds": [
                    "95fa167311bf340b461ba414f1004074"
                ],
                "status": "valid"
            }];
            try {
                sinon.mock(CouchClient).expects("createInstance").withArgs(authSession).returns(couchClientInstanceMock);
                sinon.mock(couchClientInstanceMock).expects("findDocuments").withArgs(body).returns(Promise.resolve(feed));
                let feeds = await feedsClientInstance.getFeeds(authSession);
                assert.equal(feeds.docType, feed.docType);
                assert.equal(feeds.sourceType, feed.sourceType);
            } catch (error) {
                assert.fail();
            }
        });
    });
});
