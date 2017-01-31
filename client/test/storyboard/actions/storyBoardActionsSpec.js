import * as StoryBoardActions from "../../../src/js/storyboard/actions/StoryBoardActions";
import mockStore from "./../../helper/ActionHelper";

describe("StoryBoardActions", (done) => {
    describe("addStory", () => {
        it("dispatch setStoryTitle action with story", () => {
            let story = {
                "_id": "id",
                "title": "title"
            };
            let action = [{ "type": StoryBoardActions.ADD_STORY_TITLE, "story": story }];
            let store = mockStore([], action, done);
            store.dispatch(StoryBoardActions.addStory(story));
        });
    });

    describe("setStoryTitle", () => {

    });
});
