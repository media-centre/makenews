/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5], no-undefined:0 */

"use strict";
import * as AllFeedsActions from "../../../src/js/surf/actions/AllFeedsActions.js";
import FeedApplicationQueries from "../../../src/js/feeds/db/FeedApplicationQueries.js";
import PouchClient from "../../../src/js/db/PouchClient.js";
//import FeedDb from "../../../src/js/feeds/db/FeedDb.js";
import RefreshFeedsHandler from "../../../src/js/surf/RefreshFeedsHandler.js";
import FilterFeedsHandler from "../../../src/js/surf/FilterFeedsHandler.js";
import mockStore from "../../helper/ActionHelper.js";
import { expect } from "chai";
import sinon from "sinon";

describe("AllFeedsAction", () => {
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
        let displayAllFeedsAction = { "type": AllFeedsActions.DISPLAY_ALL_FEEDS, "feeds": feeds, "refreshState": false, "progressPercentage": 0 };
        expect(AllFeedsActions.displayAllFeeds(feeds, false)).to.deep.equal(displayAllFeedsAction);
    });

    it("return type DISPLAY_EXISTING_FEEDS action", () => {
        let displayExistingFeedsAction = { "type": AllFeedsActions.DISPLAY_EXISTING_FEEDS, "feeds": [], "refreshState": false, "progressPercentage": 0 };
        expect(AllFeedsActions.displayExistingFeeds([], false)).to.deep.equal(displayExistingFeedsAction);
    });

    xit("dispatch displayAllFeedsAsync action with new feeds on successfull fetch", (done) => {
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

        let store = mockStore({ "feeds": [], "messages": messages }, [{ "type": AllFeedsActions.DISPLAY_ALL_FEEDS, "feeds": feeds }], done);
        return Promise.resolve(store.dispatch(AllFeedsActions.displayAllFeedsAsync())).then(() => {
            fetchAllFeedsWithCategoryNameMock.verify();
            FeedApplicationQueries.fetchAllFeedsWithCategoryName.restore();
        });
    });

    it("dispatch displayAllFeedsAsync action with empty feeds on fetch failure", (done) => {
        let fetchAllFeedsWithCategoryNameMock = sinon.mock(FeedApplicationQueries).expects("fetchAllFeedsWithCategoryName");
        fetchAllFeedsWithCategoryNameMock.returns(Promise.reject("error"));

        let store = mockStore({ "feeds": [] }, [{ "type": AllFeedsActions.DISPLAY_ALL_FEEDS, "feeds": [], "refreshState": undefined, "progressPercentage": 0 }], done);
        return Promise.resolve(store.dispatch(AllFeedsActions.displayAllFeedsAsync([], 0))).then(() => {
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
            let store = mockStore({ "feeds": [] }, [{ "type": AllFeedsActions.DISPLAY_ALL_FEEDS, "feeds": feeds }], done);
            return Promise.resolve(store.dispatch(AllFeedsActions.getLatestFeedsFromAllSources()));
        });

        xit("dispatch getLatestFeedsFromAllSources action with empty array if rejected on request", (done) => {
            refreshHandlerMock.returns(Promise.reject("error"));
            let store = mockStore({ "feeds": [] }, [{ "type": AllFeedsActions.DISPLAY_ALL_FEEDS, "feeds": [] }], done);
            return Promise.resolve(store.dispatch(AllFeedsActions.getLatestFeedsFromAllSources()));
        });
    });

    describe("getSourceIdMapAndFilter", () => {
        it("should trigger filter action to get filter and hashmap", () => {
            let filterAction = { "type": AllFeedsActions.STORE_FILTER_SOURCE_MAP, "surfFilter": {}, "sourceHashMap": {}, "sourceIds": [] };
            expect(AllFeedsActions.storeFilterSourceMap({}, {}, [])).to.deep.equal(filterAction);
        });

        xit("should get filter and source hash map and store it in redux store", (done) => {
            let resultHashMap = {
                "sourceId_01": ["Sports"],
                "sourceId_02": ["Politics"]
            };

            let filterFeedsHandler = new FilterFeedsHandler();

            let fetchAllFeedsWithCategoryNameMock = sinon.mock(filterFeedsHandler).expects("getSourceAndCategoryMap");
            fetchAllFeedsWithCategoryNameMock.returns(Promise.resolve(resultHashMap));

            let filterAction = { "type": AllFeedsActions.STORE_FILTER_SOURCE_MAP, "surfFilter": {}, "sourceHashMap": {} };

            let store = mockStore({ "surfFilter": {}, "sourceHashMap": {} }, [filterAction], done);
            return Promise.resolve(store.dispatch(AllFeedsActions.storeFilterAndSourceHashMap())).then(() => {
                fetchAllFeedsWithCategoryNameMock.verify();
                filterFeedsHandler.getSourceAndCategoryMap.restore();
            });
        });
    });

    describe("fetchAllCategories", ()=> {
        it("should fetch all the categories", (done)=> {
            let fetchDocumentsMock = sinon.mock(PouchClient).expects("fetchDocuments");
            fetchDocumentsMock.withArgs("category/allCategories", { "include_docs": true }).returns(Promise.resolve([]));
            let store = mockStore({ "categories": [] }, [{ "type": AllFeedsActions.FETCH_ALL_CATEGORIES, "categories": [] }], done);
            //return Promise.resolve(store.dispatch(AllFeedsActions.fetchAllCategories(()=> {})).then(() => {
            //    fetchDocumentsMock.verify();
            //    PouchClient.fetchDocuments.restore();
            //    done();
            //}));
            store.dispatch(AllFeedsActions.fetchAllCategories(()=> {}));
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

            let store = mockStore({ "feeds": feeds }, [{ "type": AllFeedsActions.FETCH_FEEDS_BY_PAGE, "feeds": feeds }], done);

            let filterFeedsHandler = new FilterFeedsHandler();
            let filterFeedsHandlerMock = sinon.mock(filterFeedsHandler).expects("fetchFeedsByPageWithFilter");
            filterFeedsHandlerMock.withArgs(filterStore).returns(Promise.resolve(feeds));

            store.dispatch(AllFeedsActions.fetchFeedsByPage(0));
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

            let filterAction = { "type": AllFeedsActions.FETCH_FEEDS_BY_FILTER, "feeds": feeds };

            let store = mockStore({ "feeds": feeds }, [filterAction], done);
            return Promise.resolve(store.dispatch(AllFeedsActions.fetchFeedsByPageWithFilter(updatedFilterDocument))).then(() => {
                updateFilterDocument.verify();
                filterFeedsHandler.updateFilterDocument.restore();
                fetchFeedsByFilter.verify();
                filterFeedsHandler.fetchFeedsByFilter.restore();
                done();
            });
        });
    });

});
