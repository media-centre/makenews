/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0, no-unused-vars:0, no-undefined:0*/

"use strict";
import PouchClient from "../../../src/js/db/PouchClient.js";
import SurfDb from "../../../src/js/surf/db/SurfDb.js";
import sinon from "sinon";
import { expect } from "chai";

describe("SurfDb", () => {
    describe("fetchAllSourcesWithCategories", () => {
        it("should fetch all sources with category documents", (done) => {
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments").withArgs("category/allSourcesWithCategories", { "include_docs": true }).returns(Promise.resolve(""));
            SurfDb.fetchAllSourcesWithCategories().then(() => {
                pouchClientMock.verify();
                PouchClient.fetchDocuments.restore();
                done();
            });
        });
    });
});
