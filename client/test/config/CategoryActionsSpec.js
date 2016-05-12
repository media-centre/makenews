/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] no-unused-vars:0*/

"use strict";
import { populateCategoryDetails, DISPLAY_CATEGORY, createCategory, updateCategoryName, createDefaultCategory, addRssUrlAsync, addTwitterUrlAsync, TWITTER_TYPE } from "../../src/js/config/actions/CategoryActions.js";
import CategoryDb from "../../src/js/config/db/CategoryDb.js";
import SourceDb from "../../src/js/config/db/SourceDb.js";
import { displayAllCategoriesAsync } from "../../src/js/config/actions/AllCategoriesActions.js";
import Source, { STATUS_INVALID, STATUS_VALID } from "../../src/js/config/Source.js";
import Category from "../../src/js/config/Category.js";
import AjaxClient from "../../src/js/utils/AjaxClient";
import UserSession from "../../src/js/user/UserSession.js";
import TwitterDb from "../../src/js/twitter/TwitterDb";
import RssFeeds from "../../src/js/rss/RssFeeds";
import mockStore from "../helper/ActionHelper.js";
import RssDb from "../../src/js/rss/RssDb.js";
import AppSessionStorage from "../../src/js/utils/AppSessionStorage";
import { expect, assert } from "chai";
import sinon from "sinon";

describe("CategoryActions", () => {
    describe("populateCategoryDetails", () => {
        it("return type DISPLAY_CATEGORY action", function() {
            let sourceUrlsObj = { "rss": {}, "facebook": {}, "twitter": {} };
            expect(populateCategoryDetails(sourceUrlsObj)).to.deep.equal(
                                { "type": DISPLAY_CATEGORY, sourceUrlsObj });
        });
    });
});

