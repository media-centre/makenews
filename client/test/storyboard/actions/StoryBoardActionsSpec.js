import * as StoryBoardActions from "../../../src/js/storyboard/actions/StoryBoardActions";
import mockStore from "./../../helper/ActionHelper";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import sinon from "sinon";
import { assert } from "chai";
import Locale from "./../../../src/js/utils/Locale";

describe("StoryBoardActions", () => {
    const sandbox = sinon.sandbox.create();

    afterEach("StoryBoardActions", () => {
        sandbox.restore();
    });

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

    describe("addDefaultTitle", () => {
        it("should dispatch UNTITLED_NUMBER action with index", (done) => {
            let action = [{ "type": StoryBoardActions.UNTITLED_NUMBER, "untitledIndex": "Untitled2" }];
            let store = mockStore("Untitled1", action, done);
            store.dispatch(StoryBoardActions.addDefaultTitle("Untitled2"));
        });
    });

    describe("deleteStory", () => {
        it("should dispatch REMOVE_STORY action with id", (done) => {
            const storyBoardMessages = {
                "successMessages": {
                    "deleteStory": "Story deleted successfully"
                }
            };
            sandbox.stub(Locale, "applicationStrings").returns({
                "messages": {
                    "storyBoard": storyBoardMessages
                }
            });
            const id = 2;
            let action = [{ "type": StoryBoardActions.REMOVE_STORY, id }];
            const store = mockStore([{ "_id": 1 }, { "_id": id }, { "_id": 3 }], action, done);
            let ajaxClientInstance = AjaxClient.instance("/delete-story");
            sandbox.stub(AjaxClient, "instance")
                .returns(ajaxClientInstance);
            const postMock = sandbox.mock(ajaxClientInstance).expects("post")
                .returns(Promise.resolve("success"));
            store.dispatch(StoryBoardActions.deleteStory(id));
            postMock.verify();
        });
    });
});
