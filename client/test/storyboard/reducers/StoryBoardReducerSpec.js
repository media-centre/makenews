import { addStory } from "../../../src/js/storyboard/reducers/StoryBoardReducer";
import { assert } from "chai";
import { ADD_STORY_TITLE, CLEAR_STORIES } from "../../../src/js/storyboard/actions/StoryBoardActions";

describe("StoryBoardReducers", () => {
    describe("addStory", () => {
        it("should return an empty list if there is no action item", () => {
            assert.deepEqual(addStory(), []);
        });

        it("should return list of stories if action type is ADD_STORY_TITLE", () => {
            let story = { "_id": "id", "title": "title" };
            let action = { "type": ADD_STORY_TITLE, story };
            let stories = addStory([], action);
            assert.deepEqual([story], stories);
        });

        it("should return an empty list if action type is CLEAR_STORIES", () => {
            let action = { "type": CLEAR_STORIES };
            let stories = addStory([], action);
            assert.deepEqual([], stories);
        });
    });
});
