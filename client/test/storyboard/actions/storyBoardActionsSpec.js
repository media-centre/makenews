import * as StoryBoardActions from "../../../src/js/storyboard/actions/StoryBoardActions";
import mockStore from "./../../helper/ActionHelper";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import sinon from "sinon";
import { assert } from "chai";

describe("StoryBoardActions", (done) => {
    let story = {
        "_id": "id",
        "title": "title"
    };
    describe("addStory", () => {
        it("dispatch setStoryTitle action with story", () => {
            let action = [{ "type": StoryBoardActions.ADD_STORY_TITLE, "story": story }];
            let store = mockStore([], action, done);
            store.dispatch(StoryBoardActions.addStory(story));
        });
    });

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
            let expectedAction = StoryBoardActions.clearStories();
            assert.deepEqual(action, expectedAction);
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
        it("should dispatch set story title action with id and title", () => {
            let action = [{ "type": StoryBoardActions.ADD_STORY_TITLE, "story": { "_id": "id", "title": "title" } }];
            let response = { "docs": [{ "_id": "id", "title": "title" }, { "_id": "id2", "title": "title" }] };
            let ajaxClientInstance = AjaxClient.instance("/story");
            let ajaxClientMock = sandbox.mock(AjaxClient).expects("instance")
                .returns(ajaxClientInstance);
            let postMock = sandbox.mock(ajaxClientInstance).expects("get").returns(Promise.resolve(response));
            let store = mockStore([], action, done);
            store.dispatch(StoryBoardActions.getStories());
            ajaxClientMock.verify();
            postMock.verify();
        });
    });
});
