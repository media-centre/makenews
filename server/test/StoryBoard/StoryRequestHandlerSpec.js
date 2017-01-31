import StoryRequestHandler from "../../src/storyBoard/StoryRequestHandler";
import CouchClient from "../../src/CouchClient";
import { assert } from "chai";
import sinon from "sinon";


describe("StoryRequestHandler", () => {
    describe("addStory", () => {
        let sandbox = null, authSession = null, storyRequestHandler = null, result = null;
        let couchClientInstanceMock = null, document = null, dbName = "dbName", story = { "title": "title", "_id": "id", "_rev": "rev" };
        beforeEach("add story", () => {
            authSession = "Access Token";
            storyRequestHandler = new StoryRequestHandler();
            couchClientInstanceMock = new CouchClient(authSession, dbName);
            sandbox = sinon.sandbox.create();
            document = { "title": story.title, "docType": "story" };
            result = { "ok": true, "id": "1234", "rev": "1234" };
        });

        afterEach("add story", () => {
            sandbox.restore();
        });


        it("should throw an error from db while saving the document", async () => {
            let docs = { "docs": [] };
            story = { "title": "title" };
            sandbox.mock(CouchClient).expects("instance").withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(storyRequestHandler).expects("getStoryWithTitle").returns(docs);
            sandbox.mock(couchClientInstanceMock).expects("updateDocument").withArgs(document).returns(Promise.reject("Unable to add the story"));
            await assert.isRejected(storyRequestHandler.addStory(story, authSession), "Unable to add the story");
        });

        it("should throw a conflict error from database", async () => {
            let docs = { "docs": [{ "id": "id", "title": "title" }, { "id": "id2", "title": "title2" }] };
            sandbox.mock(storyRequestHandler).expects("getStoryWithTitle").returns(docs);
            await assert.isRejected(storyRequestHandler.addStory(story, authSession), "Story title already exist");
        });

        it("should return success response from db", async () => {
            let docs = { "docs": [] };
            sandbox.mock(CouchClient).expects("instance").withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("updateDocument").withArgs(document).returns(Promise.resolve(result));
            sandbox.mock(storyRequestHandler).expects("getStoryWithTitle").returns(docs);
            let expectedFeeds = await storyRequestHandler.addStory(story, authSession);
            assert.deepEqual(expectedFeeds, result);
        });
    });

    describe("getStory", () => {
        let sandbox = null, authSession = null, result = null, dbName = "dbName", query = null, storyRequestHandler = null, couchClientInstanceMock = null;
        beforeEach("getStory", () => {
            sandbox = sinon.sandbox.create();
            storyRequestHandler = new StoryRequestHandler();
            couchClientInstanceMock = new CouchClient(authSession, dbName);
        });

        afterEach("getStory", () => {
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
            sandbox.mock(CouchClient).expects("instance").withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("findDocuments").withArgs(query).returns(Promise.resolve(result));
            let expectedDocs = await storyRequestHandler.getStory("", authSession);
            assert.deepEqual(result, expectedDocs);
        });

        it("should find the document of docType story and id", async () => {
            let resultDoc = {
                "_id": "id",
                "title": "title",
                "_rev": "rev"
            };
            result = {
                "docs": [resultDoc]
            };
            query = {
                "selector": {
                    "docType": {
                        "$eq": "story"
                    },
                    "_id": {
                        "$eq": "id"
                    }
                },
                "fields": ["title", "_id", "_rev"]
            };
            sandbox.mock(CouchClient).expects("instance").withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("findDocuments").withArgs(query).returns(Promise.resolve(result));
            let expectedDocs = await storyRequestHandler.getStory("id", authSession);
            assert.deepEqual(resultDoc, expectedDocs);
        });

        it("should throw an error if document id does not exist", async () => {
            result = {
                "docs": []
            };
            query = {
                "selector": {
                    "docType": {
                        "$eq": "story"
                    },
                    "_id": {
                        "$eq": "id"
                    }
                },
                "fields": ["title", "_id", "_rev"]
            };
            sandbox.mock(CouchClient).expects("instance").withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("findDocuments").withArgs(query).returns(Promise.resolve(result));
            try {
                await storyRequestHandler.getStory("id", authSession);
            } catch (error) {
                assert.deepEqual("No document found", error);
            }
        });

    });

});
