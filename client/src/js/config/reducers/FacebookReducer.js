import {
    FACEBOOK_GOT_SOURCES,
    FACEBOOK_ADD_PROFILE,
    FACEBOOK_ADD_PAGE,
    FACEBOOK_ADD_GROUP,
    FACEBOOK_CHANGE_CURRENT_TAB,
    PROFILES
} from "./../actions/FacebookConfigureActions";

export const facebookSources = (state = [], action = {}) => {
    switch(action.type) {
    case FACEBOOK_GOT_SOURCES: {
        return action.sources;
    }

    case FACEBOOK_ADD_PROFILE:
    case FACEBOOK_ADD_PAGE:
    case FACEBOOK_ADD_GROUP: {
        return Object.assign([], addSource(state, action.source.id));
    }

    default: return state;
    }
};

export const facebookCurrentSourceTab = (state = PROFILES, action = {}) => {
    switch(action.type) {
    case FACEBOOK_CHANGE_CURRENT_TAB: {
        return action.currentTab;
    }
    default: return state;
    }
};

function addSource(sources, id) {
    let addedSource = sources.find(source => source.id === id);
    addedSource.added = true;
    addedSource._id = addedSource.id;
    delete addedSource.id;
    return sources;
}
