/* eslint init-declarations:0*/

import RssRequestHandler from "../../../server/src/rss/RssRequestHandler";
import { assert, expect } from "chai";
import RssClient from "../../src/rss/RssClient";
import sinon from "sinon";

describe("Rss Request Handler", () => {
    describe("search Url", () => {
        let sandbox = null;
        beforeEach("Rss Request Handler", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("Rss Request Handler", () => {
            sandbox.restore();
        });
        it("should return the default URL Document", async() => {
            let key = "the";
            let offSet = 0;
            let rssRequestHandler = RssRequestHandler.instance();
            let rssMock = new RssClient();
            sandbox.mock(RssClient).expects("instance").returns(rssMock);
            let rssClientMock = sandbox.mock(rssMock).expects("searchURL");
            rssClientMock.withExactArgs(key, offSet).returns(Promise.resolve({
                "docs": [{
                    "name": "url1 test",
                    "url": "http://www.thehindu.com/news/international/?service=rss"
                },
                {
                    "name": "url test",
                    "url": "http://www.thehindu.com/sport/?service=rss"
                }]
            }));
            try {
                let document = await rssRequestHandler.searchUrl(key, offSet);
                const zero = 0;
                assert.strictEqual("url1 test", document.docs[zero].name);
                rssClientMock.verify();
            } catch (err) {
                assert.fail(err);
            }
        });

        it("should reject with an error if the URL document rejects with an error", async() => {
            let key = "Error";
            let offSet = 5;
            let rssMock = new RssClient();
            sandbox.mock(RssClient).expects("instance").returns(rssMock);
            let rssClientMock = sandbox.mock(rssMock).expects("searchURL");
            rssClientMock.withExactArgs(key, offSet).returns(Promise.reject("No selector found"));
            let rssRequestHandler = RssRequestHandler.instance();
            try {
                await rssRequestHandler.searchUrl(key, offSet);
                assert.fail();
            }catch (err) {
                assert.strictEqual("No selector found", err);
                rssClientMock.verify();
            }
        });
    });

    describe("fetchBatchRssFeedsRequest", ()=> {
        let rssRequestHandler = null, rssClient = null, rssClientMock = null, sandbox = null;
        beforeEach("fetchBatchRssFeedsRequest", () => {
            sandbox = sinon.sandbox.create();
            rssRequestHandler = new RssRequestHandler();
            rssClient = new RssClient();
            rssClientMock = sandbox.mock(RssClient).expects("instance").returns(rssClient);
        });

        afterEach("fetchBatchRssFeedsRequest", () => {
            sandbox.restore();
        });

        it("should fetch rss feed for given url", async () => {
            let url = "www.example.com";
            let response = {
                "items":
                [{
                    "_id": "test-guid-1",
                    "guid": "test-guid-1",
                    "title": "NASA Administrator Remembers Apollo-Era Astronaut Edgar Mitchell",
                    "link": "http://www.nasa.gov/press-release/nasa-administrator-remembers-apollo-era-astronaut-edgar-mitchell",
                    "description": "The following is a statement from NASA Administrator Charles Bolden on the passing of NASA astronaut Edgar Mitchell:",
                    "pubDate": null,
                    "enclosures": [],
                    "docType": "feed",
                    "sourceType": "web",
                    "sourceUrl": url,
                    "tags": [null],
                    "images": []
                }]
            };
            let rssClientPostMock = sandbox.mock(rssClient).expects("getRssData");
            rssClientPostMock.withArgs(url).returns(response);

            let feeds = await rssRequestHandler.fetchBatchRssFeedsRequest(url);

            expect(feeds).to.deep.equal(response.items);
            rssClientMock.verify();
            rssClientPostMock.verify();
        });

        it("should return error rss feed for given url", () => {
            let url = "www.error.com";
            let rssClientPostMock = sandbox.mock(rssClient).expects("getRssData");
            rssClientPostMock.withArgs(url).returns(Promise.reject("error"));
            return rssRequestHandler.fetchBatchRssFeedsRequest(url, "auth_token").catch((error) => {
                assert.strictEqual("error", error);
                rssClientMock.verify();
                rssClientPostMock.verify();
            });
        });
    });

    describe("Add URL Document", () => {
        let sandbox = null;
        beforeEach("Add URL Document", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("Add URL Document", () => {
            sandbox.restore();
        });

        it("should return name and url for correct URL Document", async() => {
            let url = "http://www.newsclick.in";
            let name = "NewsClick";
            let accessToken = "tes_token";
            let rssMock = new RssClient();
            sandbox.mock(RssClient).expects("instance").returns(rssMock);
            sandbox.mock(rssMock).expects("addURL").withArgs(url, accessToken).returns(Promise.resolve({ name, url }));
            let rssRequestHandler = new RssRequestHandler();
            try {
                let response = await rssRequestHandler.addURL(url, accessToken);
                assert.deepEqual({ name, url }, response);
            }catch (error) {
                assert.fail(error);
            }
        });

        it("should return Error If url is invalid", async() => {
            let accessToken = "test_token";
            let url = "http://www.newsclick.in";
            let rssMock = new RssClient();
            sandbox.mock(RssClient).expects("instance").returns(rssMock);
            sandbox.mock(rssMock).expects("addURL").withArgs(url, accessToken).returns(Promise.reject("unexpected response from the db"));
            let rssRequestHandler = new RssRequestHandler();
            try {
                await rssRequestHandler.addURL(url, accessToken);
                assert.fail();
            }catch(error) {
                assert.strictEqual("unexpected response from the db", error);
            }
        });
    });
});
