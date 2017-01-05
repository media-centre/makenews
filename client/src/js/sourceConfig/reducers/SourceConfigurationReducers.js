import {
    FACEBOOK_ADD_PROFILE,
    FACEBOOK_ADD_PAGE,
    FACEBOOK_ADD_GROUP,
    FACEBOOK_GOT_SOURCES
} from "./../../config/actions/FacebookConfigureActions";
import { markSourcesAsAdded } from "./../../sourceConfig/reducers/SourceConfiguraionReducersUtils";
import { List } from "immutable";
import {
    GOT_CONFIGURED_SOURCES,
    HAS_MORE_SOURCE_RESULTS,
    NO_MORE_SOURCE_RESULTS,
    CHANGE_CURRENT_SOURCE_TAB,
    WEB,
    CLEAR_SOURCES,
    SOURCE_SEARCH_KEYWORD
} from "./../actions/SourceConfigurationActions";
import { WEB_GOT_SOURCE_RESULTS, WEB_ADD_SOURCE } from "./../../config/actions/WebConfigureActions";
import { TWITTER_GOT_SOURCE_RESULTS, TWITTER_ADD_SOURCE } from "./../../config/actions/TwitterConfigureActions";
import R from "ramda"; //eslint-disable-line id-length

export const sourceResults = (state = { "data": [], "nextPage": {} }, action = {}) => {
    switch(action.type) {
    case FACEBOOK_GOT_SOURCES:
    case TWITTER_GOT_SOURCE_RESULTS:
    case WEB_GOT_SOURCE_RESULTS: {
        return Object.assign({}, state, { "data": List(state.data).concat(action.sources.data).toArray(), "nextPage": action.sources.paging, "twitterPreFirstId": action.sources.twitterPreFirstId }); //eslint-disable-line new-cap
    }
    case FACEBOOK_ADD_PROFILE:
    case FACEBOOK_ADD_PAGE:
    case FACEBOOK_ADD_GROUP: {
        return Object.assign({}, state, { "data": markSourcesAsAdded(state.data, action.sources, "id") });
    }

    case WEB_ADD_SOURCE: {
        return Object.assign({}, state, { "data": markSourcesAsAdded(state.data, action.sources, "url") });
    }

    case TWITTER_ADD_SOURCE: {
        return Object.assign({}, state, { "data": markSourcesAsAdded(state.data, action.sources, "id") });
    }
        
    case CLEAR_SOURCES: {
        return { "data": [], "nextPage": {} };
    }

    default: return state;
    }
};

export const configuredSources = (state = { "profiles": [], "pages": [], "groups": [], "twitter": [], "web": [] }, action = {}) => {
    switch (action.type) {
    case FACEBOOK_ADD_PROFILE: {
        let sources = R.map(source => Object.assign({}, source, { "_id": source.id }), action.sources);
        return Object.assign({}, state, { "profiles": List(state.profiles).concat(sources).toArray() }); //eslint-disable-line new-cap
    }
    case FACEBOOK_ADD_PAGE: {
        let sources = R.map(source => Object.assign({}, source, { "_id": source.id }), action.sources);
        return Object.assign({}, state, { "pages": List(state.pages).concat(sources).toArray() }); //eslint-disable-line new-cap
    }
    case FACEBOOK_ADD_GROUP: {
        let sources = R.map(source => Object.assign({}, source, { "_id": source.id }), action.sources);
        return Object.assign({}, state, { "groups": List(state.groups).concat(sources).toArray() }); //eslint-disable-line new-cap
    }
    case WEB_ADD_SOURCE: {
        let sources = R.map(source => Object.assign({}, source, { "_id": source.url }), action.sources);
        return Object.assign({}, state, { "web": List(state.web).concat(sources).toArray() }); //eslint-disable-line new-cap
    }
    case TWITTER_ADD_SOURCE: {
        let sources = R.map(source => Object.assign({}, source, { "_id": source.id }), action.sources);
        return Object.assign({}, state, { "twitter": List(state.twitter).concat(sources).toArray() }); //eslint-disable-line new-cap
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

export const currentSourceTab = (state = WEB, action = {}) => {
    switch(action.type) {
    case CHANGE_CURRENT_SOURCE_TAB: {
        return action.currentTab;
    }
    default: return state;
    }
};

export const sourceSearchKeyword = (keyword = "", action = {}) => {
    if(action.type === SOURCE_SEARCH_KEYWORD) {
        return action.keyword;
    }
    return keyword;
};
