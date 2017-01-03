import RssURLSearchIndex from "../../../src/migration/admin/20170103161414_RssURLSearchIndex";
import CouchClient from "../../../src/CouchClient";
import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";

chai.use(chaiAsPromised);

describe("RssURLSearchIndex", () => {
    let accessToken = "testToken", dbName = "testDb", sandbox = sinon.sandbox.create();
    let indexDoc = {
        "_id": "_design/webUrlSearch",
        "fulltext": {
            "by_name": {
                "index":
                    "function(doc) { if(doc.sourceType === 'web') { var ret=new Document(); ret.add(doc.name, {'field':'name', 'store': 'yes'}); ret.add(doc._id, {'field':'url', 'store': 'yes'}); return ret; } }"
            }
        }
    };

    afterEach("RssURLSearchIndex", () => {
        sandbox.restore();
    });

    it("should give successResponse for creating index", async() => {
        let response = {
            "ok": "true",
            "_id": "_design/webUrlSearch",
            "_rev": "test_revision"
        };

        let couchInstance = new CouchClient(accessToken, dbName);
        sandbox.stub(CouchClient, "instance")
          .withArgs(accessToken, dbName).returns(couchInstance);
        let createIndexMock = sandbox.mock(couchInstance).expects("saveDocument")
          .withArgs("_design/webUrlSearch", indexDoc)
          .returns(response);


        let indexDocument = new RssURLSearchIndex(dbName, accessToken);
        await indexDocument.up();
        createIndexMock.verify();
    });

    it("should throw error if index creation failed", async() => {
        let couchInstance = new CouchClient(accessToken, dbName);
        sandbox.stub(CouchClient, "instance")
          .withArgs(accessToken, dbName).returns(couchInstance);
        let createIndexMock = sandbox.mock(couchInstance).expects("saveDocument")
          .withArgs("_design/webUrlSearch", indexDoc)
          .throws(new Error("failed"));

        let indexDocument = new RssURLSearchIndex(dbName, accessToken);
        await assert.isRejected(indexDocument.up(), "failed");
        createIndexMock.verify();
    });
});
