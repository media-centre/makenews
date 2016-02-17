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
            "categoryIds": ["sports_category_id_01", "politics_category_id_02"],
            "categories": [{ "_id": 1 }]
        }];

        let result = {
            "surfFilter": {
                "docType": "surf-filter",
                "categoryIds": ["sports_category_id_01", "politics_category_id_02"],
                "categories": [{ "_id": 1 }]
            },
            "sourceHashMap": {
                "sourceId_01": ["Sports"],
                "sourceId_02": ["Politics"]
            }
        };
        let sourceUrlDocs = [{
            "value": {
                "categoryIds": [
                    "sports_category_id_01"
                ]
            },
            "key": "@martinfowler",
            "id": "812B88E6-7178-3735-A0C0-49609F0C99EB"
        }, {
            "value": {
                "categoryIds": [
                    "politics_category_id_02"
                ]
            },
            "key": "@martinfowler",
            "id": "812B88E6-7178-3735-A0C0-49609F0C99EB"
        }];

        let filterFeedsHandler = new FilterFeedsHandler();

        let surfFilterMock = sinon.mock(filterFeedsHandler).expects("fetchFilterDocument");
        surfFilterMock.returns(Promise.resolve(filterDocument));

        let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments");
        pouchClientMock.withArgs("category/allSourcesBySourceType", { "include_docs": true }).returns(Promise.resolve(sourceUrlDocs));

        let feedDbMock = sinon.mock(FeedDb).expects("fetchSurfFeedsAndCategoriesWithSource");
        feedDbMock.returns(Promise.resolve(feedsAndCategoriesDocs));


        return filterFeedsHandler.getFilterAndSourceHashMap().then((filterAndSourceHashMap)=> {
            expect(result).to.deep.equal(filterAndSourceHashMap);
            pouchClientMock.verify();
            PouchClient.fetchDocuments.restore();
            feedDbMock.verify();
            FeedDb.fetchSurfFeedsAndCategoriesWithSource.restore();
            surfFilterMock.verify();
            filterFeedsHandler.fetchFilterDocument.restore();
            done();
        });

    });

    it("should update filter document", (done)=> {
        let currentDocument = {
            "categories": [],
            "mediaTypes": [],
            "sourceTypes": []
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
            "mediaTypes": [],
            "sourceTypes": []
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
            "mediaTypes": [],
            "sourceTypes": []
        };
        let currentDocument = {
            "categories": [],
            "mediaTypes": [],
            "sourceTypes": []
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

    xit("should fetch feeds page by page with filter", (done)=> {
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
        let sandbox = sinon.sandbox.create();
        let pouchClientMock = sandbox.stub(PouchClient, "fetchDocuments");
        let query = "category/latestFeeds?include_docs=true&descending=true&limit=200&skip=1";
        pouchClientMock.withArgs(query).returns(Promise.resolve(feeds));


        let filterFeedsHandler = new FilterFeedsHandler();
        return filterFeedsHandler.fetchFeedsByPageWithFilter(filterStore).then(()=> {
            sandbox.restore();
            done();
        });
    });

    it("should delete the category from the filter document", (done)=> {
        let categoryId = "5B5AE0E9-2C36-0070-8569-AD5A68C0EFD7";
        let filterDocument = [{
            "_id": "surf-filter-id",
            "categories": [{
                "_id": "5B5AE0E9-2C36-0070-8569-AD5A68C0EFD7",
                "name": "Untitled Category 1"
            }],
            "mediaTypes": []
        }];

        let updateDocument = {
            "_id": "surf-filter-id",
            "categories": [],
            "mediaTypes": []
        };

        let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments");
        pouchClientMock.withArgs("category/surfFilter", { "include_docs": true }).returns(Promise.resolve(filterDocument));

        let pouchClientUpdateMock = sinon.mock(PouchClient).expects("updateDocument");
        pouchClientUpdateMock.withArgs(updateDocument).returns(Promise.resolve());


        let filterFeedsHandler = new FilterFeedsHandler();
        return filterFeedsHandler.deleteCategory(categoryId).then(()=> {
            pouchClientMock.verify();
            pouchClientUpdateMock.verify();
            PouchClient.fetchDocuments.restore();
            PouchClient.updateDocument.restore();
            done();
        });
    });
});
