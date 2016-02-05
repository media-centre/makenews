/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0*/

"use strict";
import CategoryDb from "../../../src/js/config/db/CategoryDb.js";
import CategoryApplicationQueries from "../../../src/js/config/db/CategoriesApplicationQueries.js";
import { STATUS_VALID } from "../../../src/js/config/Source.js";
import sinon from "sinon";
import { expect } from "chai";

describe("CategoryApplicationQueries", () => {
    describe("fetchAllCategories", () => {
        it("should fetch and resolve id and name of category documents", () => {
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
            let fetchAllCategoryDocumentsStub = sinon.stub(CategoryDb, "fetchAllCategoryDocuments");
            fetchAllCategoryDocumentsStub.returns(Promise.resolve(resultDocs));
            return CategoryApplicationQueries.fetchAllCategories().then(categories => {
                let expectedCategories = [{ "_id": "1", "name": "Sports" }, { "_id": "2", "name": "Politics" }];
                expect(expectedCategories).to.deep.equal(categories);
                CategoryDb.fetchAllCategoryDocuments.restore();
            });
        });

        it("should reject with error if fetching category document fails", (done) => {
            let fetchAllCategoryDocumentsStub = sinon.stub(CategoryDb, "fetchAllCategoryDocuments");
            fetchAllCategoryDocumentsStub.returns(Promise.reject("error"));
            CategoryApplicationQueries.fetchAllCategories().catch(error => {
                expect("error").to.eq(error);
                CategoryDb.fetchAllCategoryDocuments.restore();
                done();
            });
        });
    });

    describe("fetchSourceConfigurationsByCategoryId", () => {

        it("should throw error if the category id is empty", (done) => {
            let categoryId = "";
            CategoryApplicationQueries.fetchSortedSourceUrlsObj(categoryId).catch(error => {
                expect("category id can not be empty").to.equal(error);
                done();
            });
        });

        it("should return list of urls along with the id for a category id", (done) => {
            let categoryId = "test_category";
            let rss = { "_id": "rss_url_id1",
                "docType": "source",
                "sourceType": "rss",
                "status": STATUS_VALID,
                "url": "www.yahoo.com/rss",
                "categoryIds": ["dummy_category1", "test_category"]
            };
            let fb = {
                "_id": "fb_url_id2",
                "docType": "source",
                "sourceType": "facebook",
                "status": STATUS_VALID,
                "url": "www.google.com/rss",
                "categoryIds": ["test_category"]
            };
            let result = [rss, fb];
            let expectedRssDetails = {
                "rss": [rss],
                "facebook": [fb]
            };
            let fetchRssConfigurationsStub = sinon.stub(CategoryDb, "fetchSourceConfigurationsByCategoryId");
            fetchRssConfigurationsStub.withArgs(categoryId).returns(Promise.resolve(result));
            return CategoryApplicationQueries.fetchSortedSourceUrlsObj(categoryId).then(rssDetails => {
                expect(expectedRssDetails).to.deep.equal(rssDetails);
                CategoryDb.fetchSourceConfigurationsByCategoryId.restore();
                done();
            });
        });

        it("should return list of urls in sorted order", (done) => {
            let categoryId = "test_category";
            let rss1 = { "_id": "rss_url_id1",
                "docType": "source",
                "sourceType": "rss",
                "status": STATUS_VALID,
                "url": "www.yahoo.com/rss",
                "categoryIds": ["dummy_category1", "test_category"]
                };
            let rss2 = { "_id": "rss_url_id2",
                "docType": "source",
                "sourceType": "rss",
                "status": STATUS_VALID,
                "url": "www.google.com/rss",
                "categoryIds": ["dummy_category1", "test_category"]
            };
            let fb1 = {
                "_id": "facebook_url_id1",
                "docType": "source",
                "sourceType": "facebook",
                "status": STATUS_VALID,
                "url": "https://wwww.facebook.com/chennai",
                "categoryIds": ["test_category"]
            };
            let fb2 = {
                "_id": "facebook_url_id2",
                "docType": "source",
                "sourceType": "facebook",
                "status": STATUS_VALID,
                "url": "https://wwww.facebook.com/SachinTendulkar",
                "categoryIds": ["test_category"]
            };
            let tw1 = {
                "_id": "twitter_url_id1",
                "docType": "source",
                "sourceType": "twitter",
                "status": STATUS_VALID,
                "url": "#obama",
                "categoryIds": ["test_category"]
            };
            let tw2 = {
                "_id": "twitter_url_id2",
                "docType": "source",
                "sourceType": "twitter",
                "status": STATUS_VALID,
                "url": "#sachin",
                "categoryIds": ["test_category"]
            };
            let result = [rss1, rss2, fb2, fb1, tw2, tw1];
            let expectedRssDetails = {
                "rss": [rss2, rss1],
                "facebook": [fb1, fb2],
                "twitter": [tw1, tw2]
            };
            let fetchSourceConfigurationsStub = sinon.stub(CategoryDb, "fetchSourceConfigurationsByCategoryId");
            fetchSourceConfigurationsStub.withArgs(categoryId).returns(Promise.resolve(result));
            CategoryApplicationQueries.fetchSortedSourceUrlsObj(categoryId).then(rssDetails => {
                expect(expectedRssDetails).to.deep.equal(rssDetails);
                CategoryDb.fetchSourceConfigurationsByCategoryId.restore();
                done();
            });
        });

        it("should reject in case of any other errors", (done) => {
            let categoryId = "test_category";
            let fetchRssConfigurationsStub = sinon.stub(CategoryDb, "fetchSourceConfigurationsByCategoryId");
            fetchRssConfigurationsStub.withArgs(categoryId).returns(Promise.reject("test_error"));
            CategoryApplicationQueries.fetchSortedSourceUrlsObj(categoryId).catch(error => {
                expect("test_error").to.equal(error);
                CategoryDb.fetchSourceConfigurationsByCategoryId.restore();
                done();
            });
        });
    });
});

