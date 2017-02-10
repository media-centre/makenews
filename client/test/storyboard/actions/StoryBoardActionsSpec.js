import * as StoryBoardActions from "../../../src/js/storyboard/actions/StoryBoardActions";
import mockStore from "./../../helper/ActionHelper";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import sinon from "sinon";
import { assert } from "chai";

describe("StoryBoardActions", () => {
    let story = {
        "_id": "id",
        "title": "title"
    };

    describe("setStoryTitle", () => {
        it("should return an action type of ADD_STORY_TITLE and story with title and id", () => {
            let action = { "type": StoryBoardActions.ADD_STORY_TITLE, story };
            let expectedAction = StoryBoardActions.setStoryTitle(story);
            assert.deepEqual(action, expectedAction);
        });
    });

    describe("clearStories", () => {
        it("should return an action type of CLEAR_STORIES", () => {
            let action = { "type": StoryBoardActions.CLEAR_STORIES };
            assert.deepEqual(action, StoryBoardActions.clearStories);
        });
    });

    describe("getStories", () => {
        let sandbox = null;
        beforeEach("getStories", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("getStories", () => {
            sandbox.restore();
        });
        it("should dispatch set story title action with id and title", (done) => {
            let action = [{ "type": StoryBoardActions.ADD_STORY_TITLE, "story": { "_id": "id", "title": "title" } },
                { "type": StoryBoardActions.ADD_STORY_TITLE, "story": { "_id": "id2", "title": "title" } }];
            let response = { "docs": [{ "_id": "id", "title": "title" }, { "_id": "id2", "title": "title" }] };
            let ajaxClientInstance = AjaxClient.instance("/stories");
            let ajaxClientMock = sandbox.mock(AjaxClient).expects("instance")
                .returns(ajaxClientInstance);
            let getMock = sandbox.mock(ajaxClientInstance).expects("get").returns(Promise.resolve(response));
            let store = mockStore([], action, done);
            store.dispatch(StoryBoardActions.getStories());
            ajaxClientMock.verify();
            getMock.verify();
        });
    });

    describe("getStory", () => {
        let ajaxInstance = null, sandbox = null;
        beforeEach("getStory", () => {
            sandbox = sinon.sandbox.create();
            ajaxInstance = AjaxClient.instance("/story");
            sandbox.mock(AjaxClient).expects("instance")
                .withExactArgs("/story").returns(ajaxInstance);
        });

        afterEach("getStory", () => {
            sandbox.restore();
        });

        it("should return success response", (done) => {
            let document = {
                "id": "1234",
                "rev": "1234",
                "title": "title",
                "body": "body"
            };

            let getMock = sandbox.mock(ajaxInstance).expects("get").returns(Promise.resolve(document));
            let action = [{ "type": StoryBoardActions.STORY, "story": document }];
            let store = mockStore([], action, done);
            store.dispatch(StoryBoardActions.getStory(document.id));
            getMock.verify();
        });
    });
});
