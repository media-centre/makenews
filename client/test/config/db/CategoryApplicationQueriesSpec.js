/* eslint max-nested-callbacks: [2, 5] */

"use strict";
import CategoryDb from "../../../src/js/config/db/CategoryDb.js";
import CategoryApplicationQueries from "../../../src/js/config/db/CategoriesApplicationQueries.js";
import sinon from "sinon";
import { expect } from "chai";

describe("CategoryApplicationQueries", () => {
    describe("fetchAllCategories", () => {
        let fetchAllCategoryDocumentsStub = null;

        beforeEach("fetchAllCategories", () => {
            fetchAllCategoryDocumentsStub = sinon.stub(CategoryDb, "fetchAllCategoryDocuments");
        });

        afterEach("fetchAllCategories", () => {
            CategoryDb.fetchAllCategoryDocuments.restore();
        });

        it("should fetch and resolve id and name of category documents", (done) => {
            let resultDocs = [
                {
                    "_id": "1",
                    "docType": "category",
                    "name": "Sports"
                },
                {
                    "_id": "2",
                    "docType": "category",
                    "name": "Politics"
                }
            ];
            fetchAllCategoryDocumentsStub.returns(Promise.resolve(resultDocs));
            CategoryApplicationQueries.fetchAllCategories().then(categories => {
                let expectedCategories = [{ "_id": "1", "name": "Sports" }, { "_id": "2", "name": "Politics" }];
                expect(expectedCategories).to.deep.equal(categories);
                done();
            });
        });

        it("should reject with error if fetching category document fails", (done) => {
            fetchAllCategoryDocumentsStub.returns(Promise.reject("error"));
            CategoryApplicationQueries.fetchAllCategories().catch(error => {
                expect("error").to.eq(error);
                done();
            });
        });
    });

    describe("fetchSourceConfigurationsByCategoryId", () => {
        let fetchRssConfigurationsStub = null, categoryId = null;

        beforeEach("fetchAllCategories", () => {
            categoryId = "test_category";
            fetchRssConfigurationsStub = sinon.stub(CategoryDb, "fetchSourceConfigurationsByCategoryId");
        });

        afterEach("fetchAllCategories", () => {
            CategoryDb.fetchSourceConfigurationsByCategoryId.restore();
        });

        it("should throw error if the category id is empty", (done) => {
            categoryId = "";
            CategoryApplicationQueries.fetchSourceUrlsObj(categoryId).catch(error => {
                expect("category id can not be empty").to.equal(error);
                done();
            });
        });

        it("should return list of urls along with the id for a category id", () => {
            let result = [
                { "_id": "rss_url_id1",
                    "docType": "source",
                    "sourceType": "rss",

                    "url": "www.yahoo.com/rss",
                    "categoryIds": ["dummy_category1", "test_category"]
                },
                {
                    "_id": "rss_url_id2",
                    "docType": "source",
                    "sourceType": "facebook",
                    "url": "www.google.com/rss",
                    "categoryIds": ["test_category"]
                }
            ];
            let expectedRssDetails = {
                "rss": [{ "_id": "rss_url_id1", "url": "www.yahoo.com/rss" }],
                "facebook": [{ "_id": "rss_url_id2", "url": "www.google.com/rss" }]
            };

            fetchRssConfigurationsStub.withArgs(categoryId).returns(Promise.resolve(result));
            return CategoryApplicationQueries.fetchSourceUrlsObj(categoryId).then(rssDetails => {
                expect(expectedRssDetails).to.deep.equal(rssDetails);
            });
        });

        it("should reject in case of any other errors", (done) => {
            fetchRssConfigurationsStub.withArgs(categoryId).returns(Promise.reject("test_error"));
            CategoryApplicationQueries.fetchSourceUrlsObj(categoryId).catch(error => {
                expect("test_error").to.equal(error);
                done();
            });
        });
    });
});
