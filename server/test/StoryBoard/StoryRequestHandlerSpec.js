import { addStory, getStory, getStoryWithTitle, getStories } from "../../src/storyBoard/StoryRequestHandler";
import CouchClient from "../../src/CouchClient";
import { assert } from "chai";
import sinon from "sinon";


describe("StoryRequestHandler", () => {
    describe("addStory", () => {
        let sandbox = null, authSession = null;
        let couchClientInstanceMock = null, document = null, dbName = "dbName";
        let story = "title";
        beforeEach("add story", () => {
            authSession = "Access Token";
            couchClientInstanceMock = new CouchClient(authSession, dbName);
            sandbox = sinon.sandbox.create();
            document = { "title": story, "docType": "story" };
        });

        afterEach("add story", () => {
            sandbox.restore();
        });


        it("should throw an error if there is any error from db while saving the document", async () => {
            let docs = { "docs": [] };
            story = { "title": "title" };
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock).twice();
            sandbox.mock(couchClientInstanceMock).expects("findDocuments").returns(Promise.resolve(docs));
            sandbox.mock(couchClientInstanceMock).expects("updateDocument")
                .withArgs(document).returns(Promise.reject("Unable to add the story"));
            await assert.isRejected(addStory(story, authSession), "Unable to add the story");
        });

        it("should throw a conflict error if the story with the same title already exists", async () => {
            let docs = { "docs": [{ "id": "id", "title": "title" }, { "id": "id2", "title": "title2" }] };
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock).twice();
            sandbox.mock(couchClientInstanceMock)
                .expects("findDocuments").returns(Promise.resolve(docs));
            await assert.isRejected(addStory(story, authSession), "Story title already exist");
        });

        it("should return success response from db", async () => {
            let docs = { "docs": [] };
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock).twice();
            sandbox.mock(couchClientInstanceMock).expects("updateDocument")
                .withArgs(document).returns(Promise.resolve({ "ok": true, "id": "1234", "rev": "1234" }));
            sandbox.mock(couchClientInstanceMock)
                .expects("findDocuments").returns(Promise.resolve(docs));
            let expectedFeeds = await addStory(story, authSession);
            assert.deepEqual(expectedFeeds, { "ok": true, "id": "1234", "rev": "1234" });
        });
    });


    describe("getStory", () => {
        let sandbox = null, authSession = null, dbName = "dbName", couchClientInstanceMock = null;
        beforeEach("getStory", () => {
            authSession = "Access Token";
            sandbox = sinon.sandbox.create();
            couchClientInstanceMock = new CouchClient(authSession, dbName);
        });

        afterEach("getStory", () => {
            sandbox.restore();
        });


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
            let expectedDocs = await getStory("id", authSession);
            assert.deepEqual(resultDoc, expectedDocs);
        });

        it("should throw an error if document id does not exist", async () => {
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("getDocument")
                .withArgs("id").returns(Promise.reject("No document found"));
            try {
                await getStory("id", authSession);
            } catch (error) {
                assert.deepEqual("No document found", error);
            }
        });
    });

    describe("getStories", () => {
        let sandbox = null, authSession = null, result = null,
            dbName = "dbName", query = null, couchClientInstanceMock = null;
        beforeEach("getStories", () => {
            authSession = "Access Token";
            sandbox = sinon.sandbox.create();
            couchClientInstanceMock = new CouchClient(authSession, dbName);
        });

        afterEach("getStories", () => {
            sandbox.restore();
        });
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
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("findDocuments")
                .withArgs(query).returns(Promise.resolve(result));
            let expectedDocs = await getStories(authSession);
            assert.deepEqual(result, expectedDocs);
        });
    });

    describe("getStoryWithTitle", () => {
        let sandbox = null, authSession = null, result = null, dbName = "dbName",
            query = null, couchClientInstanceMock = null;
        beforeEach("getStoryWithTitle", () => {
            authSession = "Access Token";
            sandbox = sinon.sandbox.create();
            couchClientInstanceMock = new CouchClient(authSession, dbName);
            query = {
                "selector": {
                    "docType": {
                        "$eq": "story"
                    },
                    "title": {
                        "$eq": "title"
                    }
                }
            };
        });

        afterEach("getStoryWithTitle", () => {
            sandbox.restore();
        });

        it("should return documents which have same title and doctype is story", async () => {
            let title = "title";
            result = { "docs": [{ "_id": "id", "title": title }] };
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("findDocuments")
                .withArgs(query).returns(Promise.resolve(result));
            let expectedResult = await getStoryWithTitle(title, authSession);
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
                await getStoryWithTitle(title, authSession);
            } catch (error) {
                assert.deepEqual("error", error);
            }
        });
    });

});
