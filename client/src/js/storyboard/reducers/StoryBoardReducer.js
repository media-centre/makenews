import { ADD_STORY_TITLE, CLEAR_STORIES, STORY } from "../actions/StoryBoardActions";
import { List } from "immutable";

export const stories = (state = [], action = {}) => {
    switch(action.type) {
    case ADD_STORY_TITLE: {
        return List(state).concat(action.story).toArray();  //eslint-disable-line new-cap
    }
    case CLEAR_STORIES:
        return [];
    default: return state;
    }
};

export const story = (state = {}, action = {}) => {
    switch(action.type) {
    case STORY: {
        return action.story;
    }
    default: return state;
    }
};
