import { stories, untitledIndex } from "../../../src/js/storyboard/reducers/StoryBoardReducer";
import { assert } from "chai";
import { ADD_STORY_TITLE, CLEAR_STORIES, UNTITLED_NUMBER, REMOVE_STORY } from "../../../src/js/storyboard/actions/StoryBoardActions";

describe("StoryBoardReducers", () => {
    describe("stories", () => {
        it("should return an empty list if there is no action item", () => {
            assert.deepEqual(stories(), []);
        });

        it("should return list of stories if action type is ADD_STORY_TITLE", () => {
            let story = { "_id": "id", "title": "title" };
            let action = { "type": ADD_STORY_TITLE, story };
            assert.deepEqual([story], stories([], action));
        });

        it("should return an empty list if action type is CLEAR_STORIES", () => {
            let action = { "type": CLEAR_STORIES };
            assert.deepEqual([], stories([], action));
        });

        it("should remove story from state if action type is CLEAR_STORIES", () => {
            let action = { "type": REMOVE_STORY, "id": 2 };
            assert.deepEqual([{ "_id": 1 }, { "_id": 3 }], stories([{ "_id": 1 }, { "_id": 2 }, { "_id": 3 }], action));
        });
    });

    describe("untitledIndex", () => {
        it("should return default index", () => {
            assert.deepEqual("Untitled1", untitledIndex());
        });

        it("should return index if action type is UNTITLED_INDEX", () => {
            let index = "Untitled2";
            let action = { "type": UNTITLED_NUMBER, "untitledIndex": index };
            assert.deepEqual("Untitled2", untitledIndex("Untitled1", action));
        });
    });
});
