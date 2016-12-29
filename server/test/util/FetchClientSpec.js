import { getRequest } from "../../../server/src/util/FetchClient";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import nock from "nock";
import { assert } from "chai";
import { isRejected } from "./../helpers/AsyncTestHelper";

describe("FetchClient", () => {
    describe("getRequest", () => {
        it("should call get and get the response if status 200", async () => {
            let url = "http://mytest.com";
            let params = { "q": "key" };
            let expectedResponse = {
                "data": [{ "id": 1, "url": "http://test.com" }]
            };
            nock(url)
                .get("/?q=key")
                .reply(HttpResponseHandler.codes.OK, expectedResponse);
            let response = await getRequest(url, params);
            assert.deepEqual(response, expectedResponse);
        });

        it("should throw error if status is not 200", async () => {
            let url = "http://mytest.com", params = { "q": "key" };
            let error = {
                "message": "missing"
            };
            let status = HttpResponseHandler.codes.BAD_REQUEST;
            nock(url)
                .get("/?q=key")
                .reply(status, error);
            await isRejected(getRequest(url, params), { status, error });
        });
    });
});
