import { assert } from "chai";
import sinon from "sinon";
import RssBatchFeedsFetch from "../../src/rss/RssBatchFeedsFetch";
import RssClient from "../../src/rss/RssClient";
import CouchClient from "../../src/CouchClient";

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
        feed = { "items": [{
            "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
            "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
            "docType": "source",
            "sourceType": "web",
            "url": "@balaswecha",
            "categoryIds": [
                "95fa167311bf340b461ba414f1004074"
            ],
            "status": "valid"
        }] };
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

            try {
                let response = await rssBatchFeedsFetch.fetchBatchFeeds(url, accessToken);
                console.log(response)
                assert.deepEqual(response, feed.items);
            } catch(error) {
                assert.equal(error, "not able to store in db");
            }
        });


        afterEach("rssBatchFeedsFetch afterEach", () => {
            RssClient.instance.restore();
            rssClientMock.getRssData.restore();
        });
    });

});
