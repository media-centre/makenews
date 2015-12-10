/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0, no-unused-vars:0, no-undefined:0*/

"use strict";
import PouchClient from "../../../src/js/db/PouchClient.js";
import SurfDb from "../../../src/js/surf/db/SurfDb.js";
import sinon from "sinon";
import { expect } from "chai";

describe("SurfDb", () => {
    describe("fetchAllFeedsAndCategoriesWithSource", () => {
        it("should fetch all feeds and category documents", (done) => {
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchLinkedDocuments").withArgs("category/allFeedsAndCategoriesWithSource", { "include_docs": true }).returns(Promise.resolve(""));
            SurfDb.fetchAllFeedsAndCategoriesWithSource().then(() => {
                pouchClientMock.verify();
                PouchClient.fetchLinkedDocuments.restore();
                done();
            });
        });
    });
});
