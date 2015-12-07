/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { displayAllFeeds, DISPLAY_ALL_FEEDS, displayAllFeedsAsync } from "../../../src/js/surf/actions/AllFeedsActions.js";
import SurfApplicationQueries from "../../../src/js/surf/db/SurfApplicationQueries.js";
import mockStore from "../../helper/ActionHelper.js";
import { expect } from "chai";
import sinon from "sinon";

describe("AllFeedsAction", () => {
    it("return type DISPLAY_ALL_FEEDS action", () => {
        let sources = [
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


        let displayAllFeedsAction = { "type": DISPLAY_ALL_FEEDS, "sources": sources };
        expect(displayAllFeeds(sources)).to.deep.equal(displayAllFeedsAction);
    });

    it("dispatch displayAllFeedsAsync action with new feeds on successfull fetch", (done) => {
        let sources = [
            {
                "url": "www.hindu.com",
                "categoryNames": ["hindu"],
                "items": [
                    { "title": "climate changes", "desc": "desc" }
                ]
            }
        ];
        let fetchAllSourcesWithCategoryNameMock = sinon.mock(SurfApplicationQueries).expects("fetchAllSourcesWithCategoryName");
        fetchAllSourcesWithCategoryNameMock.returns(Promise.resolve(sources));

        let store = mockStore({ "feeds": [] }, [{ "type": DISPLAY_ALL_FEEDS, "sources": sources }], done);
        return Promise.resolve(store.dispatch(displayAllFeedsAsync())).then(() => {
            fetchAllSourcesWithCategoryNameMock.verify();
            SurfApplicationQueries.fetchAllSourcesWithCategoryName.restore();
        });
    });

    it("dispatch displayAllFeedsAsync action with empty feeds on fetch failure", (done) => {
        let fetchAllSourcesWithCategoryNameMock = sinon.mock(SurfApplicationQueries).expects("fetchAllSourcesWithCategoryName");
        fetchAllSourcesWithCategoryNameMock.returns(Promise.reject("error"));

        let store = mockStore({ "feeds": [] }, [{ "type": DISPLAY_ALL_FEEDS, "sources": {} }], done);
        return Promise.resolve(store.dispatch(displayAllFeedsAsync())).then(() => {
            fetchAllSourcesWithCategoryNameMock.verify();
            SurfApplicationQueries.fetchAllSourcesWithCategoryName.restore();
        });
    });
});

