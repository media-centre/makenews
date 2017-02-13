import { ADD_STORY_TITLE, CLEAR_STORIES, UNTITLED_NUMBER } from "../actions/StoryBoardActions";
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

export const untitledIndex = (state = "Untitled1", action = {}) => {
    switch (action.type) {
    case UNTITLED_NUMBER: {
        return action.untitledIndex;
    }
    default: return state;
    }
};
