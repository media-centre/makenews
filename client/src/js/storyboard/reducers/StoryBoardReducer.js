import { ADD_STORY_TITLE, CLEAR_STORIES } from "../actions/StoryBoardActions";
import { List } from "immutable";

export const addStory = (state = [], action = {}) => {
    switch(action.type) {
    case ADD_STORY_TITLE: {
        let { title, _id } = action.story;
        return List(state).concat({ title, _id }).toArray();  //eslint-disable-line new-cap
    }
    case CLEAR_STORIES:
        return [];
    default: return state;
    }
};
