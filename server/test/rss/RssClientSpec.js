/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] max-len:0, init-declarations:0*/


import RssClient from "../../src/rss/RssClient";
import { assert } from "chai";
import sinon from "sinon";
import * as cheerio from "cheerio/lib/static";
import RssParser from "../../../server/src/rss/RssParser";
import nock from "nock";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";

describe("RssClient", () => {
    let sandbox, rssClientMock, feed, error, url = null;

    beforeEach("RssClient", () => {
        sandbox = sinon.sandbox.create();
        rssClientMock = new RssClient();
        feed = [{
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
        url = "www.error.com";
        error = {
            "message": "feeds_not_found",
            "data": "<link type='application/rss+xml' href='http://www.error.com'>"
        };
    });

    afterEach("RssClient", () => {
        sandbox.restore();
    });

    describe("fetchRssFeeds", () => {
        beforeEach("fetchRssFeeds", () => {
            error = [{
                "message": "new error"
            }];
        });

        it("should fetch rss feed for valid url", async() => {
            url = "www.example.com";
            sinon.mock(rssClientMock).expects("getRssData").withArgs(url).returns(feed);

            try {
                let result = await rssClientMock.fetchRssFeeds(url);
                assert.deepEqual(result, feed);
            } catch(err) {
                assert.fail();
            } finally {
                rssClientMock.getRssData.restore();
            }
        });

        it("should call handleError when error message is other than FEEDS_NOT_FOUND ", async() => {
            let getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs(url);
            getrssMock.returns(Promise.reject({ "message": "Bad status code" }));

            try {
                await rssClientMock.fetchRssFeeds(url);
            } catch (err) {
                assert.deepEqual(err, { "message": url + " is not a proper feed" });
            } finally {
                rssClientMock.getRssData.restore();
            }

        });

        it("should call crawlForRssUrl when error message is FEEDS_NOT_FOUND and rss link not present", async() => {
            let getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs(url);
            getrssMock.returns(Promise.reject({ "message": "feeds_not_found", "data": [] }));
            let crawlForRssUrlMock = sinon.mock(rssClientMock).expects("crawlForRssUrl");
            crawlForRssUrlMock.returns(Promise.reject("error"));

            try {
                await rssClientMock.fetchRssFeeds(url);
            } catch (err) {
                assert.equal(err, "error");
            } finally {
                rssClientMock.getRssData.restore();
                rssClientMock.crawlForRssUrl.restore();
            }
        });

        it("should call getFeedsFromRssUrl when feeds are  present", async() => {
            url = "www.example.com";
            let getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs(url);
            getrssMock.returns(Promise.reject({
                "message": "feeds_not_found",
                "data": "<link type='application/rss+xml' href='http://www.example.com'> <a href='http://www.example.com' ></a>"
            }));
            let getrssMockNew = sinon.mock(rssClientMock).expects("getFeedsFromRssUrl");
            getrssMockNew.returns(feed);

            try {
                let result = await rssClientMock.fetchRssFeeds(url);
                assert.deepEqual(result, feed);
            } catch (err) {
                assert.fail();
            } finally {
                rssClientMock.getRssData.restore();
                rssClientMock.getFeedsFromRssUrl.restore();
            }
        });
    });

    describe("getFeedsFromUrl", () => {
        it("should call handleRequestError when rss data is not present", async() => {
            let getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs(url);
            getrssMock.returns(Promise.reject(error));

            try {
                await rssClientMock.getFeedsFromRssUrl("http://www.example.com", url);
            } catch (err) {
                assert.deepEqual(err, { "message": "Request failed for " + url });
            } finally {
                rssClientMock.getRssData.restore();
            }

        });

        it("should return feeds when rss data is  present", async() => {
            let getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs("http://www.example.com");
            getrssMock.returns(Promise.resolve(feed));

            try {
                let result = await rssClientMock.getFeedsFromRssUrl("http://www.example.com", "www.rss.com");
                assert.deepEqual(result, feed);
            } catch (err) {
                assert.fail();
            } finally {
                rssClientMock.getRssData.restore();
            }

        });
    });

    describe("crawlForRssUrl", () => {
        it("should return error when rss links are not present", async() => {
            let root = cheerio.load(error.data);

            try {
                await rssClientMock.crawlForRssUrl(root, url);
            } catch (err) {
                assert.deepEqual(err, { "message": url + " is not a proper feed" });
            }

        });

        it("should return error when rss links are present and no rss feeds ", async() => {
            error = { "message": "feeds_not_found", "data": "<a href='/abc'></a>" };
            let root = cheerio.load(error.data);
            let getrssMock = sinon.mock(rssClientMock).expects("getCrawledRssData");
            getrssMock.returns(Promise.reject("error"));

            try {
                await rssClientMock.crawlForRssUrl(root, url);
            } catch (err) {
                assert.deepEqual(err, "error");
            } finally {
                rssClientMock.getCrawledRssData.restore();
            }

        });
    });

    describe("getCrawledRssData", () => {
        beforeEach("getCrawledRssData", () => {
            error = { "message": "feeds_not_found", "data": "<a href='/abc'></a>" };
        });

        it("should return feeds when rss links are present ans no rss feeds", async() => {
            let getrssMock = sandbox.mock(rssClientMock).expects("getRssData").once();
            getrssMock.returns(Promise.resolve({ "data": "xyz" }));
            let links = new Set();
            links.add("/a1");
            links.add("/a2");
            links.add("/a3");

            let data = await rssClientMock.getCrawledRssData(links, url);
            assert.deepEqual(data, { "data": "xyz", "url": "/a1" });
            getrssMock.verify();
        });

        it("should resolve data from crawl list when rss links are not present and no rss feeds ", async() => {
            let getrssMock = sandbox.mock(rssClientMock).expects("getRssData").once();
            getrssMock.returns(Promise.reject("error"));
            let crawlRssListMock = sandbox.mock(rssClientMock).expects("crawlRssList").once();
            crawlRssListMock.returns(Promise.resolve({ "data": "xyz", "url": "/a1sub" }));
            let links = new Set();
            links.add("/a1");
            links.add("/a2");
            links.add("/a3");

            let data = await rssClientMock.getCrawledRssData(links, url);
            assert.deepEqual(data, { "data": "xyz", "url": "/a1sub" });
            getrssMock.verify();
            crawlRssListMock.verify();
        });

        it("should resolve data for second link from crawl list when rss links are not present and no rss feeds for first link and rss links are present for second link ", async() => {
            let getrssMock = sandbox.mock(rssClientMock).expects("getRssData").twice();
            getrssMock.onFirstCall().returns(Promise.reject("error"))
                .onSecondCall().returns(Promise.resolve({ "data": "xyz" }));
            let crawlRssListMock = sandbox.mock(rssClientMock).expects("crawlRssList").once();
            crawlRssListMock.returns(Promise.reject("error"));
            let links = new Set();
            links.add("/a1");
            links.add("/a2");
            links.add("/a3");

            let data = await rssClientMock.getCrawledRssData(links, url);
            assert.deepEqual(data, { "data": "xyz", "url": "/a2" });
            getrssMock.verify();
            crawlRssListMock.verify();
        });

        it("should reject data when no rss links are present and no rss feeds for all links", async() => {
            let getrssMock = sandbox.mock(rssClientMock).expects("getRssData").thrice();
            getrssMock.returns(Promise.reject("error"));
            let crawlRssListMock = sandbox.mock(rssClientMock).expects("crawlRssList").thrice();
            crawlRssListMock.returns(Promise.reject("error"));
            let links = new Set();
            links.add("/a1");
            links.add("/a2");
            links.add("/a3");

            try {
                await rssClientMock.getCrawledRssData(links, url);
                assert.fail("should fail");
            } catch (err) {
                getrssMock.verify();
                crawlRssListMock.verify();
                assert.deepEqual(err, { "message": url + " is not a proper feed" });
            }
        });
    });

    describe("crawlRssList", () => {
        beforeEach("crawlRssList", () => {
            error = { "message": "feeds_not_found", "data": "<a href='/abc-rss'></a>" };
        });

        it("should fetch feeds if the link contains an href", async() => {
            let getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs("/abc-rss");
            getrssMock.returns(Promise.resolve(feed));

            try {
                let data = await rssClientMock.crawlRssList("/abc-rss", error, "http://www.example.com/abc-rss");
                assert.deepEqual(data, feed);
            } finally {
                rssClientMock.getRssData.restore();
            }
        });

        it("should throw an error when there is no rss in url", async () => {
            try {
                await rssClientMock.crawlRssList("/abc", error, "http://www.example.com/abc");
            } catch(err) {
                assert.deepEqual(err, "no rss found");
            }
        });
    });

    describe("getRssData", () => {
        beforeEach("getRssData", () => {
            url = "http://www.example.com";
        });

        it("it should return error when invalid request on url", async () => {
            nock(url)
              .get("/")
              .replyWithError("failed");

            try {
                await rssClientMock.getRssData(url);
            } catch (err) {
                assert.deepEqual(err.message, "Request failed for " + url);
            }
        });

        it("it should return feeds_not_found when parser doesn't return feeds", async() => {
            try {
                nock(url)
                  .get("/")
                  .reply(HttpResponseHandler.codes.OK, { "data": "sucess" });
                sandbox.stub(RssParser.prototype, "parse", () => Promise.reject("error"));

                await rssClientMock.getRssData(url);
            } catch (err) {
                assert.deepEqual(err.message, "feeds_not_found");
            }
        });

        it("it should return feeds when parser returns feeds", async() => {
            nock(url)
              .get("/")
              .reply(HttpResponseHandler.codes.OK, { "data": "sucess" });
            sandbox.stub(RssParser.prototype, "parse", () => Promise.resolve(feed));
            let res = await rssClientMock.getRssData(url);
            assert.equal(res, feed);
        });

        it("it should return bad_status_code when status code is not 200 ok", async() => {
            nock(url)
                .get("/rss")
                .reply(HttpResponseHandler.codes.NOT_FOUND, { "data": "error" });
            try {
                await rssClientMock.getRssData(url + "/rss");
                assert.fail("should throw exception");
            } catch (err) {
                assert.deepEqual(err, { "message": "Bad status code" });
            }
        });
    });

    describe("handleUrlError", () => {

        it("should throw url is not a proper feed error when handle_url_error is called", async() => {
            try {
                rssClientMock.handleUrlError(url);
            } catch (err) {
                assert.deepEqual(err, { "message": url + " is not a proper feed" });
            }
        });
    });

    describe("handleRequestError", () => {
        it("should throw request failed for url error when handle_request_error is called", async() => {
            try {
                rssClientMock.handleRequestError(url);
            } catch (err) {
                assert.deepEqual(err, { "message": "Request failed for " + url });
            }
        });
    });
});
