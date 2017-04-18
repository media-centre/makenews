import RssClient from "../../src/rss/RssClient";
import { assert } from "chai";
import sinon from "sinon";
import * as cheerio from "cheerio/lib/static";
import RssParser from "../../../server/src/rss/RssParser";
import nock from "nock";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import CouchClient from "../../src/CouchClient";
import * as LuceneClient from "../../src/LuceneClient";
import AdminDbClient from "../../src/db/AdminDbClient";
import { userDetails } from "./../../src/Factory";
import { isRejected } from "./../helpers/AsyncTestHelper";
import DateUtil from "../../src/util/DateUtil";

describe("RssClient", () => {
    let sandbox = null, rssClientMock = null, feed = null, error = null, url = null;

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
                const result = await rssClientMock.fetchRssFeeds(url);
                assert.deepEqual(result, feed);
            } catch (err) {
                assert.fail();
            } finally {
                rssClientMock.getRssData.restore();
            }
        });

        it("should call handleError when error message is other than FEEDS_NOT_FOUND ", async() => {
            const getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs(url);
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
            const getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs(url);
            getrssMock.returns(Promise.reject({ "message": "feeds_not_found", "data": [] }));
            const crawlForRssUrlMock = sinon.mock(rssClientMock).expects("crawlForRssUrl");
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
            const getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs(url);
            getrssMock.returns(Promise.reject({
                "message": "feeds_not_found",
                "data": "<link type='application/rss+xml' href='http://www.example.com'> <a href='http://www.example.com' ></a>"
            }));
            const getrssMockNew = sinon.mock(rssClientMock).expects("getFeedsFromRssUrl");
            getrssMockNew.returns(feed);

            try {
                const result = await rssClientMock.fetchRssFeeds(url);
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
            const getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs(url);
            getrssMock.returns(Promise.reject(error));

            try {
                await rssClientMock.getFeedsFromRssUrl("www.error.com", url);
            } catch (err) {
                assert.deepEqual(err, { "message": `Request failed for url: ${url}, error: ${JSON.stringify(error)}` });
            } finally {
                rssClientMock.getRssData.restore();
            }

        });

        it("should return feeds when rss data is  present", async() => {
            const getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs("http://www.example.com");
            getrssMock.returns(Promise.resolve(feed));

            try {
                const result = await rssClientMock.getFeedsFromRssUrl("http://www.example.com", "www.rss.com");
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
            const root = cheerio.load(error.data);

            try {
                await rssClientMock.crawlForRssUrl(root, url);
            } catch (err) {
                assert.deepEqual(err, { "message": url + " is not a proper feed" });
            }

        });

        it("should return error when rss links are present and no rss feeds ", async() => {
            error = { "message": "feeds_not_found", "data": "<a href='/abc'></a>" };
            const root = cheerio.load(error.data);
            const getrssMock = sinon.mock(rssClientMock).expects("getCrawledRssData");
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

        it("should return feeds when rss links are present and no rss feeds", async() => {
            const getrssMock = sandbox.mock(rssClientMock).expects("getRssData").once();
            getrssMock.returns(Promise.resolve({ "data": "xyz" }));
            const links = new Set();
            links.add("/a1");
            links.add("/a2");
            links.add("/a3");

            const data = await rssClientMock.getCrawledRssData(links, url);
            assert.deepEqual(data, { "data": "xyz", "url": "/a1" });
            getrssMock.verify();
        });

        it("should resolve data from crawl list when rss links are not present and no rss feeds ", async() => {
            const getrssMock = sandbox.mock(rssClientMock).expects("getRssData").once();
            getrssMock.returns(Promise.reject("error"));
            const crawlRssListMock = sandbox.mock(rssClientMock).expects("crawlRssList").once();
            crawlRssListMock.returns(Promise.resolve({ "data": "xyz", "url": "/a1sub" }));
            const links = new Set();
            links.add("/a1");
            links.add("/a2");
            links.add("/a3");

            const data = await rssClientMock.getCrawledRssData(links, url);
            assert.deepEqual(data, { "data": "xyz", "url": "/a1sub" });
            getrssMock.verify();
            crawlRssListMock.verify();
        });

        it("should resolve data for second link from crawl list when rss links are not present and no rss feeds for first link and rss links are present for second link ", async() => {
            const getrssMock = sandbox.mock(rssClientMock).expects("getRssData").twice();
            getrssMock.onFirstCall().returns(Promise.reject("error"))
                .onSecondCall().returns(Promise.resolve({ "data": "xyz" }));
            const crawlRssListMock = sandbox.mock(rssClientMock).expects("crawlRssList").once();
            crawlRssListMock.returns(Promise.reject("error"));
            const links = new Set();
            links.add("/a1");
            links.add("/a2");
            links.add("/a3");

            const data = await rssClientMock.getCrawledRssData(links, url);
            assert.deepEqual(data, { "data": "xyz", "url": "/a2" });
            getrssMock.verify();
            crawlRssListMock.verify();
        });

        it("should reject data when no rss links are present and no rss feeds for all links", async() => {
            const getrssMock = sandbox.mock(rssClientMock).expects("getRssData").thrice();
            getrssMock.returns(Promise.reject("error"));
            const crawlRssListMock = sandbox.mock(rssClientMock).expects("crawlRssList").thrice();
            crawlRssListMock.returns(Promise.reject("error"));
            const links = new Set();
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
            const getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs("/abc-rss");
            getrssMock.returns(Promise.resolve(feed));

            try {
                const data = await rssClientMock.crawlRssList("/abc-rss", error, "http://www.example.com/abc-rss");
                assert.deepEqual(data, feed);
            } finally {
                rssClientMock.getRssData.restore();
            }
        });

        it("should throw an error when there is no rss in url", async() => {
            try {
                await rssClientMock.crawlRssList("/abc", error, "http://www.example.com/abc");
            } catch (err) {
                assert.deepEqual(err.message, "no rss found");
            }
        });
    });

    describe("getRssData", () => {
        beforeEach("getRssData", () => {
            url = "http://www.example.com";
        });

        it("it should return error when invalid request on url", async() => {
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
                .reply(HttpResponseHandler.codes.OK, { "data": "success" });
            const since = 1234123412;
            sandbox.stub(DateUtil, "getCurrentTimeInSeconds").returns(since);

            const expectedFeeds = { "docs": feed, "title": "title", "paging": { "since": since } };
            sandbox.stub(RssParser.prototype, "parse", () => Promise.resolve({ "items": feed, "meta": { "title": "title" } }));

            const res = await rssClientMock.getRssData(url);

            assert.deepEqual(res, expectedFeeds);
        });

        it("it should return bad_status_code when status code is not 200 ok", async () => {
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
            const errorMessage = { "error": "error message" };
            try {
                rssClientMock.handleRequestError(url, errorMessage);
            } catch (err) {
                assert.deepEqual(err, { "message": `Request failed for url: ${url}, error: ${JSON.stringify(errorMessage)}` });
            }
        });
    });

    describe("addURL", () => {

        const sourceUrl = "http://www.newsclick.in";
        const accessToken = "test-token";
        const name = "test";
        const document = {
            "docType": "source",
            "sourceType": "web",
            "name": name,
            "url": sourceUrl
        };
        const existedDoc = {
            ...document,
            "url": sourceUrl + "/"
        };

        const rssClient = RssClient.instance();

        beforeEach("addURL", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("addURL", () => {
            sandbox.restore();
        });

        it("should fetch data and update common and user db", async () => {

            const fetchRssFeedsMock = sandbox.mock(rssClient).expects("fetchRssFeeds");
            fetchRssFeedsMock.withArgs(sourceUrl).returns(Promise.resolve({ "title": name }));

            const addURLtoCommonMock = sandbox.mock(rssClient).expects("addUrlToCommon")
                .withArgs(document).returns(Promise.resolve());

            const addURLtoUserMock = sandbox.mock(rssClient).expects("addURLToUser")
                .withArgs(document, accessToken).returns(Promise.resolve());

            const response = await rssClient.addURL(sourceUrl, accessToken);

            fetchRssFeedsMock.verify();
            addURLtoCommonMock.verify();
            addURLtoUserMock.verify();

            assert.deepEqual(response, { name, "url": sourceUrl });
        });

        it("should return error when fetchRss throws error", async () => {

            const fetchRssFeedsMock = sandbox.mock(rssClient).expects("fetchRssFeeds");
            fetchRssFeedsMock.withArgs(sourceUrl).returns(Promise.reject({ "message": sourceUrl + " is not a proper feed" }));
            try {
                await rssClient.addURL(sourceUrl, accessToken);
                assert.fail("Expected error");
            } catch(err) {
                fetchRssFeedsMock.verify();
                assert.strictEqual(sourceUrl + " is not a proper feed", err.message);
            }
        });

        it("should return error when addURLtoCommon throws error", async () => {

            const fetchRssFeedsMock = sandbox.mock(rssClient).expects("fetchRssFeeds");
            fetchRssFeedsMock.withArgs(sourceUrl).returns(Promise.resolve({ "title": name }));

            const addURLtoUserMock = sandbox.mock(rssClient).expects("addUrlToCommon")
                .withArgs(document).returns(Promise.reject("Unable to add the url"));

            try {
                await rssClient.addURL(sourceUrl, accessToken);
                assert.fail("Expected error");
            } catch(err) {
                fetchRssFeedsMock.verify();
                addURLtoUserMock.verify();

                assert.strictEqual(err, "Unable to add the url");
            }
        });

        it("should return error when addURLtoUser throws error", async () => {

            const fetchRssFeedsMock = sandbox.mock(rssClient).expects("fetchRssFeeds");
            fetchRssFeedsMock.withArgs(sourceUrl).returns(Promise.resolve({ "title": name }));

            const addURLtoUserMock = sandbox.mock(rssClient).expects("addUrlToCommon")
                .withArgs(document).returns(Promise.resolve());

            const addURLtoCommonMock = sandbox.mock(rssClient).expects("addURLToUser")
                .withArgs(document, accessToken).returns(Promise.reject("Unexpected response from the db"));

            try {
                await rssClient.addURL(sourceUrl, accessToken);
                assert.fail("Expected error");
            } catch(err) {
                fetchRssFeedsMock.verify();
                addURLtoUserMock.verify();
                addURLtoCommonMock.verify();

                assert.strictEqual(err, "Unexpected response from the db");
            }
        });

        it("should return conflict error if url already exists in both common and user db", async() => {

            const fetchRssFeedsMock = sandbox.mock(rssClient).expects("fetchRssFeeds");
            fetchRssFeedsMock.withArgs(sourceUrl).returns(Promise.resolve({ "title": name }));

            const addURLtoCommonMock = sandbox.mock(rssClient).expects("addUrlToCommon")
                .withArgs(document).returns(Promise.resolve(existedDoc.url));

            const addURLtoUserMock = sandbox.mock(rssClient).expects("addURLToUser")
                .returns(Promise.reject("URL already exist"));

            try {
                await rssClient.addURL(sourceUrl, accessToken);
                assert.fail("Expected error");
            } catch (err) {
                fetchRssFeedsMock.verify();
                addURLtoUserMock.verify();
                addURLtoCommonMock.verify();

                assert.strictEqual(err, "URL already exist");
            }
        });

        it("should add url to user db if it present in common db not in user db", async() => {
            const fetchRssFeedsMock = sandbox.mock(rssClient).expects("fetchRssFeeds");
            fetchRssFeedsMock.withExactArgs(sourceUrl).returns(Promise.resolve({ "title": name }));

            const addURLtoCommonMock = sandbox.mock(rssClient).expects("addUrlToCommon")
                .withExactArgs(document).returns(Promise.resolve(existedDoc.url));

            const addURLtoUserMock = sandbox.mock(rssClient).expects("addURLToUser")
                .withExactArgs(existedDoc, accessToken).returns(Promise.resolve());

            const result = await rssClient.addURL(sourceUrl, accessToken);

            fetchRssFeedsMock.verify();
            addURLtoUserMock.verify();
            addURLtoCommonMock.verify();

            assert.deepEqual(result, { name, "url": existedDoc.url });
        });

        it("should return Error If url is invalid", async() => {
            const fetchRssFeedsMock = sandbox.mock(rssClient).expects("fetchRssFeeds")
                .withArgs("http://www.test.com/")
                .returns(Promise.reject({ "message": "http://www.test.com/ is not a proper feed" }));
            try {
                await rssClient.addURL("http://www.test.com/");
                assert.fail();
            } catch (err) {
                fetchRssFeedsMock.verify();
                assert.deepEqual(err.message, "http://www.test.com/ is not a proper feed");
            }
        });
    });

    describe("addUrlToCommon", () => {
        let couchClient = null, adminDetailsMock = null, adminDbInstance = null;
        const sourceUrl = "http://www.test.com/rss";
        const extractedUrl = "test.com/rss";
        const urlName = "test name";

        const urlCombinations = [`http://${extractedUrl}`, `http://${extractedUrl}/`, `http://www.${extractedUrl}`, `http://www.${extractedUrl}/`,
            `https://${extractedUrl}`, `https://${extractedUrl}/`, `https://www.${extractedUrl}`, `https://www.${extractedUrl}/`];

        const selector = {
            "selector": {
                "docType": {
                    "$eq": "source"
                },
                "sourceType": {
                    "$eq": "web"
                },
                "_id": {
                    "$in": urlCombinations
                }
            }
        };

        beforeEach("addUrlToCommon", () => {
            sandbox = sinon.sandbox.create();
            const applicationConfig = new ApplicationConfig();
            sandbox.stub(ApplicationConfig, "instance").returns(applicationConfig);
            adminDetailsMock = sandbox.mock(applicationConfig).expects("adminDetails").returns({
                "username": "adminUser",
                "password": "adminPwd",
                "db": "adminDb"
            });
            couchClient = new CouchClient();
            adminDbInstance = sandbox.mock(AdminDbClient).expects("instance").withArgs("adminUser", "adminPwd", "adminDb").returns(Promise.resolve(couchClient));
        });

        afterEach("addUrlToCommon", () => {
            sandbox.restore();
        });

        it("should save the document if it is not exists", async () => {
            const document = { "name": urlName, "url": sourceUrl, "docType": "source", "sourceType": "web" };

            const findMock = sandbox.mock(couchClient).expects("findDocuments")
                .withExactArgs(selector).returns(Promise.resolve({ "docs": [] }));

            const saveDocMock = sandbox.mock(couchClient).expects("saveDocument");
            saveDocMock.withArgs(encodeURIComponent(document.url), document).returns(Promise.resolve({
                "ok": "true",
                "id": "test_name",
                "rev": "test_revision"
            }));

            await RssClient.instance().addUrlToCommon(document);

            adminDetailsMock.verify();
            adminDbInstance.verify();
            saveDocMock.verify();
            findMock.verify();
        });

        it("should not save the document if it exists", async () => {
            const document = { "name": urlName, "url": sourceUrl, "docType": "source", "sourceType": "web" };
            const existedDoc = { "name": urlName, "url": sourceUrl + "/", "docType": "source", "sourceType": "web" };

            const findMock = sandbox.mock(couchClient).expects("findDocuments")
                .withExactArgs(selector).returns(Promise.resolve({ "docs": [existedDoc] }));

            const response = await RssClient.instance().addUrlToCommon(document);

            adminDetailsMock.verify();
            adminDbInstance.verify();
            findMock.verify();

            assert.deepEqual(response, existedDoc.url);
        });

        it("should return the error response when server throws error while saving the document", async () => {
            const document = { "name": urlName, "url": sourceUrl, "docType": "source", "sourceType": "web" };


            const findMock = sandbox.mock(couchClient).expects("findDocuments")
                .withExactArgs(selector).returns(Promise.resolve({ "docs": [] }));

            const saveDocMock = sandbox.mock(couchClient).expects("saveDocument");
            saveDocMock.withArgs(encodeURIComponent(document.url), document).returns(Promise.reject({ "status": HttpResponseHandler.codes.BAD_REQUEST, "message": { "error": "unexpected response from db" } }));
            try {
                await RssClient.instance().addUrlToCommon(document);
                assert.fail("expected error");
            } catch (err) {
                adminDetailsMock.verify();
                adminDbInstance.verify();
                saveDocMock.verify();
                findMock.verify();

                assert.strictEqual("Unable to add the url", err);
            }
        });
    });
    
    describe("addURLToUser", () => {
        let couchClient = null, accessToken = "access token";
        let userDetailsMock = null;

        const urlName = "test name";

        beforeEach("addURLToUser", () => {
            accessToken = "test_token";
            sandbox = sinon.sandbox.create();
            userDetailsMock = sandbox.mock(userDetails).expects("getUser");
            userDetailsMock.withArgs(accessToken).returns({ "dbName": "dbName" });

            couchClient = new CouchClient(accessToken);
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(accessToken).returns(couchClient);

        });

        afterEach("addURLToUser", () => {
            sandbox.restore();
        });

        it("should save the document if it is not exists", async () => {
            url = "http://www.test.com/rss";
            const document = { "name": urlName, "url": url, "docType": "source", "sourceType": "web" };

            const saveDocMock = sandbox.mock(couchClient).expects("saveDocument");
            saveDocMock.withArgs(encodeURIComponent(document.url), document).returns(Promise.resolve({
                "ok": "true",
                "id": "test_name",
                "rev": "test_revision"
            }));

            await RssClient.instance().addURLToUser(document, accessToken);

            userDetailsMock.verify();
            saveDocMock.verify();
        });

        it("should return the error response when server throws error while saving the document", async () => {
            url = "http://www.test.com/rss";
            const document = { "name": urlName, "url": url, "docType": "source", "sourceType": "web" };

            const saveDocMock = sandbox.mock(couchClient).expects("saveDocument");
            saveDocMock.withArgs(encodeURIComponent(document.url), document).returns(Promise.reject({ "status": HttpResponseHandler.codes.BAD_REQUEST }));
            try {
                await RssClient.instance().addURLToUser(document, accessToken);
                assert.fail("expected error");
            } catch(err) {
                assert.strictEqual(err, "Unable to add the url");
            } finally {
                saveDocMock.verify();
            }
        });

        it("should throw error if url already exists in the user db", async () => {
            url = "http://www.test.com/rss";
            const document = { "name": urlName, "url": url, "docType": "source", "sourceType": "web" };

            const saveDocMock = sandbox.mock(couchClient).expects("saveDocument");
            saveDocMock.withArgs(encodeURIComponent(document.url), document).returns(Promise.reject({ "status": HttpResponseHandler.codes.CONFLICT }));
            try {
                await RssClient.instance().addURLToUser(document, accessToken);
                assert.fail("expected error");
            } catch (err) {
                assert.strictEqual(err, "URL already exist");
            } finally {
                saveDocMock.verify();
            }
        });
    });

    describe("Search URLS", () => {
        const limit = 25;
        beforeEach("RssClient", () => {
            sandbox = sinon.sandbox.create();
            const applicationConfig = new ApplicationConfig();
            sandbox.stub(ApplicationConfig, "instance").returns(applicationConfig);
            sandbox.stub(applicationConfig, "adminDetails").returns({
                "db": "adminDb"
            });
            sandbox.stub(applicationConfig, "searchEngineUrl").returns({
                "db": "http://188.166.166.121:5986/_fti/local"
            });
        });

        afterEach("RssClient", () => {
            sandbox.restore();
        });

        it("should return the searched URL Documents if the keyword is in name", async () => {
            const key = "Hindu";
            const skip = 100;

            const searchDocumentsMock = sandbox.mock(LuceneClient).expects("searchDocuments");
            const rssClient = RssClient.instance();
            const response = {
                "rows": [
                    {
                        "score": 1.326035976409912,
                        "id": "http://www.thehindu.com/?service=rss",
                        "fields": {
                            "name": "The Hindu - Home", "url": "http://www.thehindu.com/?service=rss"
                        }
                    },
                    {
                        "score": 1.326035976409912,
                        "id": "http://www.thehindu.com/news/international/?service=rss",
                        "fields": {
                            "name": "The Hindu - International",
                            "url": "http://www.thehindu.com/news/international/?service=rss"
                        }
                    }
                ]
            };

            const expectedOutput = {
                "docs": [
                    { "name": "The Hindu - Home", "url": "http://www.thehindu.com/?service=rss" },
                    {
                        "name": "The Hindu - International",
                        "url": "http://www.thehindu.com/news/international/?service=rss"
                    }
                ],
                "paging": { "offset": (skip + limit) }
            };

            const dbName = "adminDb", indexPath = "_design/webUrlSearch/by_name",
                query = { "q": `name:${key}* OR url:${key}*`, limit, skip };
            searchDocumentsMock.withArgs(dbName, indexPath, query).returns(Promise.resolve(response));
            const document = await rssClient.searchURL(key, skip);
            searchDocumentsMock.verify();
            assert.deepEqual(document, expectedOutput);
        });

        it("should return the searched URL Documents if the keyword is in url", async () => {
            const key = "thehindu";
            const skip = 100;

            const searchDocumentsMock = sandbox.mock(LuceneClient).expects("searchDocuments");
            const rssClient = RssClient.instance();
            const response = {
                "rows": [
                    {
                        "score": 1.326035976409912,
                        "id": "http://www.thehindu.com/?service=rss",
                        "fields": {
                            "name": "The Hindu - Home", "url": "http://www.thehindu.com/?service=rss"
                        }
                    },
                    {
                        "score": 1.326035976409912,
                        "id": "http://www.thehindu.com/news/international/?service=rss",
                        "fields": {
                            "name": "The Hindu - International",
                            "url": "http://www.thehindu.com/news/international/?service=rss"
                        }
                    }
                ]
            };

            const expectedOutput = {
                "docs": [
                    { "name": "The Hindu - Home", "url": "http://www.thehindu.com/?service=rss" },
                    {
                        "name": "The Hindu - International",
                        "url": "http://www.thehindu.com/news/international/?service=rss"
                    }
                ],
                "paging": { "offset": (skip + limit) }
            };

            const dbName = "adminDb", indexPath = "_design/webUrlSearch/by_name",
                query = { "q": `name:${key}* OR url:${key}*`, limit, skip };
            searchDocumentsMock.withArgs(dbName, indexPath, query).returns(Promise.resolve(response));
            const document = await rssClient.searchURL(key, skip);
            searchDocumentsMock.verify();
            assert.deepEqual(document, expectedOutput);
        });

        it("should return empty document if No documents found for the key", async() => {
            const key = "The Hindu";
            const skip = 100;

            const searchDocumentsMock = sandbox.mock(LuceneClient).expects("searchDocuments");
            const rssClient = RssClient.instance();
            const response = {
                "rows": [

                ]
            };

            const expectedOutput = {
                "docs": [

                ],
                "paging": { "offset": (skip + limit) }
            };

            const dbName = "adminDb", indexPath = "_design/webUrlSearch/by_name",
                query = { "q": `name:${key}* OR url:${key}*`, limit, skip };
            searchDocumentsMock.withArgs(dbName, indexPath, query).returns(Promise.resolve(response));
            const document = await rssClient.searchURL(key, skip);
            searchDocumentsMock.verify();
            assert.deepEqual(document, expectedOutput);
        });

        it("should return all documents when they enter for empty string", async() => {
            const key = "";
            const skip = 100;

            const searchDocumentsMock = sandbox.mock(LuceneClient).expects("searchDocuments");
            const rssClient = RssClient.instance();
            const response = {
                "rows": [
                    {
                        "score": 1.326035976409912,
                        "id": "http://www.thehindu.com/?service=rss",
                        "fields": {
                            "name": "The Hindu - Home", "url": "http://www.thehindu.com/?service=rss"
                        }
                    },
                    {
                        "score": 1.326035976409912,
                        "id": "http://www.thehindu.com/news/international/?service=rss",
                        "fields": {
                            "name": "The Hindu - International",
                            "url": "http://www.thehindu.com/news/international/?service=rss"
                        }
                    }
                ]
            };

            const expectedOutput = {
                "docs": [
                    { "name": "The Hindu - Home", "url": "http://www.thehindu.com/?service=rss" },
                    {
                        "name": "The Hindu - International",
                        "url": "http://www.thehindu.com/news/international/?service=rss"
                    }
                ],
                "paging": { "offset": (skip + limit) }
            };

            let dbName = "adminDb", indexPath = "_design/webUrlSearch/by_name",
                query = { "q": "*:*", limit, skip };
            searchDocumentsMock.withArgs(dbName, indexPath, query).returns(Promise.resolve(response));
            const document = await rssClient.searchURL(key, skip);
            searchDocumentsMock.verify();
            assert.deepEqual(document, expectedOutput);
        });

        it("should reject with an error when couchdb throws an error", async() => {
            const key = "The Hindu";
            const skip = 100;

            const searchDocumentsMock = sandbox.mock(LuceneClient).expects("searchDocuments");
            const rssClient = RssClient.instance();

            const dbName = "adminDb", indexPath = "_design/webUrlSearch/by_name",
                query = { "q": `name:${key}* OR url:${key}*`, limit, skip };
            searchDocumentsMock.withArgs(dbName, indexPath, query).returns(Promise.reject("Unexpected Repsonse from DB"));

            await isRejected(rssClient.searchURL(key, skip), { "message": `Request failed for url: ${key}, error: "Unexpected Repsonse from DB"` });
        });
    });
});
