/* eslint max-nested-callbacks: [2, 5] */

"use strict";
import PouchClient from "../../../src/js/db/PouchClient.js";
import CategoryDb from "../../../src/js/config/db/CategoryDb.js";
import sinon from "sinon";
import {expect} from "chai";

describe("CategoryDb", () => {
    describe("fetchAllCategoryDocuments", () => {
        it("should fetch all category documents", () => {
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments").withArgs("category/allCategories", { "include_docs": true });
            CategoryDb.fetchAllCategoryDocuments();
            pouchClientMock.verify();
            PouchClient.fetchDocuments.restore();
        });
    });

    describe("fetchRssConfigurations", () => {
        it("should fetch rss configurations for a category id", () => {
            var categoryId = "categoryId";
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments").withArgs("category/rssConfigurations", { "include_docs": true, "key": categoryId });
            CategoryDb.fetchRssConfigurations(categoryId);
            pouchClientMock.verify();
            PouchClient.fetchDocuments.restore();
        });

        it("should throw error if category id is invalid", () => {
            let fetchRssConfigurationsFunc = function() {
                CategoryDb.fetchRssConfigurations("");
            };
            expect(fetchRssConfigurationsFunc).to.throw(Error, "category id should not be empty");
        });
    });
});
