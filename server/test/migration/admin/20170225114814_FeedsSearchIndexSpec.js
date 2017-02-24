import FeedsSearchIndex from "./../../../src/migration/admin/20170225114814_FeedsSearchIndex";
import sinon from "sinon";
import CouchClient from "../../../src/CouchClient";
import { assert } from "chai";

describe("FeedsSearchIndex", () => {
    let sandbox = null, couchClientInstance = null, indexDocument = null;
    let dbName = "test";
    let accessToken = "test Token", indexDoc = null;

    beforeEach("FeedsSearchIndex", () => {
        sandbox = sinon.sandbox.create();
        couchClientInstance = new CouchClient(accessToken, dbName);
        indexDocument = new FeedsSearchIndex(dbName, accessToken);
        indexDoc = { "_id": "_design/feedSearch",
            "fulltext": {
                "by_title": {
                    "index":
                        "function(doc) { if(doc.docType === 'feed') { return doc; } }"
                }
            }
        };
    });

    afterEach("FeedsSearchIndex", () => {
        sandbox.restore();
    });

    it("should return success response from the db", async () => {

        let successResponse = {
            "ok": true,
            "id": "test_ID",
            "rev": "test_rev"
        };
        sandbox.mock(CouchClient).expects("instance").returns(couchClientInstance);
        let couchClientMock = sandbox.mock(couchClientInstance).expects("saveDocument").withArgs("_design/feedSearch", indexDoc).returns(Promise.resolve(successResponse));
        await indexDocument.up();
        couchClientMock.verify();
    });

    it("should throw error if index creation failed", async() => {
        let couchInstance = new CouchClient(accessToken, dbName);
        sandbox.stub(CouchClient, "instance")
            .withArgs(accessToken, dbName).returns(couchInstance);
        let createIndexMock = sandbox.mock(couchInstance).expects("saveDocument")
            .withArgs("_design/feedSearch", indexDoc)
            .throws(new Error("failed"));

        await assert.isRejected(indexDocument.up(), "failed");
        createIndexMock.verify();
    });
});
