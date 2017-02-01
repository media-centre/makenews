import AddStoryTitleRoute from "../../../src/routes/helpers/AddStoryTitleRoute";
import * as storyRequestHandler from "../../../src/storyBoard/StoryRequestHandler";
import sinon from "sinon";
import { assert } from "chai";

describe("Add Story Document Route", () => {
    let sandbox = null;
    beforeEach("AddStoryTitle", () => {
        sandbox = sinon.sandbox.create();
    });
    afterEach("AddStoryTitle", () => {
        sandbox.restore();
    });
    it("should return success response for add story", async () => {
        let successObject = {
            "ok": true,
            "_id": "1234",
            "rev": "1234"
        };
        sandbox.mock(storyRequestHandler).expects("addStory").returns(Promise.resolve(successObject));
        let result = await new AddStoryTitleRoute({
            "body": {
                "title": "title1"
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        }, {}).handle();
        assert.deepEqual(result, successObject);
    });

    it("should throw an error if the add story rejects with an error", async () => {
        let mockobj = sandbox.mock(storyRequestHandler).expects("addStory").returns(Promise.reject("Unable to add the story"));
        let addStory = new AddStoryTitleRoute({
            "body": {
                "title": "title1"
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        }, {});
        try {
            await addStory.handle();
        } catch(err) {
            assert.equal(err, "Unable to add the story");
        }
        mockobj.verify();
    });

    it("should throw an error if story title already exists", async () => {
        let mockobj = sandbox.mock(storyRequestHandler).expects("addStory").returns(Promise.reject("Story title already exist"));
        let addStory = new AddStoryTitleRoute({
            "body": {
                "title": "title1"
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        }, {});
        try {
            await addStory.handle();
        } catch(err) {
            assert.equal(err, "Story title already exist");
        }
        mockobj.verify();
    });
});
