/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0*/

"use strict";
import SurfDb from "../../../src/js/surf/db/SurfDb.js";
import SurfApplicationQueries from "../../../src/js/surf/db/SurfApplicationQueries.js";
import sinon from "sinon";
import { expect } from "chai";

describe("SurfApplicationQueries", () => {
    describe("allFeedsWithCategoryNames", () => {
        it("should fetch all feeds and return with category name", () => {
            let resultDocs = [{
                "key": "fbId1",
                "id": "fbId1",
                "value": {
                    "_id": "sportsCategoryId1"
                },
                "doc": {
                    "docType": "category",
                    "name": "Sports",
                    "_id": "sportsCategoryId1",
                    "_rev": "1-4b61e9edacc78ab1f189b68345d4d410"
                }
            }, {
                "key": "rssId1",
                "id": "feedId1",
                "value": null,
                "doc": {
                    "docType": "feed",
                    "title": "tn",
                    "description": "www.facebookpolitics.com",
                    "sourceId": "rssId1",
                    "_id": "feedId1",
                    "_rev": "1-e41ef125b2f5fbef4f20d8c896eeea53"
                }
            }, {
                "key": "rssId1",
                "id": "rssId1",
                "value": {
                    "_id": "sportsCategoryId1"
                },
                "doc": {
                    "docType": "category",
                    "name": "Sports",
                    "_id": "sportsCategoryId1",
                    "_rev": "1-4b61e9edacc78ab1f189b68345d4d410"
                }
            }, {
                "key": "rssId2",
                "id": "rssId2",
                "value": {
                    "_id": "politicsCategoryId2"
                },
                "doc": {
                    "docType": "category",
                    "name": "Politics",
                    "_id": "politicsCategoryId2",
                    "_rev": "1-175853337b49fcd1db6474777f871d4a"
                }
            }];


            let expectedSources = [{
                "docType": "feed",
                "title": "tn",
                "description": "www.facebookpolitics.com",
                "sourceId": "rssId1",
                "_id": "feedId1",
                "_rev": "1-e41ef125b2f5fbef4f20d8c896eeea53",
                "categoryNames": ["Sports"]
            }];

            let fetchAllSourcesWithCategoriesMock = sinon.mock(SurfDb).expects("fetchAllFeedsAndCategoriesWithSource");
            fetchAllSourcesWithCategoriesMock.returns(Promise.resolve(resultDocs));
            return SurfApplicationQueries.fetchAllFeedsWithCategoryName().then(sources => {
                expect(expectedSources).to.deep.equal(sources);
                fetchAllSourcesWithCategoriesMock.verify();
                SurfDb.fetchAllFeedsAndCategoriesWithSource.restore();
            });
        });

        it("should reject with error if fetching documents fails", () => {
            let fetchAllSourcesWithCategoriesStub = sinon.stub(SurfDb, "fetchAllFeedsAndCategoriesWithSource");
            fetchAllSourcesWithCategoriesStub.returns(Promise.reject("error"));
            return SurfApplicationQueries.fetchAllFeedsWithCategoryName().catch(error => {
                expect(error).to.eq("error");
                SurfDb.fetchAllFeedsAndCategoriesWithSource.restore();
            });
        });
    });
});