describe("addRssUrlAsync", () => {
    let sandbox = null, categorySourceConfig = null, ajaxGetMock = null, ajaxInstanceMock = null, type = null, userSession = null;
    let url = null, categoryId = null, allSources = null, sourceSaveMock = null;

    beforeEach("addRssUrlAsync", () => {
        sandbox = sinon.sandbox.create();
        userSession = new UserSession();
        sandbox.stub(UserSession, "instance").returns(userSession);
        sandbox.stub(userSession, "continueSessionIfActive");
        let ajaxMock = new AjaxClient("/rss-feeds");
        ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");
        ajaxInstanceMock.withArgs("/rss-feeds").returns(ajaxMock);
        ajaxGetMock = sandbox.mock(ajaxMock).expects("get");
    });

    afterEach("addRssUrlAsync", () => {
        ajaxInstanceMock.verify();
        ajaxGetMock.verify();
        sandbox.restore();
    });

    before("Before", () => {
        type = "rss";
        categoryId = "categoryId";
        url = "www.hindu.com";
        allSources = [{ "url": url, "docType": "sources" }];
        categorySourceConfig = {
            "sources": {
                "rss": { "name": "RSS", "details": [] },
                "facebook": { "name": "Facebook", "details": [] },
                "twitter": { "name": "Twitter", "details": [] }
            }
        };
    });

    it("should create rss and dispatch populateCategoryDetailsAsync", (done) => {
        let responseJson = { "items": [{ "title": "hindu football", "pubDate": "2016-01-01T22:09:28+00:00" }, { "title": "cricket", "pubDate": "2016-01-01T22:09:28+00:00" }], "meta": { "title": "hindu" } };
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.resolve(responseJson));

        sandbox.stub(SourceDb, "fetchSortedSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));
        let latestFeedTimestamp = "2016-01-01T22:09:28Z";
        let sourceDetails = { "categoryIds": [categoryId], "sourceType": type, "url": url, "status": STATUS_VALID, "latestFeedTimestamp": latestFeedTimestamp };
        let source = new Source(sourceDetails);
        sandbox.stub(Source, "instance").withArgs(sourceDetails).returns(source);
        sandbox.mock(source).expects("save").returns(Promise.resolve({ "id": "testdocument1" }));
        let rssFeeds = new RssFeeds(responseJson);
        sandbox.stub(RssFeeds, "instance").withArgs(responseJson).returns(rssFeeds);
        let rssFeedsParseMock = sandbox.mock(rssFeeds).expects("parse").returns(true);
        let rssFeedsSaveMock = sandbox.mock(rssFeeds).expects("save").withArgs("testdocument1").returns(Promise.resolve("success"));

        let verify = function(status) {
            assert.strictEqual(status, "valid");
            rssFeedsParseMock.verify();
            rssFeedsSaveMock.verify();
            done();
        };
        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        //done should be called in callback instead of here. Passing dummy function not to call done.
        const store = mockStore(categorySourceConfig, expectedActions, function() {});
        store.dispatch(addRssUrlAsync(categoryId, url, verify));
    });

    it("should not create rss if the url fetch returns invalid response", () => {
        let source = new Source({});
        sandbox.stub(Source, "instance").withArgs({}).returns(source);
        sourceSaveMock = sandbox.mock(source).expects("save").never();
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.reject("error"));
        const store = mockStore(categorySourceConfig, []);
        store.dispatch(addRssUrlAsync(categoryId, url));
        sourceSaveMock.verify();
    });

    it("should create rss with valid status on successful fetch", (done) => {
        let latestFeedTimestamp = "2016-01-01T22:09:28Z";
        let responseJson = { "items": [{ "title": "hindu football", "pubDate": latestFeedTimestamp }], "meta": { "title": "hindu" } };
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.resolve(responseJson));

        sandbox.stub(SourceDb, "fetchSortedSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));
        let rssFeeds = new RssFeeds(responseJson);
        sandbox.stub(RssFeeds, "instance").withArgs(responseJson).returns(rssFeeds);
        sandbox.stub(rssFeeds, "parse").returns(true);
        sandbox.stub(rssFeeds, "save").returns(Promise.resolve("success"));

        let sourceDetails = { "latestFeedTimestamp": latestFeedTimestamp, "categoryIds": [categoryId], "sourceType": type, "url": url, "status": STATUS_VALID };
        let source = new Source(sourceDetails);
        sandbox.stub(Source, "instance").withArgs(sourceDetails).returns(source);
        sourceSaveMock = sandbox.mock(source).expects("save").returns(Promise.resolve({ "id": "testdocument1" }));
        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        const store = mockStore(categorySourceConfig, expectedActions, function() {});
        let verify = function(status) {
            assert.strictEqual(status, "valid");
            sourceSaveMock.verify();
            done();
        };

        store.dispatch(addRssUrlAsync(categoryId, url, verify));
    });

    it("should create rss with invalid status if url is invalid", (done) => {
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.reject("error"));

        sandbox.stub(SourceDb, "fetchSortedSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));

        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        const store = mockStore(categorySourceConfig, expectedActions);
        return Promise.resolve(store.dispatch(addRssUrlAsync(categoryId, url, (response)=> {
            assert.strictEqual("invalid", response);
            done();
        })));
    });

    it("should create rss source and then create the feeds", (done) => {
        let latestFeedTimestamp = "2016-01-01T22:09:28Z";
        let responseJson = { "items": [{ "title": "hindu football", "pubDate": latestFeedTimestamp }, { "title": "cricket", "pubDate": latestFeedTimestamp }], "meta": { "title": "hindu" } };
        let sourceId = "sourceId";
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.resolve(responseJson));

        sandbox.stub(SourceDb, "fetchSortedSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));
        let sourceDetails = { "categoryIds": [categoryId], "sourceType": type, "url": url, "status": STATUS_VALID, "latestFeedTimestamp": latestFeedTimestamp };
        let source = new Source(sourceDetails);
        sandbox.stub(Source, "instance").withArgs(sourceDetails).returns(source);
        sourceSaveMock = sandbox.mock(source).expects("save").returns(Promise.resolve({ "id": "testdocument1" }));
        let rssFeeds = new RssFeeds(responseJson);
        sandbox.stub(RssFeeds, "instance").withArgs(responseJson).returns(rssFeeds);
        sandbox.stub(rssFeeds, "parse").returns(true);
        sandbox.stub(rssFeeds, "save").returns(Promise.resolve("success"));

        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        const store = mockStore(categorySourceConfig, expectedActions, function() {});
        let verify = function(status) {
            assert.strictEqual(status, "valid");
            sourceSaveMock.verify();
            done();
        };
        store.dispatch(addRssUrlAsync(categoryId, url, verify));
    });

    it("should create rss source with latestFeedTimeStamp from the feed response", (done) => {

        let sourceId = "sourceId";

        let responseJson = { "items": [{ "title": "hindu football", "pubDate": "2016-01-01T22:09:28+00:00" }, { "title": "cricket", "pubDate": "2016-01-01T22:09:28+00:00" }], "meta": { "title": "hindu" } };
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.resolve(responseJson));

        sandbox.stub(SourceDb, "fetchSortedSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));
        let latestFeedTimestamp = "2016-01-01T22:09:28Z";
        let sourceDetails = { "categoryIds": [categoryId], "sourceType": type, "url": url, "status": STATUS_VALID, "latestFeedTimestamp": latestFeedTimestamp };
        let source = new Source(sourceDetails);
        sandbox.stub(Source, "instance").withArgs(sourceDetails).returns(source);
        sourceSaveMock = sandbox.mock(source).expects("save").returns(Promise.resolve({ "id": "testdocument1" }));
        let rssFeeds = new RssFeeds(responseJson);
        sandbox.stub(RssFeeds, "instance").withArgs(responseJson).returns(rssFeeds);
        sandbox.stub(rssFeeds, "parse").returns(true);
        sandbox.stub(rssFeeds, "save").returns(Promise.resolve("success"));

        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        const store = mockStore(categorySourceConfig, expectedActions, function() {});
        let verify = function(status) {
            assert.strictEqual(status, "valid");
            sourceSaveMock.verify();
            done();
        };
        store.dispatch(addRssUrlAsync(categoryId, url, verify));
    });
});

