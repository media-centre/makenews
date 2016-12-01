import IndexDocument from "../../../src/migration/db/20161130171020_IndexDocument";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import nock from "nock";
import { assert } from "chai";

describe("IndexDocument", () => {
    let accessToken = null, dbName = null;

    it("should give successResponse for cerating index", async() => {
        accessToken = "testToken";
        dbName = "testDb";
        let defaultDocument = {
            "index": {
                "fields": ["name", "id"]
            },
            "name": "defaultIndex"
        };

        let response = {
            "result": "created",
            "id": "_design/b508cf6095783f0e83e50554ee572df5460fea3b",
            "name": "defaultIndex"
        };

        nock("http://localhost:5984", {
            "reqheaders": {
                "Cookie": "AuthSession=" + accessToken,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }).post("/" + dbName + "/_index", defaultDocument).reply(HttpResponseHandler.codes.OK, response);

        let indexDocument = new IndexDocument(dbName, accessToken);
        let responseJson = await indexDocument.up();
        assert.deepEqual(responseJson, response);
    });

    it("should give successResponse as exists for cerating index", async() => {
        accessToken = "testToken";
        dbName = "testDb";
        let defaultDocument = {
            "index": {
                "fields": ["name", "id"]
            },
            "name": "defaultIndex"
        };

        let response = {
            "result": "exist",
            "id": "_design/b508cf6095783f0e83e50554ee572df5460fea3b",
            "name": "defaultIndex"
        };

        nock("http://localhost:5984", {
            "reqheaders": {
                "Cookie": "AuthSession=" + accessToken,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }).post("/" + dbName + "/_index", defaultDocument).reply(HttpResponseHandler.codes.OK, response);

        let indexDocument = new IndexDocument(dbName, accessToken);
        let responseJson = await indexDocument.up();
        assert.deepEqual(responseJson, response);
    });
});
