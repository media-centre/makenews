/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5], no-undefined:0 */

"use strict";
import * as AllFeedsActions from "../../../src/js/surf/actions/AllFeedsActions.js";
import FeedApplicationQueries from "../../../src/js/feeds/db/FeedApplicationQueries.js";
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
            let filterAction = { "type": AllFeedsActions.STORE_FILTER_SOURCE_MAP, "surfFilter": {}, "sourceHashMap": {} };
            expect(AllFeedsActions.storeFilterSourceMap({}, {})).to.deep.equal(filterAction);
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

});
