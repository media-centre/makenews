/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import * as AllFeedsActions from "../../../src/js/surf/actions/AllFeedsActions.js";
import FeedApplicationQueries from "../../../src/js/feeds/db/FeedApplicationQueries.js";
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


        let displayAllFeedsAction = { "type": AllFeedsActions.DISPLAY_ALL_FEEDS, "feeds": feeds };
        expect(AllFeedsActions.displayAllFeeds(feeds)).to.deep.equal(displayAllFeedsAction);
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

        let store = mockStore({ "feeds": [] }, [{ "type": AllFeedsActions.DISPLAY_ALL_FEEDS, "feeds": [] }], done);
        return Promise.resolve(store.dispatch(AllFeedsActions.displayAllFeedsAsync())).then(() => {
            fetchAllFeedsWithCategoryNameMock.verify();
            FeedApplicationQueries.fetchAllFeedsWithCategoryName.restore();
        });
    });
});
