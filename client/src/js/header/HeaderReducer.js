import { WRITE_A_STORY, SCAN_NEWS, CONFIGURE, POP_UP } from "./HeaderActions";

export const currentHeaderTab = (state = SCAN_NEWS, action = {}) => {
    switch(action.type) {
    case WRITE_A_STORY: {
        return action.currentHeaderTab;
    }
    case SCAN_NEWS: {
        return action.currentHeaderTab;
    }
    case CONFIGURE: {
        return action.currentHeaderTab;
    }
    default: return state;
    }
};

export const popUp = (state = {}, action = {}) => {
    switch(action.type) {
    case POP_UP: {
        return Object.assign({}, state, { "message": action.message, "callback": action.callback, "hide": action.hide });
    }
    default: return state;
    }
};
