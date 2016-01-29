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

    it("should update filter document", (done)=> {
        let currentDocument = {
            "categories": [],
            "mediaTypes": []
        };
        let updatedDocument = {
            "categories": [
                {
                    "_id": "12345",
                    "name": "Category 1"
                },
                {
                    "_id": "123456",
                    "name": "Category 2"
                }
            ],
            "mediaTypes": []
        };
        let updateDocumentMock = sinon.mock(PouchClient).expects("updateDocument");
        updateDocumentMock.withArgs(updatedDocument).returns(Promise.resolve(currentDocument));

        let getDocumentMock = sinon.mock(PouchClient).expects("getDocument");
        getDocumentMock.withArgs("surf-filter-id").returns(Promise.resolve({}));

        let filterFeedsHandler = new FilterFeedsHandler();
        return filterFeedsHandler.updateFilterDocument(updatedDocument).then(()=> {
            getDocumentMock.verify();
            PouchClient.getDocument.restore();

            updateDocumentMock.verify();
            PouchClient.updateDocument.restore();
            done();
        });
    });

    it("should throw error on updating filter document", (done)=> {
        let updatedDocument = {
            "categories": [
                {
                    "_id": "12345",
                    "name": "Category 1"
                },
                {
                    "_id": "123456",
                    "name": "Category 2"
                }],
            "mediaTypes": []
        };
        let currentDocument = {
            "categories": [],
            "mediaTypes": []
        };

        let getDocumentMock = sinon.mock(PouchClient).expects("getDocument");
        getDocumentMock.withArgs("surf-filter-id").returns(Promise.resolve(currentDocument));

        let updateDocumentMock = sinon.mock(PouchClient).expects("updateDocument");
        updateDocumentMock.withArgs(updatedDocument).returns(Promise.reject("error"));

        let filterFeedsHandler = new FilterFeedsHandler();
        return filterFeedsHandler.updateFilterDocument(updatedDocument).catch(()=> {
            getDocumentMock.verify();
            PouchClient.getDocument.restore();

            updateDocumentMock.verify();
            PouchClient.updateDocument.restore();
            done();
        });
    });

    it("should create sourceId list based on categories filtered", ()=> {

    });
});
