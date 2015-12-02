/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0*/

"use strict";
import SurfDb from "../../../src/js/surf/db/SurfDb.js";
import SurfApplicationQueries from "../../../src/js/surf/db/SurfApplicationQueries.js";
import sinon from "sinon";
import { expect } from "chai";

describe("SurfApplicationQueries", () => {
    describe("fetchAllSourcesWithCategoryName", () => {
        it("should fetch all sources and return with category name", () => {
            let resultDocs = [
                {
                    "_id": "sourceId1",
                    "docType": "source",
                    "sourceType": "rss",
                    "url": "www.hindu.com/rss",
                    "categoryIds": ["sportsCategoryId1"]
                },
                {
                    "_id": "sourceId2",
                    "docType": "source",
                    "sourceType": "rss",
                    "url": "www.guardian.com/rss",
                    "categoryIds": ["sportsCategoryId1", "politicsCategoryId1"]
                },
                {
                    "_id": "sourceId3",
                    "docType": "source",
                    "sourceType": "rss",
                    "url": "www.hindu.com/politics/rss",
                    "categoryIds": ["politicsCategoryId1"]
                },
                {
                    "_id": "sportsCategoryId1",
                    "docType": "category",
                    "name": "Sports"
                },
                {
                    "_id": "politicsCategoryId1",
                    "docType": "category",
                    "name": "Politics"
                }
            ];
            let expectedSources = [{
                "_id": "sourceId1",
                "docType": "source",
                "sourceType": "rss",
                "url": "www.hindu.com/rss",
                "categoryIds": ["sportsCategoryId1"],
                "categoryNames": ["Sports"]
            },
                {
                    "_id": "sourceId2",
                    "docType": "source",
                    "sourceType": "rss",
                    "url": "www.guardian.com/rss",
                    "categoryIds": ["sportsCategoryId1", "politicsCategoryId1"],
                    "categoryNames": ["Sports", "Politics"]
                },
                {
                    "_id": "sourceId3",
                    "docType": "source",
                    "sourceType": "rss",
                    "url": "www.hindu.com/politics/rss",
                    "categoryIds": ["politicsCategoryId1"],
                    "categoryNames": ["Politics"]
                }
            ];

            let fetchAllSourcesWithCategoriesMock = sinon.mock(SurfDb).expects("fetchAllSourcesWithCategories");
            fetchAllSourcesWithCategoriesMock.returns(Promise.resolve(resultDocs));
            return SurfApplicationQueries.fetchAllSourcesWithCategoryName().then(sources => {
                expect(expectedSources).to.deep.equal(sources);
                fetchAllSourcesWithCategoriesMock.verify();
                SurfDb.fetchAllSourcesWithCategories.restore();
            });
        });

        it("should reject with error if fetching documents fails", () => {
            let fetchAllSourcesWithCategoriesStub = sinon.stub(SurfDb, "fetchAllSourcesWithCategories");
            fetchAllSourcesWithCategoriesStub.returns(Promise.reject("error"));
            return SurfApplicationQueries.fetchAllSourcesWithCategoryName().catch(error => {
                expect(error).to.eq("error");
                SurfDb.fetchAllSourcesWithCategories.restore();
            });
        });
    });
});
