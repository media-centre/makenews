import RssRequestHandler from "../../../server/src/rss/RssRequestHandler";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import LogTestHelper from "../helpers/LogTestHelper";
import CouchClient from "../../src/CouchClient";
import AdminDbClient from "../../src/db/AdminDbClient";
import { assert, expect } from "chai";
import RssClient from "../../src/rss/RssClient";
import sinon from "sinon";

describe("Rss Request Handler", () => {
    let sandbox = null, couchClient = null;
    beforeEach("Rss Request Handler", () => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(RssRequestHandler, "logger").returns(LogTestHelper.instance());
        let applicationConfig = new ApplicationConfig();
        sandbox.stub(ApplicationConfig, "instance").returns(applicationConfig);
        sandbox.stub(applicationConfig, "adminDetails").returns({
            "username": "adminUser",
            "password": "adminPwd",
            "db": "adminDb"
        });
        couchClient = new CouchClient();
        sandbox.stub(AdminDbClient, "instance").withArgs("adminUser", "adminPwd", "adminDb").returns(Promise.resolve(couchClient));
    });

    afterEach("FacebookAccessToken", () => {
        sandbox.restore();
    });

    it("should return the default URL Document", (done) => {
        let body = {
            "selector": {
                "url": {
                    "$eq": "the"
                }
            }
        };
        let rssRequestHandler = RssRequestHandler.instance();
        let getDocStub = sinon.stub(couchClient, "getUrlDocument");
        getDocStub.withArgs(body).returns(Promise.resolve({
            "docs": [{
                _id: '1',
                docType: 'test',
                sourceType: 'web',
                name: 'url1 test',
                url: 'http://www.thehindu.com/news/international/?service=rss'
            },
                {
                    _id: '2',
                    docType: 'test',
                    sourceType: 'web',
                    name: 'url test',
                    url: 'http://www.thehindu.com/sport/?service=rss'
                }]
        }));
        rssRequestHandler.searchUrl(body).then(document => {
            assert.strictEqual("web", document.docs[0].sourceType);
            done();
        })
    });

    it("should reject with an error if the URL document rejects with an error", (done) => {
        let body = null;
        let rssRequestHandler = RssRequestHandler.instance();
        let getDocStub = sinon.stub(couchClient, "getUrlDocument");
        getDocStub.withArgs(body).returns(Promise.reject("No selector found"));
        rssRequestHandler.searchUrl(body).catch((error) => {
            assert.strictEqual("No selector found", error);
            done();
        });
    });

    describe("RssRequestHandler", () => {
        describe("fetchRssFeedRequest", ()=> {
            let rssRequestHandler, feedsJson, rssMock, rssClientMock, sandbox;
            beforeEach("fetchRssFeedsRequest", () => {
                rssRequestHandler = new RssRequestHandler();
                sandbox = sinon.sandbox.create();
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

            it("should fetch rss feed for given url", () => {
                let url = "www.example.com";
                let rssClientPostMock = sandbox.mock(rssMock).expects("fetchRssFeeds").withArgs(url)
                rssClientPostMock.returns(feedsJson);
                return Promise.resolve(rssRequestHandler.fetchRssFeedRequest(url)).then((feeds) => {
                    expect(feeds).to.eq(feedsJson);
                    rssClientMock.verify();
                    rssClientPostMock.verify();
                    sandbox.restore();
                });
            });

            it("should return error rss feed for given url", () => {
                let url = "www.error.com";
                let rssClientPostMock = sandbox.mock(rssMock).expects("fetchRssFeeds").withArgs(url)
                rssClientPostMock.returns(Promise.reject("error"));
                return rssRequestHandler.fetchRssFeedRequest(url).catch((error) => {
                    assert.strictEqual("error", error);
                    rssClientMock.verify();
                    rssClientPostMock.verify();
                    sandbox.restore();
                });
            });
        });
    });
});
