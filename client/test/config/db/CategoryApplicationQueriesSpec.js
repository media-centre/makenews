/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0*/

"use strict";
import CategoryDb from "../../../src/js/config/db/CategoryDb.js";
import CategoryApplicationQueries from "../../../src/js/config/db/CategoriesApplicationQueries.js";
import { CategoryDocument, STATUS_VALID } from "../../../src/js/config/actions/CategoryDocuments.js";
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
            CategoryApplicationQueries.fetchSourceUrlsObj(categoryId).catch(error => {
                expect("category id can not be empty").to.equal(error);
                done();
            });
        });

        it("should return list of urls along with the id for a category id", (done) => {
            let categoryId = "test_category";
            let result = [
                { "_id": "rss_url_id1",
                    "docType": "source",
                    "sourceType": "rss",
                    "status": STATUS_VALID,
                    "url": "www.yahoo.com/rss",
                    "categoryIds": ["dummy_category1", "test_category"]
                },
                {
                    "_id": "rss_url_id2",
                    "docType": "source",
                    "sourceType": "facebook",
                    "status": STATUS_VALID,
                    "url": "www.google.com/rss",
                    "categoryIds": ["test_category"]
                }
            ];
            let expectedRssDetails = {
                "rss": [{ "_id": "rss_url_id1", "url": "www.yahoo.com/rss", "status": STATUS_VALID }],
                "facebook": [{ "_id": "rss_url_id2", "url": "www.google.com/rss", "status": STATUS_VALID }]
            };
            let fetchRssConfigurationsStub = sinon.stub(CategoryDb, "fetchSourceConfigurationsByCategoryId");
            fetchRssConfigurationsStub.withArgs(categoryId).returns(Promise.resolve(result));
            return CategoryApplicationQueries.fetchSourceUrlsObj(categoryId).then(rssDetails => {
                expect(expectedRssDetails).to.deep.equal(rssDetails);
                CategoryDb.fetchSourceConfigurationsByCategoryId.restore();
                done();
            });
        });

        it("should reject in case of any other errors", (done) => {
            let categoryId = "test_category";
            let fetchRssConfigurationsStub = sinon.stub(CategoryDb, "fetchSourceConfigurationsByCategoryId");
            fetchRssConfigurationsStub.withArgs(categoryId).returns(Promise.reject("test_error"));
            CategoryApplicationQueries.fetchSourceUrlsObj(categoryId).catch(error => {
                expect("test_error").to.equal(error);
                CategoryDb.fetchSourceConfigurationsByCategoryId.restore();
                done();
            });
        });
    });

    describe("addRssUrlConfiguration", () => {
        it("should add or udpate the rss url configuration", () => {
            let categoryId = "test_id";
            let url = "url";
            let status = STATUS_VALID;
            sinon.stub(CategoryDocument, "getNewDocument").withArgs(categoryId, url, status).returns({});
            let createOrUpdateMock = sinon.mock(CategoryDb).expects("createOrUpdateSource");
            createOrUpdateMock.withArgs({});
            CategoryApplicationQueries.addUrlConfiguration(categoryId, url, status);
            createOrUpdateMock.verify();
            CategoryDocument.getNewDocument.restore();
            CategoryDb.createOrUpdateSource.restore();
        });
    });
});

