import { WRITE_A_STORY, SCAN_NEWS, CONFIGURE } from "./HeaderActions";

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
