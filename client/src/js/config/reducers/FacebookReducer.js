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
        return Object.assign([], addSource(state, action.sources));
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

function addSourceProps(source) {
    source._id = source.id;
    source.added = true;
    delete source.id;
}

function addSource(sources, sourcesToConfigure) {
    if(sources.length === sourcesToConfigure.length) {
        return sourcesToConfigure.map(source => {
            if(!source._id) {
                addSourceProps(source);
            }
            return source;
        });
    }
    let [sourceToConfigure] = sourcesToConfigure;
    let addedSource = sources.find(source => source.id === sourceToConfigure.id);
    addSourceProps(addedSource);
    return sources;
}
