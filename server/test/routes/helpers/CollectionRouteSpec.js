import CollectionRoute from "../../../src/routes/helpers/CollectionRoute";
import { mockResponse } from "./../../helpers/MockResponse";
import CollectionRequestHandler from "../../../src/collection/CollectionRequestHandler";
import sinon from "sinon";
import { assert } from "chai";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";

describe("CollectionRoute", () => {

    describe("addToCollection", () => {
        let request = null, response = null, docId = null, collectionName = null;
        let authSession = null, collectionRoute = null, collectionRequestHandler = null, sandbox = null;

        beforeEach("addToCollection", () => {
            docId = "docId";
            collectionName = "collection name";
            authSession = "auth session";
            response = mockResponse();
            request = {
                "body": {
                    "docId": docId,
                    "collection": collectionName,
                    "isNewCollection": true
                },
                "cookies": {
                    "AuthSession": authSession
                }
            };
            collectionRoute = new CollectionRoute(request, response, {});
            collectionRequestHandler = new CollectionRequestHandler();
            sandbox = sinon.sandbox.create();
        });

        afterEach("addToCollection", () => {
            sandbox.restore();
        });

        it("should return success response when collection is successfully updated", async() => {
            sandbox.mock(CollectionRequestHandler).expects("instance").returns(collectionRequestHandler);
            let updateMock = sandbox.mock(collectionRequestHandler).expects("updateCollection")
                .withExactArgs(authSession, docId, collectionName, true)
                .returns(Promise.resolve({ "ok": true }));
            try {
                await collectionRoute.addToCollection();
                assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
                updateMock.verify();
            } catch (error) {
                assert.fail(error);
            }
        });

        it("should throw bad request when there is no collection", async() => {
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
            } catch (error) {
                assert.strictEqual(response.status(), HttpResponseHandler.codes.BAD_REQUEST);
            }
        });

        it("should throw bad request when collection is not updated", async() => {
            sandbox.mock(CollectionRequestHandler).expects("instance").returns(collectionRequestHandler);
            let updateMock = sandbox.mock(collectionRequestHandler).expects("updateCollection")
                .withExactArgs(authSession, docId, collectionName, true)
                .returns(Promise.reject({ "error": "failed to update" }));
            try {
                await collectionRoute.addToCollection();
                assert.fail();
            } catch (error) {
                updateMock.verify();
                assert.strictEqual(response.status(), HttpResponseHandler.codes.BAD_REQUEST);
            }
        });
    });

    describe("getAllCollections", () => {
        let collectionRequestHandler = null, response = null, request = null, collectionName = null,
            authSession = "auth session", collectionRoute = null, sandbox = null;

        beforeEach("getAllCollections", () => {
            response = mockResponse();
            request = {
                "body": {
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

        afterEach("addToCollection", () => {
            sandbox.restore();
        });

        it("should return all collections", async () => {
            let collection = { "docs": ["first", "second"] };
            sandbox.mock(CollectionRequestHandler).expects("instance").returns(collectionRequestHandler);
            let getCollectionsMock = sandbox.mock(collectionRequestHandler).expects("getAllCollections");
            getCollectionsMock.withExactArgs(authSession).returns(Promise.resolve(collection));
            try {
                await collectionRoute.getAllCollections();
                assert.strictEqual(response.json(), collection);
                getCollectionsMock.verify();
            } catch(error) {
                assert.fail(error);
            }
        });

        it("should throw error when fetching collection failed", async () => {
            sandbox.mock(CollectionRequestHandler).expects("instance").returns(collectionRequestHandler);
            let getCollectionsMock = sandbox.mock(collectionRequestHandler).expects("getAllCollections");
            getCollectionsMock.returns(Promise.reject({ "error": "unexpected response from db" }));
            try {
                await collectionRoute.getAllCollections();
                assert.fail();
            } catch(error) {
                assert.deepEqual(response.status(), HttpResponseHandler.codes.BAD_REQUEST);
            }
            getCollectionsMock.verify();
        });
    });
});
