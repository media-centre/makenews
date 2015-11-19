/* eslint max-nested-callbacks: [2, 5] */

"use strict";
import PouchClient from "../../../src/js/db/PouchClient.js";
import CategoryDb from "../../../src/js/config/db/CategoryDb.js";
import sinon from "sinon";

describe("CategoryDb", () => {
    describe("fetchAllCategoryDocuments", () => {
        it("should fetch all category documents", () => {
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments").withArgs("category/allCategories", { "include_docs": true });
            CategoryDb.fetchAllCategoryDocuments();
            pouchClientMock.verify();
            PouchClient.fetchDocuments.restore();
        });
    });
});
