import CollectionRoute from "../../../src/routes/helpers/CollectionRoute";
import { mockResponse } from "./../../helpers/MockResponse";
import CollectionRequestHandler from "../../../src/collection/CollectionRequestHandler";
import sinon from "sinon";
import { assert } from "chai";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import CouchClient from "../../../src/CouchClient";

describe("CollectionRoute", () => {
    let couchClient = null;
    let authSession = null;
    let sandbox = null;
    let collectionRequestHandler = null;

    beforeEach("CollectionRoute", () => {
        sandbox = sinon.sandbox.create();
        authSession = "auth session";
        couchClient = new CouchClient(authSession);
        sandbox.mock(CouchClient).expects("instance").withExactArgs(authSession).returns(couchClient);
        collectionRequestHandler = new CollectionRequestHandler(couchClient);
        sandbox.mock(CollectionRequestHandler).expects("instance").withExactArgs(couchClient).returns(collectionRequestHandler);
    });

    afterEach("CollectionRoute", () => {

    });

    describe("addToCollection", () => {
        let request = null;
        let response = null;
        let docId = null;
        let collectionName = null;
        let collectionRoute = null;
        let selectedTextDoc = null;
        const sourceId = "http://www.thehindu.com/?service=rss";


        beforeEach("addToCollection", () => {
            docId = "docId";
            selectedTextDoc = { "title": "title", "description": "description" };
            collectionName = "collection name";
            response = mockResponse();
            request = {
                "body": {
                    docId,
                    "collection": collectionName,
                    "isNewCollection": true,
                    sourceId,
                    selectedTextDoc
                },
                "cookies": {
                    "AuthSession": authSession
                }
            };
            collectionRoute = new CollectionRoute(request, response, {});
        });

        afterEach("addToCollection", () => {
            sandbox.restore();
        });

        it("should return success response when collection is successfully updated", async() => {

            const updateMock = sandbox.mock(collectionRequestHandler).expects("updateCollection")
                .withExactArgs(collectionName, true, docId, sourceId, selectedTextDoc)
                .returns(Promise.resolve({ "ok": true }));
            
            await collectionRoute.addToCollection();
            
            updateMock.verify();
            assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
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
            const updateMock = sandbox.mock(collectionRequestHandler).expects("updateCollection")
                .withExactArgs(collectionName, true, docId, sourceId, selectedTextDoc)
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
        let collectionRoute = null;
        let response = null;
        let request = null;
        const collectionName = null;

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
        });

        afterEach("addToCollection", () => {
            sandbox.restore();
        });

        it("should return all collections", async() => {
            const collection = { "docs": ["first", "second"] };
            const getCollectionsMock = sandbox.mock(collectionRequestHandler).expects("getAllCollections");
            getCollectionsMock.returns(Promise.resolve(collection));

            try {
                await collectionRoute.getAllCollections();
                assert.strictEqual(response.json(), collection);
                getCollectionsMock.verify();
            } catch(error) {
                assert.fail(error);
            }
        });

        it("should throw error when fetching collection failed", async() => {
            const getCollectionsMock = sandbox.mock(collectionRequestHandler).expects("getAllCollections");
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
