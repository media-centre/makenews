import { CURRENT_FILTER, FILTERED_SOURCES, REMOVE_SOURCE } from "./FilterActions";
import { icons, newsBoardSourceTypes } from "../../utils/Constants";
import R from "ramda"; //eslint-disable-line id-length
const sourceTypes = { "web": "web", "twitter": "twitter", "profiles": "facebook", "pages": "facebook", "groups": "facebook" };

export const currentFilter = (state = "", action = { }) => {
    switch(action.type) {
    case CURRENT_FILTER: {
        let currentTab = action.currentTab;
        if(currentTab !== "" && !icons[action.currentTab]) {
            currentTab = newsBoardSourceTypes.web;
        }
        return currentTab;
    }
    default: return state;
    }
};

export const currentFilterSource = (state = { "web": [], "facebook": [], "twitter": [] }, action = {}) => {
    switch(action.type) {
    case FILTERED_SOURCES: {
        return Object.assign({}, action.sources);
    }
    case REMOVE_SOURCE: {
        state[action.sourceType] = R.filter(source => source !== action.sourceId, state[sourceTypes[action.sourceType]]);
        return Object.assign({}, state);
    }
    default: return state;
    }
};