describe("addTwitterUrlAsync", () => {
    let sandbox = null, categorySourceConfig = null, ajaxGetMock = null, ajaxInstanceMock = null, url = null, type = null, categoryId = null, userName = null;

    beforeEach("Before", () => {
        sandbox = sinon.sandbox.create();
        let userSession = new UserSession();
        sandbox.stub(UserSession, "instance").returns(userSession);
        sandbox.stub(userSession, "continueSessionIfActive");
        let ajaxMock = new AjaxClient("/twitter-feeds");
        userName = "Maharjun";
        ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");
        ajaxInstanceMock.withArgs("/twitter-feeds").returns(ajaxMock);
        ajaxGetMock = sandbox.mock(ajaxMock).expects("get");
        sandbox.stub(AppSessionStorage, "instance").returns({ "getValue": () => {
            return userName;
        } });
    });

    before("Before", () => {
        type = TWITTER_TYPE;
        categoryId = "categoryId";
        url = "@the_hindu";
        categorySourceConfig = {
            "sources": {
                "rss": { "name": "RSS", "details": [] },
                "facebook": { "name": "Facebook", "details": [] },
                "twitter": { "name": "Twitter", "details": [] }
            }
        };
    });

    it("should create twitter document with valid status on successful fetch", (done) => {
        let allSources = [{ "url": url, "docType": "sources" }];

        let twitterFeed = { "statuses": [{ "id": 1, "id_str": "123", "text": "Tweet 1", "created_at": "2016-01-06T02:15:53.000Z" }, { "id": 2, "id_str": "124", "text": "Tweet 2", "created_at": "2016-01-05T02:15:53.000Z" }] };
        ajaxGetMock.withArgs({ "url": url, "userName": userName }).returns(Promise.resolve(twitterFeed));
        sandbox.stub(SourceDb, "fetchSortedSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));
        let sourceDetails = { "categoryIds": [categoryId], "sourceType": type, "url": url, "status": STATUS_VALID, "latestFeedTimestamp": "2016-01-06T02:15:53Z" },
            source = new Source(sourceDetails);
        sandbox.stub(Source, "instance").withArgs(sourceDetails).returns(source);
        let sourceSaveMock = sandbox.mock(source).expects("save").returns(Promise.resolve("response"));
        let twitterDbMock = sandbox.mock(TwitterDb).expects("addTweets");
        twitterDbMock.withArgs(twitterFeed.statuses).returns(Promise.resolve("response"));

        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        const store = mockStore(categorySourceConfig, expectedActions, done);
        return Promise.resolve(store.dispatch(addTwitterUrlAsync(categoryId, url, () => { }))).then(() => {
            sourceSaveMock.verify();
            twitterDbMock.verify();
        });
    });

    it("should create twitter document with invalid status if url is invalid", (done) => {
        let allSources = [{ "url": url, "docType": "sources" }];
        ajaxGetMock.withArgs({ "url": url, "userName": userName }).returns(Promise.reject("error"));
        sandbox.stub(SourceDb, "fetchSortedSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));
        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        const store = mockStore(categorySourceConfig, expectedActions);
        return Promise.resolve(store.dispatch(addTwitterUrlAsync(categoryId, url, (response) => {
            assert.strictEqual("invalid", response);
            done();
        })));
    });

    afterEach("After Each", () => {
        ajaxInstanceMock.verify();
        ajaxGetMock.verify();
        sandbox.restore();
    });
});

describe("createCategory", () => {
    let sandbox = null, categorySaveMock = null;
    beforeEach("", () => {
        sandbox = sinon.sandbox.create();
        let category = new Category({});
        sandbox.stub(Category, "instance").withArgs({}).returns(category);
        categorySaveMock = sandbox.mock(category).expects("save");
    });

    afterEach("", () => {
        categorySaveMock.verify();
        sandbox.restore();
    });

    it("should create category with auto generated name", (done) => {
        categorySaveMock.returns(Promise.resolve({ "id": "id", "name": "Untitled Category 1" }));
        createCategory((response) => {
            assert.deepEqual(response, { "id": "id", "name": "Untitled Category 1" });
            done();
        })();
    });
});

describe("updateCategoryName", () => {
    let sandbox = null, categoryUpdateMock = null, categoryId = "categoryId", categoryDoc = null, categoryGetMock = null;
    let categoryName = null, category = null;
    beforeEach("before", () => {
        categoryDoc = { "_id": "id", "name": "Untitled Category 1" };
        sandbox = sinon.sandbox.create();
        categoryGetMock = sandbox.mock(CategoryDb).expects("findById");
        category = new Category(categoryDoc);
        sandbox.stub(Category, "instance").withArgs(categoryDoc).returns(category);
        categoryUpdateMock = sandbox.mock(category).expects("update");
    });

    afterEach("after", () => {
        sandbox.restore();
    });

    it("should update category with name", (done) => {
        categoryGetMock.withArgs(categoryId).returns(Promise.resolve(category));
        categoryUpdateMock.returns(Promise.resolve({ "id": "id", "name": "Untitled Category 1" }));
        updateCategoryName(categoryName, categoryId, (response) => {
            assert.deepEqual(response, { "status": true });
            categoryGetMock.verify();
            categoryUpdateMock.verify();
            done();
        })();
    });

    it("should return status false if category fetch fails", (done) => {
        categoryGetMock.withArgs(categoryId).returns(Promise.reject("error"));
        categoryUpdateMock.never();
        updateCategoryName(categoryName, categoryId, (response) => {
            assert.deepEqual(response, { "status": false });
            categoryGetMock.verify();
            categoryUpdateMock.verify();
            done();
        })();
    });

    it("should return status false if category update fails", (done) => {
        categoryGetMock.withArgs(categoryId).returns(Promise.resolve(category));
        categoryUpdateMock.returns(Promise.reject("error"));
        updateCategoryName(categoryName, categoryId, (response) => {
            assert.deepEqual(response, { "status": false });
            categoryGetMock.verify();
            categoryUpdateMock.verify();
            done();
        })();
    });
});
