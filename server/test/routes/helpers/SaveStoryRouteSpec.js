import SaveStoryRoute from "../../../src/routes/helpers/SaveStoryRoute";
import * as storyRequestHandler from "../../../src/storyBoard/StoryRequestHandler";
import sinon from "sinon";
import { assert } from "chai";

describe("SaveStoryRoute", () => {
    let sandbox = null;
    beforeEach("SaveStoryRoute", () => {
        sandbox = sinon.sandbox.create();
    });
    afterEach("SaveStoryRoute", () => {
        sandbox.restore();
    });

    describe("validate", () => {
        it("should return message when the title is empty", () => {
            const request = {
                "body": {
                    "story": {
                        "title": ""
                    }
                },
                "cookies": {
                    "AuthSession": "authSession"
                }
            };

            const response = new SaveStoryRoute(request, {}, {}).validate();

            assert.strictEqual(response, "Please add title");
        });

        it("should return null if title is there", () => {
            const request = {
                "body": {
                    "story": {
                        "title": "title"
                    }
                },
                "cookies": {
                    "AuthSession": "authSession"
                }
            };

            const response = new SaveStoryRoute(request, {}, {}).validate();

            assert.isNull(response);
        });
    });

    describe("handle", () => {
        it("should return success response for add story", async() => {
            const successObject = {
                "ok": true,
                "_id": "1234",
                "rev": "1234"
            };
            sandbox.mock(storyRequestHandler).expects("saveStory").returns(Promise.resolve(successObject));
            const result = await new SaveStoryRoute({
                "body": {
                    "title": "title1"
                },
                "cookies": {
                    "AuthSession": "test_session"
                }
            }, {}).handle();
            assert.deepEqual(result, successObject);
        });

        it("should throw an error if the add story rejects with an error", async() => {
            const mockobj = sandbox.mock(storyRequestHandler).expects("saveStory").returns(Promise.reject("Unable to add the story"));
            const saveStory = new SaveStoryRoute({
                "body": {
                    "title": "title1"
                },
                "cookies": {
                    "AuthSession": "test_session"
                }
            }, {});
            try {
                await saveStory.handle();
            } catch (err) {
                assert.equal(err, "Unable to add the story");
            }
            mockobj.verify();
        });

        it("should throw an error if story title already exists", async() => {
            const mockobj = sandbox.mock(storyRequestHandler).expects("saveStory").returns(Promise.reject("Story title already exist"));
            const saveStory = new SaveStoryRoute({
                "body": {
                    "title": "title1"
                },
                "cookies": {
                    "AuthSession": "test_session"
                }
            }, {});
            try {
                await saveStory.handle();
            } catch (err) {
                assert.equal(err, "Story title already exist");
            }
            mockobj.verify();
        });
    });
});
