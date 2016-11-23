/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5], no-undefined:0 */

import * as SurfActions from "../../../src/js/surf/actions/SurfActions";
import * as FeedsActions from "../../../src/js/feeds/actions/FeedsActions";
import FeedApplicationQueries from "../../../src/js/feeds/db/FeedApplicationQueries";
import PouchClient from "../../../src/js/db/PouchClient";
import RefreshFeedsHandler from "../../../src/js/surf/RefreshFeedsHandler";
import FilterFeedsHandler from "../../../src/js/surf/FilterFeedsHandler";
import mockStore from "../../helper/ActionHelper";
import { expect } from "chai";
import sinon from "sinon";

describe("SurfActions", () => {
    it("return type DISPLAY_ALL_FEEDS action", () => {
        let feeds = [
            {
                "url": "www.hindu.com",
                "categoryNames": ["hindu"],
                "items": [
                    { "title": "climate changes", "desc": "desc" }
                ]
            }, {
                "_id": "2",
                "url": "www.yahoonews.com",
                "categoryNames": ["yahoo"]
            }];
        let displayAllFeedsAction = { "type": SurfActions.DISPLAY_ALL_FEEDS, "feeds": feeds, "refreshState": false, "progressPercentage": 0, "hasMoreFeeds": true, "lastIndex": 0 };
        expect(SurfActions.displayAllFeeds(feeds, false)).to.deep.equal(displayAllFeedsAction);
    });

    it("return type DISPLAY_EXISTING_FEEDS action", () => {
        let displayExistingFeedsAction = { "type": SurfActions.DISPLAY_EXISTING_FEEDS, "feeds": [], "refreshState": false, "progressPercentage": 0 };
        expect(SurfActions.displayExistingFeeds([], false)).to.deep.equal(displayExistingFeedsAction);
    });

    it("dispatch displayAllFeedsAsync action with new feeds on successfull fetch", (done) => {
        let feeds = [
            {
                "url": "www.hindu.com",
                "categoryNames": ["hindu"],
                "items": [
                    { "title": "climate changes", "desc": "desc" }
                ]
            }
        ];
        let messages = { "fetchingFeeds": "Fetching feeds...", "noFeeds": "No feeds available" };

        let fetchAllFeedsWithCategoryNameMock = sinon.mock(FeedApplicationQueries).expects("fetchAllFeedsWithCategoryName");
        fetchAllFeedsWithCategoryNameMock.returns(Promise.resolve(feeds));

        let store = mockStore({ "feeds": [], "messages": messages }, [{ "type": SurfActions.DISPLAY_ALL_FEEDS, "feeds": feeds, "refreshState": false, "progressPercentage": 0, "hasMoreFeeds": true, "lastIndex": 0 }], done);
        Promise.resolve(store.dispatch(SurfActions.displayAllFeedsAsync())).then(() => {
            fetchAllFeedsWithCategoryNameMock.verify();
            FeedApplicationQueries.fetchAllFeedsWithCategoryName.restore();
        });
    });

    it("dispatch displayAllFeedsAsync action with empty feeds on fetch failure", (done) => {
        let fetchAllFeedsWithCategoryNameMock = sinon.mock(FeedApplicationQueries).expects("fetchAllFeedsWithCategoryName");
        fetchAllFeedsWithCategoryNameMock.returns(Promise.reject("error"));

        let store = mockStore({ "feeds": [] }, [{ "type": SurfActions.DISPLAY_ALL_FEEDS, "feeds": [], "refreshState": false, "progressPercentage": 0, "hasMoreFeeds": true, "lastIndex": 0 }], done);
        Promise.resolve(store.dispatch(SurfActions.displayAllFeedsAsync([], 0))).then(() => { //eslint-disable-line no-magic-numbers
            fetchAllFeedsWithCategoryNameMock.verify();
            FeedApplicationQueries.fetchAllFeedsWithCategoryName.restore();
        });
    });

    describe("getLatestFeedsFromAllSources", () => {
        let sandbox = null;
        let refreshHandlerMock = null;
        beforeEach("before", () => {
            sandbox = sinon.sandbox.create();
            refreshHandlerMock = sandbox.mock(RefreshFeedsHandler).expects("fetchLatestFeeds");
        });

        afterEach("after", () => {
            refreshHandlerMock.verify();
            sandbox.restore();
        });

        xit("dispatch getLatestFeedsFromAllSources action should return latest feeds", (done) => {
            let feeds = [
                {
                    "url": "www.hindu.com",
                    "categoryNames": ["hindu"],
                    "items": [
                        { "title": "climate changes", "desc": "desc" }
                    ]
                }
            ];

            refreshHandlerMock.returns(Promise.resolve(feeds));
            let store = mockStore({ "feeds": [] }, [{ "type": SurfActions.DISPLAY_ALL_FEEDS, "feeds": feeds }], done);
            return Promise.resolve(store.dispatch(SurfActions.getLatestFeedsFromAllSources()));
        });

        xit("dispatch getLatestFeedsFromAllSources action with empty array if rejected on request", (done) => {
            refreshHandlerMock.returns(Promise.reject("error"));
            let store = mockStore({ "feeds": [] }, [{ "type": SurfActions.DISPLAY_ALL_FEEDS, "feeds": [] }], done);
            return Promise.resolve(store.dispatch(SurfActions.getLatestFeedsFromAllSources()));
        });
    });

    describe("getSourceIdMapAndFilter", () => {
        it("should trigger filter action to get filter and hashmap", () => {
            let filterAction = { "type": SurfActions.STORE_FILTER_SOURCE_MAP, "surfFilter": {}, "sourceHashMap": {}, "sourceIds": [] };
            expect(SurfActions.storeFilterSourceMap({}, {}, [])).to.deep.equal(filterAction);
        });

        xit("should get filter and source hash map and store it in redux store", (done) => {
            let resultHashMap = {
                "sourceId_01": ["Sports"],
                "sourceId_02": ["Politics"]
            };

            let filterFeedsHandler = new FilterFeedsHandler();

            let fetchAllFeedsWithCategoryNameMock = sinon.mock(filterFeedsHandler).expects("getSourceAndCategoryMap");
            fetchAllFeedsWithCategoryNameMock.returns(Promise.resolve(resultHashMap));

            let filterAction = { "type": SurfActions.STORE_FILTER_SOURCE_MAP, "surfFilter": {}, "sourceHashMap": {} };

            let store = mockStore({ "surfFilter": {}, "sourceHashMap": {} }, [filterAction], done);
            return Promise.resolve(store.dispatch(SurfActions.storeFilterAndSourceHashMap())).then(() => {
                fetchAllFeedsWithCategoryNameMock.verify();
                filterFeedsHandler.getSourceAndCategoryMap.restore();
            });
        });
    });

    describe("fetchAllCategories", ()=> {
        it("should fetch all the categories", (done)=> {
            let fetchDocumentsMock = sinon.mock(PouchClient).expects("fetchDocuments");
            fetchDocumentsMock.withArgs("category/allCategories", { "include_docs": true }).returns(Promise.resolve([]));
            let store = mockStore({ "categories": [] }, [{ "type": SurfActions.FETCH_ALL_CATEGORIES, "categories": [] }], done);
            //return Promise.resolve(store.dispatch(AllFeedsActions.fetchAllCategories(()=> {})).then(() => {
            //    fetchDocumentsMock.verify();
            //    PouchClient.fetchDocuments.restore();
            //    done();
            //}));
            store.dispatch(SurfActions.fetchAllCategories(()=> {}));
            fetchDocumentsMock.verify();
            PouchClient.fetchDocuments.restore();
        });
    });

    describe("displayFeedsByPage", ()=> {
        xit("should display only 20 feeds per page", (done)=> {
            let filterStore = {
                "surfFilter": {
                    "_id": "surf-filter-id",
                    "categories": [{
                        "_id": "5B5AE0E9-2C36-0070-8569-AD5A68C0EFD7",
                        "name": "Untitled Category 1"
                    }],
                    "mediaTypes": []
                },
                "sourceIds": ["9DD0ACE1-645C-2E0D-8EE2-3DFA423294AF", "70F0C613-A7CE-5A3B-B152-7B534EBCA87F"],
                "sourceHashMap": {
                    "9DD0ACE1-645C-2E0D-8EE2-3DFA423294AF": ["Untitled Category 1"],
                    "812B88E6-7178-3735-A0C0-49609F0C99EB": ["Untitled Category 1"]
                }
            };
            let feeds = [
                {
                    "doc": {
                        "docType": "feed",
                        "sourceId": "9DD0ACE1-645C-2E0D-8EE2-3DFA423294AF"
                    }
                },
                {
                    "doc": {
                        "docType": "feed",
                        "sourceId": "some other source id"
                    }
                }
            ];

            let store = mockStore({ "feeds": feeds }, [{ "type": SurfActions.FETCH_FEEDS_BY_PAGE, "feeds": feeds }], done);

            let filterFeedsHandler = new FilterFeedsHandler();
            let filterFeedsHandlerMock = sinon.mock(filterFeedsHandler).expects("fetchFeedsByPageWithFilter");
            filterFeedsHandlerMock.withArgs(filterStore).returns(Promise.resolve(feeds));

            store.dispatch(SurfActions.fetchFeedsByPage(0)); //eslint-disable-line no-magic-numbers
            filterFeedsHandlerMock.verify();
            filterFeedsHandler.fetchFeedsByPageWithFilter.restore();
        });
    });

    describe("fetchFeedsByFilter", ()=> {
        xit("should upadte the filter document before fetching feeds", (done)=> {
            let updatedFilterDocument = {
                "categories": [
                    {
                        "_id": "12345",
                        "name": "Category 1"
                    }
                ],
                "mediaTypes": [{
                    "name": "Videos",
                    "_id": "Videos"
                }]
            };

            let feeds = [
                {
                    "url": "www.hindu.com",
                    "categoryNames": ["hindu"],
                    "items": [
                        { "title": "climate changes", "desc": "desc" }
                    ]
                }, {
                    "_id": "2",
                    "url": "www.yahoonews.com",
                    "categoryNames": ["yahoo"]
                }
            ];

            let filterFeedsHandler = new FilterFeedsHandler();


            let updateFilterDocument = sinon.mock(filterFeedsHandler).expects("updateFilterDocument");
            updateFilterDocument.returns(Promise.resolve("result"));

            let fetchFeedsByFilter = sinon.mock(filterFeedsHandler).expects("fetchFeedsByFilter");
            fetchFeedsByFilter.withArgs({}).returns(Promise.resolve(feeds));

            let filterAction = { "type": SurfActions.FETCH_FEEDS_BY_FILTER, "feeds": feeds };

            let store = mockStore({ "feeds": feeds }, [filterAction], done);
            return Promise.resolve(store.dispatch(SurfActions.fetchFeedsByPageWithFilter(updatedFilterDocument))).then(() => {
                updateFilterDocument.verify();
                filterFeedsHandler.updateFilterDocument.restore();
                fetchFeedsByFilter.verify();
                filterFeedsHandler.fetchFeedsByFilter.restore();
                done();
            });
        });
    });

    describe("parkFeed", ()=> {

        it("should change status of given surf feed to park feed and increment counter", (done) => {
            let feedDocument = {
                "_id": "feedId",
                "docType": "feed",
                "title": "tn",
                "description": "www.facebookpolitics.com",
                "sourceId": "rssId1"
            };

            let feedStatus = "park";
            let store = mockStore({ "parkFeedCount": 2 }, [{ "type": SurfActions.PARK_FEED, "feed": feedDocument }, { "type": FeedsActions.INCREMENT_PARK_COUNTER }], done);
            let feedApplicationQueriesMock = sinon.mock(FeedApplicationQueries).expects("updateFeed");
            feedApplicationQueriesMock.withExactArgs(feedDocument, feedStatus).returns(Promise.resolve({ "ok": true }));
            Promise.resolve(store.dispatch(SurfActions.parkFeed(feedDocument))).then(() => {
                feedApplicationQueriesMock.verify();
                FeedApplicationQueries.updateFeed.restore();
            });
        });

        it("should not dispatch INCREMENT_PARK_COUNTER if no feed document is passed", (done) => {
            let feedDocument = {};
            let store = mockStore({}, [], done);
            let feedApplicationQueriesMock = sinon.mock(FeedApplicationQueries).expects("updateFeed");
            feedApplicationQueriesMock.withArgs(feedDocument).never();
            Promise.resolve(store.dispatch(SurfActions.parkFeed(feedDocument))).then(() => {
                feedApplicationQueriesMock.verify();
                FeedApplicationQueries.updateFeed.restore();
            });
        });

        it("should not dispatch INCREMENT_PARK_COUNTER if feed document is undefined", (done) => {
            let store = mockStore({}, [], done);
            let feedApplicationQueriesMock = sinon.mock(FeedApplicationQueries).expects("updateFeed");
            feedApplicationQueriesMock.never();
            Promise.resolve(store.dispatch(SurfActions.parkFeed())).then(() => {
                feedApplicationQueriesMock.verify();
                FeedApplicationQueries.updateFeed.restore();
            });
        });
    });

});
