/*eslint max-nested-callbacks:0 */
"use strict";
import Source from "../../src/js/config/Source.js";
import PouchClient from "../../src/js/db/PouchClient.js";
import CategoryDb from "../../src/js/config/db/CategoryDb.js";
import sinon from "sinon";

describe("Source", () => {
    describe.only("delete", () => {
        let sourceId = null, categoryId = null, sourceDocument = null;
        let pouchClientGetDocumentMock = null, categoryDbDeleteSourceWithReference = null, pouchClientUpdateDoucmentMock = null;
        beforeEach("delete", () => {
            sourceId = "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3";
            categoryId = "95fa167311bf340b461ba414f1004074";
            sourceDocument = {
                "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
                "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
                "docType": "source",
                "sourceType": "twitter",
                "url": "@balaswecha",
                "categoryIds": [
                    "95fa167311bf340b461ba414f1004074"
                ],
                "status": "valid"
            };

            pouchClientGetDocumentMock = sinon.mock(PouchClient).expects("getDocument");
            categoryDbDeleteSourceWithReference = sinon.mock(CategoryDb).expects("deleteSourceWithReference");
            pouchClientUpdateDoucmentMock = sinon.mock(PouchClient).expects("updateDocument");
        });

        afterEach("delete", () => {
            PouchClient.getDocument.restore();
            CategoryDb.deleteSourceWithReference.restore();
            PouchClient.updateDocument.restore();
        });

        it("delete source document along with the references when category id is available in the cateogry list", (done) => {
            pouchClientGetDocumentMock.withArgs(sourceId).returns(Promise.resolve(sourceDocument));
            categoryDbDeleteSourceWithReference.withArgs(sourceId).returns(Promise.resolve("response"));
            let source = new Source(sourceId);
            source.delete(categoryId).then(response => {
                pouchClientGetDocumentMock.verify();
                categoryDbDeleteSourceWithReference.verify();
                done();
            });
        });

        it("should not delete the source document if the category id does not exists in list of categories", (done) => {
            categoryId = "test-category-id";
            pouchClientGetDocumentMock.withArgs(sourceId).returns(Promise.resolve(sourceDocument));
            let source = new Source(sourceId);
            source.delete(categoryId).catch(error => {
                pouchClientGetDocumentMock.verify();
                done();
            });
        });

        it.only("update source document by removing the category id if more than one category in the list", (done) => {
            sourceDocument = {
                "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
                "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
                "docType": "source",
                "sourceType": "twitter",
                "url": "@balaswecha",
                "categoryIds": [
                    "95fa167311bf340b461ba414f1004073", "95fa167311bf340b461ba414f1004074", "95fa167311bf340b461ba414f1004075"
                ],
                "status": "valid"
            };
            let sourceUpdateDocument = {
                "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
                "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
                "docType": "source",
                "sourceType": "twitter",
                "url": "@balaswecha",
                "categoryIds": [
                    "95fa167311bf340b461ba414f1004073", "95fa167311bf340b461ba414f1004075"
                ],
                "status": "valid"
            };
            pouchClientGetDocumentMock.withArgs(sourceId).returns(Promise.resolve(sourceDocument));
            pouchClientUpdateDoucmentMock.withArgs(sourceUpdateDocument).returns(Promise.resolve("success"));
            let source = new Source(sourceId);
            source.delete(categoryId).then(response => {
                pouchClientGetDocumentMock.verify();
                pouchClientUpdateDoucmentMock.verify();
                done();
            });
        });
    });
});
