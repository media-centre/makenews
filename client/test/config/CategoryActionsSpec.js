/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] no-unused-vars:0*/

"use strict";
import { populateCategoryDetails, DISPLAY_CATEGORY, createCategory, createDefaultCategory, addRssUrlAsync, addTwitterUrlAsync, TWITTER_TYPE } from "../../src/js/config/actions/CategoryActions.js";
import CategoryDb from "../../src/js/config/db/CategoryDb.js";
import CategoriesApplicationQueries from "../../src/js/config/db/CategoriesApplicationQueries";
import { displayAllCategoriesAsync } from "../../src/js/config/actions/AllCategoriesActions.js";
import Source, { STATUS_INVALID, STATUS_VALID } from "../../src/js/config/Source.js";
import AjaxClient from "../../src/js/utils/AjaxClient";
import TwitterDb from "../../src/js/twitter/TwitterDb";
import RssResponseParser from "../../src/js/rss/RssResponseParser";
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
    let sandbox = null, categorySourceConfig = null, ajaxGetMock = null, ajaxInstanceMock = null, type = null;
    let url = null, categoryId = null, allSources = null, sourceSaveMock = null;

    beforeEach("Before", () => {
        sandbox = sinon.sandbox.create();
        let ajaxMock = new AjaxClient("/rss-feeds");
        ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");
        ajaxInstanceMock.withArgs("/rss-feeds").returns(ajaxMock);
        ajaxGetMock = sandbox.mock(ajaxMock).expects("get");
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
        let responseJson = { "items": [{ "title": "hindu football", "pubDate": "2016-01-01T22:09:28+00:00" }, { "title": "cricket", "pubDate": "2016-01-01T22:09:28+00:00" }] };
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.resolve(responseJson));

        sandbox.stub(CategoriesApplicationQueries, "fetchSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));
        let latestFeedTimestamp = "2016-01-01T22:09:28+00:00";
        let sourceDetails = { "categoryIds": [categoryId], "sourceType": type, "url": url, "status": STATUS_VALID, "latestFeedTimestamp": latestFeedTimestamp };
        let source = new Source(sourceDetails);
        sandbox.stub(Source, "instance").withArgs(sourceDetails).returns(source);
        sourceSaveMock = sandbox.mock(source).expects("save").returns(Promise.resolve("response"));
        sandbox.stub(RssDb, "addRssFeeds");
        let responseParserMock = sandbox.mock(RssResponseParser).expects("parseFeeds");

        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        const store = mockStore(categorySourceConfig, expectedActions, done);
        return Promise.resolve(store.dispatch(addRssUrlAsync(categoryId, url, () => {}))).then(() => {
            sourceSaveMock.verify();
            responseParserMock.verify();
        });
    });

    it("should not create rss if the url fetch returns invalid response", () => {
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.reject("error"));
        let categoryDbMock = sandbox.mock(CategoryDb).expects("createOrUpdateSource").never();
        const store = mockStore(categorySourceConfig, []);
        store.dispatch(addRssUrlAsync(categoryId, url));
        categoryDbMock.verify();
    });

    it("should create rss with valid status on successful fetch", (done) => {
        let latestFeedTimestamp = "2016-01-01T22:09:28+00:00";
        let responseJson = { "items": [{ "title": "hindu football", "pubDate": latestFeedTimestamp }] };
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.resolve(responseJson));

        sandbox.stub(CategoriesApplicationQueries, "fetchSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));
        sandbox.stub(RssDb, "addRssFeeds");
        let sourceDetails = { "latestFeedTimestamp": latestFeedTimestamp, "categoryIds": [categoryId], "sourceType": type, "url": url, "status": STATUS_VALID };
        let source = new Source(sourceDetails);
        sandbox.stub(Source, "instance").withArgs(sourceDetails).returns(source);
        sourceSaveMock = sandbox.mock(source).expects("save").returns(Promise.resolve("response"));
        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        const store = mockStore(categorySourceConfig, expectedActions, done);
        return Promise.resolve(store.dispatch(addRssUrlAsync(categoryId, url))).then(() => {
            sourceSaveMock.verify();
        });
    });

    it("should create rss with invalid status if url is invalid", (done) => {
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.reject("error"));

        sandbox.stub(CategoriesApplicationQueries, "fetchSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));

        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        const store = mockStore(categorySourceConfig, expectedActions);
        return Promise.resolve(store.dispatch(addRssUrlAsync(categoryId, url, (response)=> {
            assert.strictEqual("invalid", response);
            done();
        })));
    });

    it("should create rss source and then create the feeds", (done) => {
        let latestFeedTimestamp = "2016-01-01T22:09:28+00:00";
        let responseJson = { "items": [{ "title": "hindu football", "pubDate": latestFeedTimestamp }, { "title": "cricket", "pubDate": latestFeedTimestamp }] };
        let sourceId = "sourceId";
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.resolve(responseJson));

        sandbox.stub(CategoriesApplicationQueries, "fetchSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));
        let sourceDetails = { "categoryIds": [categoryId], "sourceType": type, "url": url, "status": STATUS_VALID, "latestFeedTimestamp": latestFeedTimestamp };
        let source = new Source(sourceDetails);
        sandbox.stub(Source, "instance").withArgs(sourceDetails).returns(source);
        sourceSaveMock = sandbox.mock(source).expects("save").returns(Promise.resolve("response"));
        let categoriesApplicationQueriesCreateFeedsMock = sandbox.mock(RssDb).expects("addRssFeeds");
        categoriesApplicationQueriesCreateFeedsMock.withArgs(sourceId, responseJson.items).returns(Promise.resolve("response"));

        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        const store = mockStore(categorySourceConfig, expectedActions, done);
        return Promise.resolve(store.dispatch(addRssUrlAsync(categoryId, url, () => {}))).then(() => {
            sourceSaveMock.verify();
            categoriesApplicationQueriesCreateFeedsMock.verify();
        });
    });

    it("should create rss source with latestFeedTimeStamp from the feed response", (done) => {

        let sourceId = "sourceId";

        let responseJson = { "items": [{ "title": "hindu football", "pubDate": "2016-01-01T22:09:28+00:00" }, { "title": "cricket", "pubDate": "2016-01-01T22:09:28+00:00" }] };
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.resolve(responseJson));

        sandbox.stub(CategoriesApplicationQueries, "fetchSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));
        let latestFeedTimestamp = "2016-01-01T22:09:28+00:00";
        let sourceDetails = { "categoryIds": [categoryId], "sourceType": type, "url": url, "status": STATUS_VALID, "latestFeedTimestamp": latestFeedTimestamp };
        let source = new Source(sourceDetails);
        sandbox.stub(Source, "instance").withArgs(sourceDetails).returns(source);
        sourceSaveMock = sandbox.mock(source).expects("save").returns(Promise.resolve("response"));
        let categoriesApplicationQueriesCreateFeedsMock = sandbox.mock(RssDb).expects("addRssFeeds");
        categoriesApplicationQueriesCreateFeedsMock.withArgs(sourceId, responseJson.items).returns(Promise.resolve("response"));

        let responseParserMock = sandbox.mock(RssResponseParser).expects("parseFeeds");

        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        const store = mockStore(categorySourceConfig, expectedActions, done);
        return Promise.resolve(store.dispatch(addRssUrlAsync(categoryId, url, () => {}))).then(() => {
            categoriesApplicationQueriesCreateFeedsMock.verify();
            sourceSaveMock.verify();
            responseParserMock.verify();
            RssDb.addRssFeeds.restore();
        });
    });

    afterEach("After", () => {
        ajaxInstanceMock.verify();
        ajaxGetMock.verify();
        sandbox.restore();
    });
});

