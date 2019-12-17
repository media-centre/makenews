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
            const key = "the";
            const offSet = 0;
            const rssRequestHandler = RssRequestHandler.instance();
            const rssMock = new RssClient();
            sandbox.mock(RssClient).expects("instance").returns(rssMock);
            const rssClientMock = sandbox.mock(rssMock).expects("searchURL");
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
                const document = await rssRequestHandler.searchUrl(key, offSet);
                const zero = 0;
                assert.strictEqual("url1 test", document.docs[zero].name);
                rssClientMock.verify();
            } catch (err) {
                assert.fail(err);
            }
        });

        it("should reject with an error if the URL document rejects with an error", async() => {
            const key = "Error";
            const offSet = 5;
            const rssMock = new RssClient();
            sandbox.mock(RssClient).expects("instance").returns(rssMock);
            const rssClientMock = sandbox.mock(rssMock).expects("searchURL");
            rssClientMock.withExactArgs(key, offSet).returns(Promise.reject("No selector found"));
            const rssRequestHandler = RssRequestHandler.instance();
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
        let rssRequestHandler = null;
        let rssClient = null;
        let rssClientMock = null;
        let sandbox = null;
        beforeEach("fetchBatchRssFeedsRequest", () => {
            sandbox = sinon.sandbox.create();
            rssRequestHandler = new RssRequestHandler();
            rssClient = new RssClient();
            rssClientMock = sandbox.mock(RssClient).expects("instance").returns(rssClient);
        });

        afterEach("fetchBatchRssFeedsRequest", () => {
            sandbox.restore();
        });

        it("should fetch rss feed for given url", async() => {
            const url = "www.example.com";
            const response = {
                "docs":
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
                }],
                "paging": {
                    "since": 123412312
                }
            };
            const rssClientPostMock = sandbox.mock(rssClient).expects("getRssData");
            rssClientPostMock.withArgs(url).returns(response);

            const feeds = await rssRequestHandler.fetchBatchRssFeedsRequest(url);

            rssClientMock.verify();
            rssClientPostMock.verify();

            expect(feeds).to.deep.equal(response);
        });

        it("should return error rss feed for given url", () => {
            const url = "www.error.com";
            const rssClientPostMock = sandbox.mock(rssClient).expects("getRssData");
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
            const url = "http://www.newsclick.in";
            const name = "NewsClick";
            const accessToken = "tes_token";
            const rssMock = new RssClient();
            sandbox.mock(RssClient).expects("instance").returns(rssMock);
            sandbox.mock(rssMock).expects("addURL").withArgs(url, accessToken).returns(Promise.resolve({ name, url }));
            const rssRequestHandler = new RssRequestHandler();
            try {
                const response = await rssRequestHandler.addURL(url, accessToken);
                assert.deepEqual({ name, url }, response);
            }catch (error) {
                assert.fail(error);
            }
        });

        it("should return Error If url is invalid", async() => {
            const accessToken = "test_token";
            const url = "http://www.newsclick.in";
            const rssMock = new RssClient();
            sandbox.mock(RssClient).expects("instance").returns(rssMock);
            sandbox.mock(rssMock).expects("addURL").withArgs(url, accessToken).returns(Promise.reject("unexpected response from the db"));
            const rssRequestHandler = new RssRequestHandler();
            try {
                await rssRequestHandler.addURL(url, accessToken);
                assert.fail();
            }catch(error) {
                assert.strictEqual("unexpected response from the db", error);
            }
        });
    });
});
