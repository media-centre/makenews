import { WRITE_A_STORY, SCAN_NEWS, USER_PROFILE, CONFIGURE } from "./HeaderActions";

export const currentHeaderTab = (state = SCAN_NEWS, action = {}) => {
    switch(action.type) {
    case WRITE_A_STORY: {
        return action.currentHeaderTab;
    }
    case SCAN_NEWS: {
        return action.currentHeaderTab;
    }
    case USER_PROFILE: {
        return action.currentHeaderTab;
    }
    case CONFIGURE: {
        return action.currentHeaderTab;
    }
    default: return state;
    }
};
