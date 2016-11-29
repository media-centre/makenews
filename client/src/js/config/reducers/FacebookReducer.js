import {
    FACEBOOK_GOT_SOURCES,
    FACEBOOK_ADD_PROFILE,
    FACEBOOK_ADD_PAGE,
    GOT_CONFIGURED_SOURCES,
    FACEBOOK_CHANGE_CURRENT_TAB,
    PROFILES
} from "./../actions/FacebookConfigureActions";
import { List } from "immutable";

export const configuredSources = (state = { "profiles": [], "pages": [], "groups": [], "twitter": [], "web": [] }, action = {}) => {
    switch (action.type) {
    case FACEBOOK_ADD_PROFILE: {
        return Object.assign({}, state, { "profiles": List(state.profiles).push(action.source).toArray() }); //eslint-disable-line new-cap
    }
    case FACEBOOK_ADD_PAGE: {
        return Object.assign({}, state, { "pages": List(state.pages).push(action.source).toArray() }); //eslint-disable-line new-cap
    }
    case GOT_CONFIGURED_SOURCES: {
        return action.sources;
    }
    default: return state;
    }
};

export const facebookSources = (state = [], action = {}) => {
    switch(action.type) {
    case FACEBOOK_GOT_SOURCES: {
        return action.sources;
    }
    case FACEBOOK_ADD_PROFILE: {
        return Object.assign([], addSource(state, action.source.id));
    }
    case FACEBOOK_ADD_PAGE: {
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

function addSource(profiles, id) {
    profiles.find(profile => profile.id === id).added = true;
    return profiles;
}
