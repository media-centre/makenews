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
            let body = {
                "selector": {
                    "url": {
                        "$eq": "the"
                    }
                }
            };
            let rssRequestHandler = RssRequestHandler.instance();
            let rssMock = new RssClient();
            sandbox.mock(RssClient).expects("instance").returns(rssMock);
            let rssClientMock = sandbox.mock(rssMock).expects("searchURL");
            rssClientMock.withArgs(body).returns(Promise.resolve({
                "docs": [{
                    "_id": "1",
                    "docType": "test",
                    "sourceType": "web",
                    "name": "url1 test",
                    "url": "http://www.thehindu.com/news/international/?service=rss"
                },
                {
                    "_id": "2",
                    "docType": "test",
                    "sourceType": "web",
                    "name": "url test",
                    "url": "http://www.thehindu.com/sport/?service=rss"
                }]
            }));
            try {
                let document = await rssRequestHandler.searchUrl(body);
                const zero = 0;
                assert.strictEqual("web", document.docs[zero].sourceType);
            }catch (err) {
                assert.fail(err);
            }
        });

        it("should reject with an error if the URL document rejects with an error", async() => {
            let body = null;
            let rssMock = new RssClient();
            sandbox.mock(RssClient).expects("instance").returns(rssMock);
            let rssClientMock = sandbox.mock(rssMock).expects("searchURL");
            rssClientMock.withArgs(body).returns(Promise.reject("No selector found"));
            let rssRequestHandler = RssRequestHandler.instance();
            try {
                await rssRequestHandler.searchUrl(body);
                assert.fail();
            }catch (err) {
                assert.strictEqual("No selector found", err);
            }
        });
    });

    describe("RssRequestHandler", () => {
        let sandbox = null;
        describe("fetchRssFeedRequest", ()=> {
            let rssRequestHandler, feedsJson, rssMock, rssClientMock;
            beforeEach("fetchRssFeedsRequest", () => {
                sandbox = sinon.sandbox.create();
                rssRequestHandler = new RssRequestHandler();
                feedsJson = {
                    "items": [{
                        "guid": "http://www.nasa.gov/press-release/nasa-administrator-remembers-apollo-era-astronaut-edgar-mitchell",
                        "title": "NASA Administrator Remembers Apollo-Era Astronaut Edgar Mitchell",
                        "link": "http://www.nasa.gov/press-release/nasa-administrator-remembers-apollo-era-astronaut-edgar-mitchell",
                        "description": "The following is a statement from NASA Administrator Charles Bolden on the passing of NASA astronaut Edgar Mitchell:",
                        "pubDate": null,
                        "enclosures": [],
                        "image": {}
                    }]
                };
                rssMock = new RssClient();
                rssClientMock = sandbox.mock(RssClient).expects("instance").returns(rssMock);
            });

            afterEach("fetchRssFeedRequest", () => {
                sandbox.restore();
            });

            it("should fetch rss feed for given url", () => {
                let url = "www.example.com";
                let rssClientPostMock = sandbox.mock(rssMock).expects("fetchRssFeeds").withArgs(url);
                rssClientPostMock.returns(feedsJson);
                return Promise.resolve(rssRequestHandler.fetchRssFeedRequest(url)).then((feeds) => {
                    expect(feeds).to.eq(feedsJson);
                    rssClientMock.verify();
                    rssClientPostMock.verify();
                });
            });

            it("should return error rss feed for given url", () => {
                let url = "www.error.com";
                let rssClientPostMock = sandbox.mock(rssMock).expects("fetchRssFeeds").withArgs(url);
                rssClientPostMock.returns(Promise.reject("error"));
                return rssRequestHandler.fetchRssFeedRequest(url).catch((error) => {
                    assert.strictEqual("error", error);
                    rssClientMock.verify();
                    rssClientPostMock.verify();
                });
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

        it("should return the sucess response for correct URL Document", async() => {
            let url = "http://www.newsclick.in";
            let rssMock = new RssClient();
            sandbox.mock(RssClient).expects("instance").returns(rssMock);
            sandbox.mock(rssMock).expects("addURL").withArgs(url).returns(Promise.resolve({ "message": "URL added to Database" }));
            let rssRequestHandler = new RssRequestHandler();
            try {
                let response = await rssRequestHandler.addURL(url);
                assert.strictEqual("URL added to Database", response.message);
            }catch (error) {
                assert.fail(error);
            }
        });

        it("should return Error If url is invalid", async() => {

            let url = "http://www.newsclick.in";
            let rssMock = new RssClient();
            sandbox.mock(RssClient).expects("instance").returns(rssMock);
            sandbox.mock(rssMock).expects("addURL").withArgs(url).returns(Promise.reject("unexpected response from the db"));
            let rssRequestHandler = new RssRequestHandler();
            try {
                await rssRequestHandler.addURL(url);
                assert.fail();
            }catch(error) {
                assert.strictEqual("unexpected response from the db", error);
            }
        });
    });

    describe("Add URL To User Database", () => {
        let sandbox = null;
        beforeEach("Add URL To User Database", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("Add URL To User Database", () => {
            sandbox.restore();
        });

        it("should return the sucess response for correct URL Document", async() => {
            let url = "http://www.newsclick.in";
            let rssMock = new RssClient();
            let accessToken = "TestAccessToken";
            let userName = "test";
            sandbox.mock(RssClient).expects("instance").returns(rssMock);
            sandbox.mock(rssMock).expects("addURLToUserDb").withArgs(accessToken, url, userName).returns(Promise.resolve({ "message": "URL added to Database" }));
            let rssRequestHandler = new RssRequestHandler();
            try {
                let response = await rssRequestHandler.addURLToUserDb(accessToken, url, userName);
                assert.strictEqual("URL added to Database", response.message);
            }catch (error) {
                assert.fail(error);
            }
        });

        it("should return Error If url is invalid", async() => {
            let accessToken = "TestAccessToken";
            let userName = "test";
            let url = "http://www.newsclick.in";
            let rssMock = new RssClient();
            sandbox.mock(RssClient).expects("instance").returns(rssMock);
            sandbox.mock(rssMock).expects("addURLToUserDb").withArgs(accessToken, url, userName).returns(Promise.reject("unexpected response from the db"));
            let rssRequestHandler = new RssRequestHandler();
            try {
                await rssRequestHandler.addURLToUserDb(accessToken, url, userName);
                assert.fail();
            }catch(error) {
                assert.strictEqual("unexpected response from the db", error);
            }
        });
    });
});
