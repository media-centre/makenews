import StoryRequestHandler from "../../src/storyBoard/StoryRequestHandler";
import CouchClient from "../../src/CouchClient";
import { assert } from "chai";
import sinon from "sinon";


describe("StoryRequestHandler", () => {
    let sandbox = null, authSession = null, storyRequestHandler = null, result = null;
    let couchClientInstanceMock = null, document = null, dbName = "dbName", title = "title of the story";
    beforeEach("add story", () => {
        authSession = "Access Token";
        storyRequestHandler = new StoryRequestHandler();
        couchClientInstanceMock = new CouchClient(authSession, dbName);
        sandbox = sinon.sandbox.create();
        document = { "title": title, "docType": "Story" };
        result = { "ok": true, "id": "1234", "rev": "1234" };
    });
    afterEach("add story", () => {
        sandbox.restore();
    });


    it("should throw an error from db while saving the document", async () => {
        sandbox.mock(CouchClient).expects("instance").withArgs(authSession).returns(couchClientInstanceMock);
        sandbox.mock(couchClientInstanceMock).expects("updateDocument").withArgs(document).returns(Promise.reject("Unable to add the story"));
        await assert.isRejected(storyRequestHandler.addStory(title, authSession), "Unable to add the story");
    });

    it("should throw a conflict error from database", async () => {
        sandbox.mock(CouchClient).expects("instance").withArgs(authSession).returns(couchClientInstanceMock);
        sandbox.mock(couchClientInstanceMock).expects("updateDocument").withArgs(document).returns(Promise.reject({ "status": "conflict" }));
        await assert.isRejected(storyRequestHandler.addStory(title, authSession), "Story title already exist");
    });

    it("should fetch feeds from the db", async () => {
        sandbox.mock(CouchClient).expects("instance").withArgs(authSession).returns(couchClientInstanceMock);
        sandbox.mock(couchClientInstanceMock).expects("updateDocument").withArgs(document).returns(Promise.resolve(result));
        let expectedFeeds = await storyRequestHandler.addStory(title, authSession);
        assert.deepEqual(expectedFeeds, result);
    });
});
