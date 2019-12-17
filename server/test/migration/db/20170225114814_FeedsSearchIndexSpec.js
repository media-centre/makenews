import FeedsSearchIndex from "./../../../src/migration/db/20170225114814_FeedsSearchIndex";
import sinon from "sinon";
import CouchClient from "../../../src/CouchClient";
import { assert } from "chai";

describe("FeedsSearchIndex", () => {
    let sandbox = null;
    let couchClientInstance = null;
    let indexDocument = null;
    const dbName = "test";
    const accessToken = "test Token";
    let indexDoc = null;

    beforeEach("FeedsSearchIndex", () => {
        sandbox = sinon.sandbox.create();
        couchClientInstance = new CouchClient(accessToken, dbName);
        indexDocument = new FeedsSearchIndex(dbName, accessToken);
        indexDoc = { "_id": "_design/feedSearch",
            "fulltext": {
                "by_document": {
                    "index": "function(doc) {if(doc.docType === 'feed') { var ret=new Document(); ret.add(doc.title,  {'field':'title', 'store': 'no'}); ret.add(doc.bookmark,  {'field':'bookmark', 'store': 'no'}); ret.add(doc.description,  {'field':'description', 'store': 'no'}); ret.add(doc.sourceType, {'field': 'sourceType', 'store': 'no'}); ret.add(new Date(doc.pubDate), {'field':'pubDate', 'store': 'no', 'type': 'date'}); return ret; } }" //eslint-disable-line max-len
                }
            }
        };
    });

    afterEach("FeedsSearchIndex", () => {
        sandbox.restore();
    });

    it("should return success response from the db", async() => {

        const successResponse = {
            "ok": true,
            "id": "test_ID",
            "rev": "test_rev"
        };
        sandbox.mock(CouchClient).expects("instance").returns(couchClientInstance);
        const couchClientMock = sandbox.mock(couchClientInstance).expects("saveDocument").withArgs("_design/feedSearch", indexDoc).returns(Promise.resolve(successResponse));
        await indexDocument.up();
        couchClientMock.verify();
    });

    it("should throw error if index creation failed", async() => {
        const couchInstance = new CouchClient(accessToken, dbName);
        sandbox.stub(CouchClient, "instance")
            .withArgs(accessToken, dbName).returns(couchInstance);
        const createIndexMock = sandbox.mock(couchInstance).expects("saveDocument")
            .withArgs("_design/feedSearch", indexDoc)
            .throws(new Error("failed"));

        await assert.isRejected(indexDocument.up(), "failed");
        createIndexMock.verify();
    });
});
