/* eslint max-nested-callbacks:0 */
"use strict";

import PouchClient from "../../src/js/db/PouchClient.js";
import FeedDb from "../../src/js/feeds/db/FeedDb.js";
import FilterFeedsHandler from "../../src/js/surf/FilterFeedsHandler.js";
import { expect } from "chai";
import sinon from "sinon";

describe("displayFilteredFeeds", ()=> {

    let feedsAndCategoriesDocs = [
        {
            "doc": {
                "docType": "feed",
                "sourceId": "sourceId_01"
            }
        },

        {
            "doc": {
                "docType": "feed",
                "sourceId": "sourceId_02"
            }
        },
        {
            "doc": {
                "docType": "category",
                "name": "Sports"
            },
            "key": "sourceId_01"
        },
        {
            "doc": {
                "docType": "category",
                "name": "Politics"
            },
            "key": "sourceId_02"
        },
        {
            "doc": {
                "docType": "feed",
                "sourceId": "sourceId_01"
            }
        }
    ];

    it("should create hashmap with categoryNames with sourceId", (done) => {
        let resultHashMap = {
            "sourceId_01": ["Sports"],
            "sourceId_02": ["Politics"]
        };

        let feedDb = sinon.mock(FeedDb).expects("fetchSurfFeedsAndCategoriesWithSource");
        feedDb.returns(Promise.resolve(feedsAndCategoriesDocs));

        let filterFeedsHandler = new FilterFeedsHandler();
        filterFeedsHandler.getSourceAndCategoryMap().then((sourceCategoryHashMap)=> {
            expect(resultHashMap).to.deep.equal(sourceCategoryHashMap);
            feedDb.verify();
            FeedDb.fetchSurfFeedsAndCategoriesWithSource.restore();
            done();
        });
    });

    it("should get the filter document", (done)=> {
        let filterDocument = {
            "docType": "surf-filter",
            "categoryIds": ["sports_category_id_01", "politics_category_id_02"]
        };
        let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments");
        pouchClientMock.withArgs("category/surfFilter").returns(Promise.resolve(filterDocument));

        let filterFeedsHandler = new FilterFeedsHandler();
        filterFeedsHandler.fetchFilterDocument().then((response)=> {
            expect(filterDocument).to.deep.equal(response);
            pouchClientMock.verify();
            PouchClient.fetchDocuments.restore();
            done();
        });
    });

    it("dispatch displayFilteredFeeds action with filtered feeds as result", (done) => {
        let filter = {
            "categoryIds": ["sports_category_id_01", "politics_category_id_02"]
        };
        let filterFeedsHandler = new FilterFeedsHandler(filter);
        filterFeedsHandler.fetchFeedsByFilter().then(()=> {
            done();
        });
    });

    it("should get both filter document and source hashmap", (done)=> {
        let filterDocument = [{
            "docType": "surf-filter",
            "categoryIds": ["sports_category_id_01", "politics_category_id_02"]
        }];

        let result = {
            "sourceHashMap": {
                "sourceId_01": ["Sports"],
                "sourceId_02": ["Politics"]
            },
            "surfFilter": {
                "docType": "surf-filter",
                "categoryIds": ["sports_category_id_01", "politics_category_id_02"]
            }
        };

        let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments");
        pouchClientMock.withArgs("category/surfFilter").returns(Promise.resolve(filterDocument));

        let feedDbMock = sinon.mock(FeedDb).expects("fetchSurfFeedsAndCategoriesWithSource");
        feedDbMock.returns(Promise.resolve(feedsAndCategoriesDocs));

        let filterFeedsHandler = new FilterFeedsHandler();
        filterFeedsHandler.getFilterAndSourceHashMap().then((filterAndSourceHashMap)=> {
            expect(result).to.deep.equal(filterAndSourceHashMap);
            pouchClientMock.verify();
            PouchClient.fetchDocuments.restore();
            feedDbMock.verify();
            FeedDb.fetchSurfFeedsAndCategoriesWithSource.restore();
            done();
        });

    });
});
