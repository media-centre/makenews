import GetStoryRoute from "../../../src/routes/helpers/GetStoryRoute";
import StoryRequestHandler from "../../../src/storyBoard/StoryRequestHandler";
import sinon from "sinon";
import { assert } from "chai";

describe("Get Story Route", () => {
    let sandbox = null, storyRequestHandlerInstance = null;
    beforeEach("AddStoryTitle", () => {
        sandbox = sinon.sandbox.create();
        storyRequestHandlerInstance = new StoryRequestHandler();
    });
    afterEach("GetStoryRoute", () => {
        sandbox.restore();
    });
    it("should return single document", async () => {
        let document = {
            "title": "title2",
            "_id": "1234",
            "rev": "1234"
        };
        sandbox.mock(StoryRequestHandler).expects("instance").returns(storyRequestHandlerInstance);
        sandbox.mock(storyRequestHandlerInstance).expects("getStory").returns(Promise.resolve(document));
        let result = await new GetStoryRoute({
            "query": {
                "id": "id_1"
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        }, {}).handle();
        assert.deepEqual(result, document);
    });

    it("should return array of documents", async () => {
        let documents = { "docs": {
            "title": "title2",
            "_id": "1234",
            "rev": "1234"
        } };
        sandbox.mock(StoryRequestHandler).expects("instance").returns(storyRequestHandlerInstance);
        sandbox.mock(storyRequestHandlerInstance).expects("getStory").returns(Promise.resolve(documents));
        let addStory = new GetStoryRoute({
            "query": {
                "id": "id_2"
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        }, {});
        let result = await addStory.handle();
        assert.deepEqual(documents, result);
    });

    it("should throw an error if document does not exist", async () => {
        sandbox.mock(StoryRequestHandler).expects("instance").returns(storyRequestHandlerInstance);
        sandbox.mock(storyRequestHandlerInstance).expects("getStory").returns(Promise.reject("No document found"));
        let addStory = new GetStoryRoute({
            "query": {
                "id": "id_1"
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        }, {});
        //isRejected(addStory.handle(), "Story title  exist");
        try {
            await addStory.handle();
        } catch(err) {
            assert.equal(err, "No document found");
        }
    });
});
