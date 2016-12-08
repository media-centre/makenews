import IndexDocument from "../../../src/migration/db/20161130171020_IndexDocument";
import CouchClient from "../../../src/CouchClient";
import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";

chai.use(chaiAsPromised);

describe.only("IndexDocument", () => {
    let accessToken = "testToken", dbName = "testDb", sandbox = sinon.sandbox.create();
    let indexDoc = {
        "index": {
            "fields": ["name", "id"]
        },
        "name": "name-id"
    };

    afterEach("IndexDocument", () => {
        sandbox.restore();
    });

    it("should give successResponse for cerating index", async() => {
        let response = {
            "result": "created",
            "id": "_design/b508cf6095783f0e83e50554ee572df5460fea3b",
            "name": "defaultIndex"
        };

        let couchInstance = new CouchClient(dbName, accessToken);
        sandbox.stub(CouchClient, "instance")
          .withArgs(dbName, accessToken)
          .returns(couchInstance);
        let createIndexMock = sandbox.mock(couchInstance).expects("createIndex")
          .withArgs(indexDoc)
          .returns(response);


        let indexDocument = new IndexDocument(dbName, accessToken);
        await indexDocument.up();
        createIndexMock.verify();
    });

    it("should throw error if index creation failed", async() => {
        let couchInstance = new CouchClient(dbName, accessToken);
        sandbox.stub(CouchClient, "instance")
          .withArgs(dbName, accessToken)
          .returns(couchInstance);
        let createIndexMock = sandbox.mock(couchInstance).expects("createIndex")
          .withArgs(indexDoc)
          .throws(new Error("failed"));

        let indexDocument = new IndexDocument(dbName, accessToken);
        await assert.isRejected(indexDocument.up(), "failed");
        createIndexMock.verify();
    });
});
