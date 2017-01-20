import CollectionRoute from "../../../src/routes/helpers/CollectionRoute";
import { mockResponse } from "./../../helpers/MockResponse";
import CollectionRequestHandler from "../../../src/collection/CollectionRequestHandler";
import sinon from "sinon";
import { assert } from "chai";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";

describe("CollectionRoute", () => {
    let request = null, response = null, docId = null, collectionName = null;
    let authSession = null, collectionRoute = null, collectionRequestHandler = null, sandbox = null;

    beforeEach("CollectionRoute", () => {
        docId = "docId";
        collectionName = "collection name";
        authSession = "auth session";
        response = mockResponse();
        request = {
            "body": {
                "docId": docId,
                "collection": collectionName
            },
            "cookies": {
                "AuthSession": authSession
            }
        };
        collectionRoute = new CollectionRoute(request, response, {});
        collectionRequestHandler = new CollectionRequestHandler();
        sandbox = sinon.sandbox.create();
    });

    afterEach("CollectionRoute", () => {
        sandbox.restore();
    });

    it("should return success response when collection is successfully updated", async () => {
        sandbox.mock(CollectionRequestHandler).expects("instance").returns(collectionRequestHandler);
        let updateMock = sandbox.mock(collectionRequestHandler).expects("updateCollection")
            .withExactArgs(authSession, docId, collectionName)
            .returns(Promise.resolve({ "ok": true }));
        try {
            await collectionRoute.addToCollection();
            assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
            updateMock.verify();
        } catch(error) {
            assert.fail(error);
        }
    });

    it("should throw bad request when there is no collection", async () => {
        request = {
            "body": {
                "docId": docId
            },
            "cookies": {
                "AuthSession": authSession
            }
        };
        collectionRoute = new CollectionRoute(request, response, {});
        try {
            await collectionRoute.addToCollection();
            assert.fail();
        } catch(error) {
            assert.strictEqual(response.status(), HttpResponseHandler.codes.BAD_REQUEST);
        }
    });

    it("should throw bad request when collection is not updated", async () => {
        sandbox.mock(CollectionRequestHandler).expects("instance").returns(collectionRequestHandler);
        let updateMock = sandbox.mock(collectionRequestHandler).expects("updateCollection")
            .withExactArgs(authSession, docId, collectionName)
            .returns(Promise.reject({ "error": "failed to update" }));
        try {
            await collectionRoute.addToCollection();
            assert.fail();
        } catch(error) {
            updateMock.verify();
            assert.strictEqual(response.status(), HttpResponseHandler.codes.BAD_REQUEST);
        }
    });
});
