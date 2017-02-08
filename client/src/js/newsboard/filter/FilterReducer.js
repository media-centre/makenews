import { CURRENT_FILTER, FILTERED_SOURCES } from "./FilterActions";
import { icons, newsBoardSourceTypes } from "../../utils/Constants";

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

export const currentFilterSource = (state = { "web": [], "facebook": [], "twitter": []}, action = {}) => {
    switch(action.type) {

    case FILTERED_SOURCES: {
        return action.sources;
    }
    default: return state;
    }
};