describe("addTwitterUrlAsync", () => {
    let sandbox = null, categorySourceConfig = null, ajaxGetMock = null, ajaxInstanceMock = null, url = null, type = null, categoryId = null, userName = null;

    beforeEach("Before", () => {
        sandbox = sinon.sandbox.create();
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
        sandbox.stub(CategoriesApplicationQueries, "fetchSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));
        let sourceDetails = { "categoryIds": [categoryId], "sourceType": type, "url": url, "status": STATUS_VALID, "latestFeedTimestamp": "2016-01-06T02:15:53+00:00" },
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
        sandbox.stub(CategoriesApplicationQueries, "fetchSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));
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

describe("createDefaultCategory", () => {
    xit("should dispatch displayAllCategoriesAsync after adding category", (done) => {
        var categoryName = "default";

        let categoryDbStub = sinon.stub(CategoryDb, "createCategoryIfNotExists").withArgs({
            "docType": "category",
            "name": categoryName
        });
        categoryDbStub.returns(Promise.resolve("document added"));
        const store = mockStore({}, [], done);
        store.dispatch(createDefaultCategory(categoryName), [displayAllCategoriesAsync()]);
        CategoryDb.createCategoryIfNotExists.restore();
    });

    xit("should not dispatch displayAllCategoriesAsync if adding category fails", (done) => {
        var categoryName = "default";

        let categoryDbStub = sinon.stub(CategoryDb, "createCategoryIfNotExists").withArgs({
            "docType": "category",
            "name": categoryName
        });
        categoryDbStub.returns(Promise.reject("document added"));
        const store = mockStore({}, [], done);
        store.dispatch(createDefaultCategory(categoryName, (error) => {
            done();
        }));
        CategoryDb.createCategoryIfNotExists.restore();
    });
});

describe("createCategory", () => {
    xit("should create category with given name", (done) => {
        var categoryName = "sports category";

        let categoryDbStub = sinon.stub(CategoryDb, "createCategory").withArgs({
            "docType": "category",
            "name": categoryName,
            "createdTime": new Date().getTime()
        });
        categoryDbStub.returns(Promise.resolve("document added"));
        const store = mockStore({

        }, [], done);
        store.dispatch(createCategory(categoryName, (success) => {
            done();
        }));
        CategoryDb.createCategory.restore();
    });

    xit("should auto-generate category name in order if name is empty", (done) => {
        let categoryName = "";

        let createCategoryMock = sinon.mock(CategoryDb).expects("createCategory");
        createCategoryMock.returns(Promise.resolve("document added"));

        let allCategoriesStub = sinon.stub(CategoryDb, "fetchAllCategoryDocuments");
        allCategoriesStub.returns(Promise.resolve([{ "id": "1", "name": "Default Category" }, { "id": "2", "name": "Sports" }]));
        const store = mockStore({}, [], done);
        store.dispatch(createCategory(categoryName, (success) => {
            done();
        }));
        createCategoryMock.verify();
        CategoryDb.createCategory.restore();
    });

    xit("should auto-generate category name with the minimal missing number", (done) => {
        let categoryName = "";

        let createCategoryMock = sinon.mock(CategoryDb).expects("createCategory");
        createCategoryMock.returns(Promise.resolve("document added"));

        let allCategoriesStub = sinon.stub(CategoryDb, "fetchAllCategoryDocuments");
        allCategoriesStub.returns(Promise.resolve([{ "id": "1", "name": "Untitled Category 1" }, { "id": "2", "name": "Untitled Category 3" }]));
        const store = mockStore({}, [], done);
        store.dispatch(createCategory(categoryName, (success) => {
            done();
        }));
        createCategoryMock.verify();
        CategoryDb.createCategory.restore();
    });
});
