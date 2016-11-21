/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] max-len:0*/

"use strict";
import RssClient from "../../src/rss/RssClient";
import {expect, assert} from "chai";
import sinon from "sinon";
import * as cheerio from "cheerio/lib/static";
import RssParser from "../../../server/src/rss/RssParser";
import nock from "nock";


describe("fetchRssFeeds", () => {
    let sandbox = null;
    beforeEach("fetchRssFeeds", () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach("fetchRssFeeds", () => {
        sandbox.restore();
    });

    it("should fetch rss feed for valid url", async() => {
        let rssClientMock = new RssClient();
        let feed = [{
            "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
            "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
            "docType": "source",
            "sourceType": "twitter",
            "url": "@balaswecha",
            "categoryIds": [
                "95fa167311bf340b461ba414f1004074"
            ],
            "status": "valid"
        }];
        sinon.mock(rssClientMock).expects("getRssData").withArgs("www.example.com").returns(feed);
        try {
            let result = await rssClientMock.fetchRssFeeds("www.example.com")
            assert.deepEqual(result, feed);
        }
        catch (e) {
            assert.equal(true, false);
        }
        finally {
            rssClientMock.getRssData.restore();
        }
    });

    it("should call handleError when error message is other than FEEDS_NOT_FOUND ", async() => {
        let rssClientMock = new RssClient();
        let error = [{
            "message": "new error"
        }];
        var url = "www.error.com";
        let getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs(url);
        getrssMock.returns(Promise.reject({"message": "Bad status code"}));
        try {
            await rssClientMock.fetchRssFeeds(url);
        } catch (e) {
            assert.deepEqual(e, {"message": url + " is not a proper feed"});
        } finally {
            rssClientMock.getRssData.restore();
        }

    });

    it("should call crawlForRssUrl when error message is FEEDS_NOT_FOUND and rss link not present", async() => {
        let rssClientMock = new RssClient();
        let getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs("www.error.com");
        getrssMock.returns(Promise.reject({"message": "feeds_not_found", "data": []}));
        let crawlForRssUrlMock = sinon.mock(rssClientMock).expects("crawlForRssUrl");
        crawlForRssUrlMock.returns(Promise.reject("error"));
        try {
            await rssClientMock.fetchRssFeeds("www.error.com");
        } catch (e) {
            assert.equal(e, "error");
        } finally {
            rssClientMock.getRssData.restore();
            rssClientMock.crawlForRssUrl.restore();
        }
    });

    it("should call getFeedsFromRssUrl when feeds are  present", async() => {
        let rssClientMock = new RssClient();
        let getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs("www.example.com");
        getrssMock.returns(Promise.reject({
            "message": "feeds_not_found",
            "data": '<link type="application/rss+xml" href="http://www.example.com"> <a href="http://www.example.com" ></a> '
        }));
        let feed = [{
            "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
            "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
            "docType": "source",
            "sourceType": "twitter",
            "url": "@balaswecha",
            "categoryIds": [
                "95fa167311bf340b461ba414f1004074"
            ],
            "status": "valid"
        }];
        let getrssMockNew = sinon.mock(rssClientMock).expects("getFeedsFromRssUrl");
        getrssMockNew.returns(feed);
        try {
            let result = await rssClientMock.fetchRssFeeds("www.example.com");
            assert.deepEqual(result, feed);
        } catch (e) {
            assert.equal(true, false);
        } finally {
            rssClientMock.getRssData.restore();
            rssClientMock.getFeedsFromRssUrl.restore();
        }


    });

    it("should call handleRequestError when rss data is not present", async() => {
        let rssClientMock = new RssClient();
        let getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs("www.error.com");
        getrssMock.returns(Promise.reject({
            "message": "feeds_not_found",
            "data": '<link type="application/rss+xml" href="http://www.error.com"> '
        }));
        let feed = [{
            "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
            "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
            "docType": "source",
            "sourceType": "twitter",
            "url": "@balaswecha",
            "categoryIds": [
                "95fa167311bf340b461ba414f1004074"
            ],
            "status": "valid"
        }];

        try {
            await rssClientMock.getFeedsFromRssUrl("http://www.example.com", "www.error.com");
        }
        catch (e) {
            assert.deepEqual(e, {"message": "Request failed for " + "www.error.com"});
        }
        finally {
            rssClientMock.getRssData.restore();
        }

    });


    it("should return feeds when rss data is  present", async() => {
        let rssClientMock = new RssClient();
        let feed = [{
            "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
            "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
            "docType": "source",
            "sourceType": "twitter",
            "url": "@balaswecha",
            "categoryIds": [
                "95fa167311bf340b461ba414f1004074"
            ],
            "status": "valid"
        }];
        let getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs("http://www.example.com");
        getrssMock.returns(Promise.resolve(feed));

        try {
            let result = await rssClientMock.getFeedsFromRssUrl("http://www.example.com", "www.rss.com");
            assert.deepEqual(result, feed);
        }
        catch (e) {
            assert.equal(true, false);
        }
        finally {
            rssClientMock.getRssData.restore();
        }

    });

    it("should return error when rss links are not present", async() => {
        let rssClientMock = new RssClient();
        let error = {
            "message": "feeds_not_found",
            "data": '<link type="application/rss+xml" href="http://www.error.com"> '
        };
        let root = cheerio.load(error.data)
        let url = "www.error.com";
        try {
            await rssClientMock.crawlForRssUrl(root, url);
        }
        catch (e) {
            assert.deepEqual(e, {"message": url + " is not a proper feed"});
        }

    });

    it("should return error when rss links are present and no rss feeds ", async() => {
        let rssClientMock = new RssClient();
        let error = {"message": "feeds_not_found", "data": '<a href="/abc"></a> '};
        let root = cheerio.load(error.data)
        let url = "www.error.com";
        let getrssMock = sinon.mock(rssClientMock).expects("getCrawledRssData");
        getrssMock.returns(Promise.reject("error"));
        try {
            let a = await rssClientMock.crawlForRssUrl(root, url);
        }
        catch (e) {
            assert.deepEqual(e, "error");
        }
        finally {
            rssClientMock.getCrawledRssData.restore();
        }

    });


    it("should return feeds when rss links are present ans no rss feeds", async () => {
        let rssClientMock =new RssClient();
        let error ={ "message": "feeds_not_found", "data": '<a href="/abc"></a> ' };
        let root = cheerio.load(error.data)
        let url = "www.error.com";
        let getrssMock = sandbox.mock(rssClientMock).expects("getRssData").once();
        getrssMock.returns(Promise.resolve({"data": "xyz"}));
        let links = new Set();
        links.add('/a1');
        links.add('/a2');
        links.add('/a3');

        let a= await rssClientMock.getCrawledRssData(links, url);
        assert.deepEqual(a, { "data": "xyz", "url": "/a1" });
        getrssMock.verify();


    });

    it("should resolve data from crawl list when rss links are not present and no rss feeds ", async () => {
        let rssClientMock =new RssClient();
        let error ={ "message": "feeds_not_found", "data": '<a href="/abc"></a> ' };
        let root = cheerio.load(error.data)
        let url = "www.error.com";
        let getrssMock = sandbox.mock(rssClientMock).expects("getRssData").once();
        getrssMock.returns(Promise.reject("error"));

            // .onSecondCall().returns(Promise.resolve({"data": "xyz"}));

        let crawlRssListMock = sandbox.mock(rssClientMock).expects("crawlRssList").once();
        crawlRssListMock.returns(Promise.resolve({"data": "xyz", "url": "/a1sub"}));


        let links = new Set();
        links.add('/a1');
        links.add('/a2');
        links.add('/a3');

        let a= await rssClientMock.getCrawledRssData(links, url);
        assert.deepEqual(a, { "data": "xyz", "url": "/a1sub" });
        getrssMock.verify();
        crawlRssListMock.verify();


    });

    it("should resolve data for second link from crawl list when rss links are not present and no rss feeds for first link and rss links are present for second link ", async () => {
        let rssClientMock =new RssClient();
        let error ={ "message": "feeds_not_found", "data": '<a href="/abc"></a> ' };
        let root = cheerio.load(error.data)
        let url = "www.error.com";
        let getrssMock = sandbox.mock(rssClientMock).expects("getRssData").twice();
        getrssMock.onFirstCall().returns(Promise.reject("error"))
        .onSecondCall().returns(Promise.resolve({"data": "xyz"}));

        let crawlRssListMock = sandbox.mock(rssClientMock).expects("crawlRssList").once();
        crawlRssListMock.returns(Promise.reject("error"));


        let links = new Set();
        links.add('/a1');
        links.add('/a2');
        links.add('/a3');

        let a= await rssClientMock.getCrawledRssData(links, url);
        assert.deepEqual(a, { "data": "xyz", "url": "/a2" });
        getrssMock.verify();
        crawlRssListMock.verify();


    });

    it.only("should reject data when no rss links are present and no rss feeds for all links", async () => {
        let rssClientMock =new RssClient();
        let error ={ "message": "feeds_not_found", "data": '<a href="/abc"></a> ' };
        let root = cheerio.load(error.data)
        let url = "www.error.com";
        let getrssMock = sandbox.mock(rssClientMock).expects("getRssData").thrice();
        getrssMock.returns(Promise.reject("error"))

        let crawlRssListMock = sandbox.mock(rssClientMock).expects("crawlRssList").thrice();
        crawlRssListMock.returns(Promise.reject("error"));


        let links = new Set();
        links.add('/a1');
        links.add('/a2');
        links.add('/a3');

        try {
            let a= await rssClientMock.getCrawledRssData(links, url);
            assert.fail("should fail");
        } catch (error) {
            getrssMock.verify();
            crawlRssListMock.verify();
            assert.deepEqual(error, {"message": url + " is not a proper feed"});
        }


    });

    it("should fetch feeds if the link contains an href", async() => {
        let rssClientMock = new RssClient();
        let feed = [{
            "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
            "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
            "docType": "source",
            "sourceType": "twitter",
            "url": "@balaswecha",
            "categoryIds": [
                "95fa167311bf340b461ba414f1004074"
            ],
            "status": "valid"
        }];
        let getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs("/abc-rss");
        getrssMock.returns(Promise.resolve(feed));
        let error = {"message": "feeds_not_found", "data": '<a href="/abc-rss"></a> '};

        try {
            let data = await rssClientMock.crawlRssList("/abc-rss", error, "http://www.example.com/abc-rss");
            assert.deepEqual(data, feed);
        }
        finally {
            rssClientMock.getRssData.restore();
        }

    });

    it("it should return error when invalid request on url", async() => {
        let rssClientMock = new RssClient();
        let url = "www.example.com";
        try {
            await rssClientMock.getRssData(url)
        }
        catch (error) {
            assert.deepEqual(error.message, "Request failed for www.example.com");
        };
    });

    it("it should return feeds_not_found when parser doesnt return feeds", async() => {
        let rssClientMock = new RssClient();
        let url = "http://www.example.com";
        try {
            await rssClientMock.getRssData(url)
        }
        catch (error) {
            console.log(error.message)
            assert.deepEqual(error.message, "feeds_not_found");
        };
    });

    it("it should return feeds when parser returns feeds", async() => {
        let rssClientMock = new RssClient();
        let feed = [{
            "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
            "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
            "docType": "source",
            "sourceType": "twitter",
            "url": "@balaswecha",
            "categoryIds": [
                "95fa167311bf340b461ba414f1004074"
            ],
            "status": "valid"
        }];
        let url = "http://www.example.com";
        sinon.stub(RssParser.prototype, 'parse', () => Promise.resolve(feed));
        let res = await rssClientMock.getRssData(url);
        assert.equal(res,feed);

    });

    it("it should return bad_status_code when ", async () => {
        let rssClientMock = new RssClient();
        let url = "http://www.example.com";
        nock(url)
            .get("/rss")
            .reply(200, { "data": "success" });
        try{
            await rssClientMock.getRssData(url + "/rss");
            assert.fail("should throw exception");
        }
        catch (error){
            assert.deepEqual(error,{ "message": "Bad status code" })
        }
    })

});