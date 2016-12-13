import {
    FACEBOOK_ADD_PROFILE,
    FACEBOOK_ADD_PAGE,
    FACEBOOK_ADD_GROUP
} from "./../../config/actions/FacebookConfigureActions";
import { List } from "immutable";
import { GOT_CONFIGURED_SOURCES, HAS_MORE_SOURCE_RESULTS, NO_MORE_SOURCE_RESULTS } from "./../actions/SourceConfigurationActions";

export const configuredSources = (state = { "profiles": [], "pages": [], "groups": [], "twitter": [], "web": [] }, action = {}) => {
    switch (action.type) {
    case FACEBOOK_ADD_PROFILE: {
        return Object.assign({}, state, { "profiles": List(state.profiles).concat(action.sources).toArray() }); //eslint-disable-line new-cap
    }
    case FACEBOOK_ADD_PAGE: {
        return Object.assign({}, state, { "pages": List(state.pages).concat(action.sources).toArray() }); //eslint-disable-line new-cap
    }
    case FACEBOOK_ADD_GROUP: {
        return Object.assign({}, state, { "groups": List(state.groups).concat(action.sources).toArray() }); //eslint-disable-line new-cap
    }
    case GOT_CONFIGURED_SOURCES: {
        return action.sources;
    }
    default: return state;
    }
};

export const hasMoreSourceResults = (state, action = {}) => {
    switch (action.type) {
    case HAS_MORE_SOURCE_RESULTS: {
        return true;
    }
    case NO_MORE_SOURCE_RESULTS: {
        return false;
    }
    default: {
        return true;
    }
    }
};
