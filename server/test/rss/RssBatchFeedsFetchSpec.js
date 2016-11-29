import { assert } from "chai";
import sinon from "sinon";
import RssBatchFeedsFetch from "../../src/rss/RssBatchFeedsFetch";
import RssClient from "../../src/rss/RssClient";
import CouchClient from "../../src/CouchClient";
import CryptUtil from "../../src/util/CryptUtil";

describe("RssBatchFeedsFetch", () => {
    let rssBatchFeedsFetch = null;
    let rssClientMock = null;
    let url = null;
    let feed = null;
    let couchClientMock = null;
    let accessToken = null;
    beforeEach("rssBatchFeedsFetch", () => {
        rssBatchFeedsFetch = new RssBatchFeedsFetch();
        rssClientMock = new RssClient();
        url = "www.example.com";
        feed = [{
            "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
            "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
            "docType": "source",
            "sourceType": "web",
            "url": "@balaswecha",
            "categoryIds": [
                "95fa167311bf340b461ba414f1004074"
            ],
            "status": "valid"
        }];
        accessToken = "accessToken";
        couchClientMock = new CouchClient(null, accessToken);
    });

    describe("fetchBatchFeeds", () => {

        it("should thorw feeds not found when get rss data thrown an error", async() => {
            sinon.mock(RssClient).expects("instance").returns(rssClientMock);
            sinon.mock(rssClientMock).expects("getRssData").returns(Promise.reject("feeds not found"));

            try {
                await rssBatchFeedsFetch.fetchBatchFeeds(url, accessToken);
            } catch(error) {
                assert.equal(error, "feeds not found");
            }
        });

        it("should throw not stored in db error when store in db thrown an error", async() => {
            sinon.mock(RssClient).expects("instance").returns(rssClientMock);
            sinon.mock(rssClientMock).expects("getRssData").returns(Promise.resolve(feed));
            sinon.mock(rssBatchFeedsFetch).expects("saveFeedDocumentsToDb").returns(Promise.reject("not able to store in db"));

            try {
                await rssBatchFeedsFetch.fetchBatchFeeds(url, accessToken);
            } catch(error) {
                assert.equal(error, "not able to store in db");
            }
        });

        it("should return successfully stored in db when there is no error from both getRssData and saveFeedDocumentsToDb", async() => {
            sinon.mock(RssClient).expects("instance").returns(rssClientMock);
            sinon.mock(rssClientMock).expects("getRssData").returns(Promise.resolve(feed));
            sinon.mock(rssBatchFeedsFetch).expects("saveFeedDocumentsToDb").returns(Promise.resolve("stored in db"));

            try {
                let response = await rssBatchFeedsFetch.fetchBatchFeeds(url, accessToken);
                assert.equal(response, "stored in db");
            } catch(error) {
                assert.fail();
            } finally {
                rssBatchFeedsFetch.saveFeedDocumentsToDb.restore();
            }
        });

        afterEach("rssBatchFeedsFetch afterEach", () => {
            RssClient.instance.restore();
            rssClientMock.getRssData.restore();
        });
    });

    describe("saveFeedDocumentsToDb", () => {
        it("should throw failed to store in db when there is an error save bulk docs", async() => {
            let response = {
                "userCtx": {
                    "name": "dbName"
                }
            };
            let dbName = "dbName";
            let feeds = { "items": ["feed items"] };
            try {
                sinon.mock(CouchClient).expects("createInstance").returns(couchClientMock);
                sinon.mock(couchClientMock).expects("get").returns(Promise.resolve(response));
                sinon.mock(CryptUtil).expects("dbNameHash").withArgs(response.userCtx.name).returns(dbName);
                sinon.mock(couchClientMock).expects("saveBulkDocuments").returns(Promise.reject("failed to store in db"));
                await rssBatchFeedsFetch.saveFeedDocumentsToDb(feeds, accessToken);
            } catch (error) {
                assert.equal(error, "failed to store in db");
            }
        });

        it("should return success message when there is no error", async () => {
            let response = {
                "userCtx": {
                    "name": "dbName"
                }
            };
            let dbName = "dbName";
            let feeds = { "items": ["feed items"] };
            try {
                sinon.mock(CouchClient).expects("createInstance").returns(couchClientMock);
                sinon.stub(couchClientMock, "get").returns(Promise.resolve(response));
                sinon.stub(couchClientMock, "saveBulkDocuments").returns(Promise.resolve("successfully stored in db"));
                sinon.mock(CryptUtil).expects("dbNameHash").withArgs(response.userCtx.name).returns(dbName);
                let res = await rssBatchFeedsFetch.saveFeedDocumentsToDb(feeds, accessToken);
                assert.equal(res, "Successfully added feeds to Database");
            } catch (error) {
                assert.fail();
            }
        });

        afterEach("rssBatchFeedsFetch afterEach", () => {
            CouchClient.createInstance.restore();
            couchClientMock.get.restore();
            CryptUtil.dbNameHash.restore();
            couchClientMock.saveBulkDocuments.restore();
        });
    });
});
