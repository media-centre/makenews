import GetStoriesRoute from "../../../src/routes/helpers/GetStoriesRoute";
import * as StoryRequestHandler from "../../../src/storyBoard/StoryRequestHandler";
import sinon from "sinon";
import { assert } from "chai";

describe("GetStoriesRoute", () => {
    describe("getStories", () => {
        let sandbox = null;
        beforeEach("getStories", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("getStories", () => {
            sandbox.restore();
        });

        it("should return array of documents", async () => {
            let documents = { "docs": {
                "title": "title2",
                "_id": "1234",
                "rev": "1234"
            } };
            sandbox.mock(StoryRequestHandler).expects("getStories").returns(Promise.resolve(documents));
            let addStory = new GetStoriesRoute({
                "cookies": {
                    "AuthSession": "test_session"
                }
            }, {});
            let result = await addStory.handle();
            assert.deepEqual(documents, result);
        });
    });
});
