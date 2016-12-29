import { searchDocuments } from "./../../server/src/LuceneClient";
import ApplicationConfig from "./../../server/src/config/ApplicationConfig";
import { assert } from "chai";
import sinon from "sinon";
import * as FetchClient from "../src/util/FetchClient";

describe("LuceneClient", () => {
    let sandbox = sinon.sandbox.create();

    afterEach("LuceneClient", () => {
        sandbox.restore();
    });

    describe("findDocument", () => {
        it("should fetch the documents", async () => {
            let query = {
                "q": "name:my"
            };

            let expectedDocs = {
                "q": "name:my",
                "fetch_duration": 15,
                "total_rows": 2,
                "limit": 25,
                "search_duration": 0,
                "etag": "1670ee6e173",
                "skip": 0,
                "rows": [{
                    "score": 0.16044297814369202,
                    "id": "e1a47cad4e67c7c678b72830280021dd",
                    "fields": { "name": "my name is rav" }
                }, {
                    "score": 0.16044297814369202,
                    "id": "1",
                    "fields": { "name": "my name is murali" }
                }]
            };
            sandbox.stub(ApplicationConfig, "instance").returns({ "searchEngineUrl": () => "http://db.url" });
            let url = "http://db.url/testDb/_design/test/myView";
            let fetchClientMock = sandbox.mock(FetchClient).expects("getRequest").withArgs(url)
                .returns(Promise.resolve(expectedDocs));
            let resultDocs = await searchDocuments("testDb", "_design/test/myView", query);
            fetchClientMock.verify();
            assert.deepEqual(resultDocs, expectedDocs);
        });
    });
});
