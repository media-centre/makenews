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
});
