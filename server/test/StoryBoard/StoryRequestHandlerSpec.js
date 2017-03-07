import * as StoryRequestHandler from "../../src/storyBoard/StoryRequestHandler";
import CouchClient from "../../src/CouchClient";
import { isRejected } from "../helpers/AsyncTestHelper";
import { assert } from "chai";
import sinon from "sinon";


describe("StoryRequestHandler", () => {
    const sandbox = sinon.sandbox.create();

    afterEach("StoryRequestHandler", () => {
        sandbox.restore();
    });

    describe("getStory", () => {
        const authSession = "Access Token",
            dbName = "dbName",
            couchClientInstanceMock = new CouchClient(authSession, dbName);

        it("should find the document of docType story and id", async () => {
            let resultDoc = {
                "_id": "id",
                "title": "title",
                "_rev": "rev"
            };
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock)
                .expects("getDocument").withArgs("id").returns(Promise.resolve(resultDoc));
            let expectedDocs = await StoryRequestHandler.getStory("id", authSession);
            assert.deepEqual(resultDoc, expectedDocs);
        });

        it("should throw an error if document id does not exist", async () => {
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("getDocument")
                .withArgs("id").returns(Promise.reject("No document found"));
            try {
                await StoryRequestHandler.getStory("id", authSession);
            } catch (error) {
                assert.deepEqual("No document found", error);
            }
        });
    });

    describe("getStories", () => {
        const authSession = "Access Token",
            dbName = "dbName",
            couchClientInstanceMock = new CouchClient(authSession, dbName);
        let result = null, query = null;

        it("should find the documents of docType story", async () => {
            result = {
                "docs": [
                    {
                        "_id": "id",
                        "title": "title"
                    }, {
                        "_id": "id2",
                        "title": "title3"
                    }
                ]
            };
            query = {
                "selector": {
                    "docType": {
                        "$eq": "story"
                    }
                },
                "fields": ["title", "_id"]
            };

            sandbox.mock(CouchClient).expects("instance").withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("findDocuments").withArgs(query).returns(Promise.resolve(result));
            let expectedDocs = await StoryRequestHandler.getStories(authSession);
            assert.deepEqual(result, expectedDocs);
        });
    });

    describe("getStoryWithTitle", () => {
        const authSession = "Access Token",
            dbName = "dbName",
            query = {
                "selector": {
                    "docType": {
                        "$eq": "story"
                    },
                    "title": {
                        "$eq": "title"
                    }
                }
            },
            couchClientInstanceMock = new CouchClient(authSession, dbName);
        let result = null;

        it("should return documents which have same title and doctype is story", async () => {
            let title = "title";
            result = { "docs": [{ "_id": "id", "title": title }] };
            sandbox.mock(CouchClient).expects("instance").withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("findDocuments").withArgs(query).returns(Promise.resolve(result));
            let expectedResult = await StoryRequestHandler.getStoryWithTitle(title, authSession);
            assert.strictEqual(result, expectedResult);
        });

        it("should reject with error if find documents reject with an error", async () => {
            let title = "title";
            result = { "docs": [{ "_id": "id", "title": title }] };
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("findDocuments")
                .withArgs(query).returns(Promise.resolve("error"));
            try {
                await StoryRequestHandler.getStoryWithTitle(title, authSession);
            } catch (error) {
                assert.deepEqual("error", error);
            }
        });
    });

    describe("saveStory", () => {
        let couchClientInstance = null, authSession = null, story = null;

        beforeEach("saveStory", () => {
            authSession = "auth session";
            couchClientInstance = new CouchClient(authSession, "db name");

            story = {
                "title": "title",
                "body": "body",
                "docType": "story"
            };
        });

        it("should return ok on success response from db", async () => {
            sandbox.mock(CouchClient).expects("instance")
                .withExactArgs(authSession).returns(couchClientInstance).twice();
            let updateDocMock = sandbox.mock(couchClientInstance).expects("updateDocument")
                .withExactArgs(story).returns({ "ok": true });
            let findDocMock = sandbox.mock(couchClientInstance).expects("findDocuments")
                .returns({ "docs": [] });
            try {
                let response = await StoryRequestHandler.saveStory(story, authSession);
                assert.deepEqual(response, { "ok": true });
                updateDocMock.verify();
                findDocMock.verify();
            } catch(error) {
                assert.fail();
            }
        });

        it("should throw if title is already exists", async () => {
            sandbox.mock(CouchClient).expects("instance")
                .withExactArgs(authSession).returns(couchClientInstance);
            let findDocMock = sandbox.mock(couchClientInstance).expects("findDocuments")
                .returns({ "docs": [{ "_id": "id" }] });
            try {
                await StoryRequestHandler.saveStory(story, authSession);
            } catch(error) {
                assert.strictEqual(error, "Title Already exists");
                findDocMock.verify();
            }
        });

        it("should update the document", async () => {
            story._id = "id";
            sandbox.mock(CouchClient).expects("instance")
                .withExactArgs(authSession).returns(couchClientInstance).twice();
            let findDocMock = sandbox.mock(couchClientInstance).expects("findDocuments")
                .returns({ "docs": [{ "_id": "id" }] });
            let updateDocMock = sandbox.mock(couchClientInstance).expects("updateDocument")
                .withExactArgs(story).returns({ "ok": true });
            try {
                let response = await StoryRequestHandler.saveStory(story, authSession);
                assert.deepEqual(response, { "ok": true });
                findDocMock.verify();
                updateDocMock.verify();
            } catch(error) {
                assert.fail(error);
            }
        });
    });
    
    describe("deleteStory", () => {
        const id = "test_1", authSession = "auth session",
            couchClientInstance = new CouchClient(authSession, "db name");
        let deleteDocumentMock = null;

        beforeEach("deleteStory", () => {
            deleteDocumentMock = sandbox.mock(couchClientInstance)
                 .expects("deleteDocument")
                 .withExactArgs(id);
            sandbox.stub(CouchClient, "instance").withArgs(authSession).returns(couchClientInstance);
        });

        it("should delete document", async () => {
            deleteDocumentMock.returns(Promise.resolve({ "ok": true }));
            const message = await StoryRequestHandler.deleteStory(id, authSession);
            deleteDocumentMock.verify();
            assert.deepEqual(message, { "message": "deleted" });
        });

        it("should throw error if deletion fails", async () => {
            const erroMessage = { "message": "error" };
            deleteDocumentMock.returns(Promise.reject(erroMessage));
            await isRejected(StoryRequestHandler.deleteStory(id, authSession),
                { "message": `Unable to delete story. Details: ${JSON.stringify(erroMessage)}` });
            deleteDocumentMock.verify();
        });
    });
});
