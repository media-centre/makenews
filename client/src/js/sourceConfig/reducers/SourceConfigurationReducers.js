import {
    FACEBOOK_ADD_PROFILE,
    FACEBOOK_ADD_PAGE,
    FACEBOOK_ADD_GROUP,
    FACEBOOK_GOT_SOURCES
} from "./../../config/actions/FacebookConfigureActions";
import { markSourcesAsAdded, unmarkDeletedSource } from "./../../sourceConfig/reducers/SourceConfiguraionReducersUtils";
import {
    GOT_CONFIGURED_SOURCES,
    CHANGE_CURRENT_SOURCE_TAB,
    WEB,
    CLEAR_SOURCES,
    FETCHING_SOURCE_RESULTS,
    FETCHING_SOURCE_RESULTS_FAILED,
    CONFIGURED_SOURCE_SEARCH_KEYWORD,
    SOURCE_DELETED,
    UNMARK_DELETED_SOURCE,
    DELETE_SOURCE_STATUS
} from "./../actions/SourceConfigurationActions";
import { WEB_GOT_SOURCE_RESULTS, WEB_ADD_SOURCE } from "./../../config/actions/WebConfigureActions";
import { TWITTER_GOT_SOURCE_RESULTS, TWITTER_ADD_SOURCE } from "./../../config/actions/TwitterConfigureActions";
import R from "ramda"; //eslint-disable-line id-length

const sourceResultsInitialState = {
    "data": [],
    "nextPage": {},
    "isFetchingSources": false,
    "twitterPreFirstId": 0,
    "keyword": "",
    "hasMoreSourceResults": true
};
let tab = WEB;
export const sourceResults = (state = sourceResultsInitialState, action = {}) => {
    switch(action.type) {
    case FACEBOOK_GOT_SOURCES: {
        if(action.currentTab === tab) {
            return Object.assign({}, state,
                {
                    "data": state.data.concat(action.sources.data),
                    "nextPage": action.sources.paging,
                    "twitterPreFirstId": action.sources.twitterPreFirstId,
                    "isFetchingSources": false,
                    "keyword": action.sources.keyword,
                    "hasMoreSourceResults": true
                });
        }
        return state;
    }
    case TWITTER_GOT_SOURCE_RESULTS: {
        if(action.currentTab === tab) {
            return Object.assign({}, state,
                {
                    "data": state.data.concat(action.sources.data),
                    "nextPage": action.sources.paging,
                    "twitterPreFirstId": action.sources.twitterPreFirstId,
                    "isFetchingSources": false,
                    "keyword": action.sources.keyword,
                    "hasMoreSourceResults": true
                });
        }
        return state;
    }
    case WEB_GOT_SOURCE_RESULTS: {
        if(action.currentTab === tab) {
            return Object.assign({}, state,
                {
                    "data": state.data.concat(action.sources.data),
                    "nextPage": action.sources.paging,
                    "twitterPreFirstId": action.sources.twitterPreFirstId,
                    "isFetchingSources": false,
                    "keyword": action.sources.keyword,
                    "hasMoreSourceResults": true
                });
        }
        return state;
    }
    case FACEBOOK_ADD_PROFILE:
    case FACEBOOK_ADD_PAGE:
    case FACEBOOK_ADD_GROUP: {
        return Object.assign({}, state, { "data": markSourcesAsAdded(state.data, action.sources, "id") });
    }

    case FETCHING_SOURCE_RESULTS: {
        return Object.assign({}, state, { "isFetchingSources": true });
    }

    case FETCHING_SOURCE_RESULTS_FAILED: {
        return Object.assign({}, state, { "isFetchingSources": false, "keyword": action.keyword, "hasMoreSourceResults": false });
    }

    case WEB_ADD_SOURCE: {
        return Object.assign({}, state, { "data": markSourcesAsAdded(state.data, action.sources, "url") });
    }

    case TWITTER_ADD_SOURCE: {
        return Object.assign({}, state, { "data": markSourcesAsAdded(state.data, action.sources, "id") });
    }

    case UNMARK_DELETED_SOURCE: {
        return Object.assign({}, state, { "data": unmarkDeletedSource(state.data, action.source) });
    }

    case CLEAR_SOURCES: {
        return Object.assign({}, state,
            { "data": [],
                "nextPage": {},
                "hasMoreSourceResults": true
            });
    }

    default: return state;
    }
};

export const configuredSources = (state = { "profiles": [], "pages": [], "groups": [], "twitter": [], "web": [] }, action = {}) => {
    switch (action.type) {
    case FACEBOOK_ADD_PROFILE: {
        let sources = R.map(source => Object.assign({}, source, { "_id": source.id }), action.sources);
        return Object.assign({}, state, { "profiles": state.profiles.concat(sources) });
    }
    case FACEBOOK_ADD_PAGE: {
        let sources = R.map(source => Object.assign({}, source, { "_id": source.id }), action.sources);
        return Object.assign({}, state, { "pages": state.pages.concat(sources) });
    }
    case FACEBOOK_ADD_GROUP: {
        let sources = R.map(source => Object.assign({}, source, { "_id": source.id }), action.sources);
        return Object.assign({}, state, { "groups": state.groups.concat(sources) });
    }
    case WEB_ADD_SOURCE: {
        let sources = R.map(source => Object.assign({}, source, { "_id": source.id }), action.sources);
        return Object.assign({}, state, { "web": state.web.concat(sources) });
    }
    case TWITTER_ADD_SOURCE: {
        let sources = R.map(source => Object.assign({}, source, { "_id": source.id }), action.sources);
        return Object.assign({}, state, { "twitter": state.twitter.concat(sources) });
    }
    case GOT_CONFIGURED_SOURCES: {
        return action.sources;
    }
    case SOURCE_DELETED: {
        state[action.sourceType] = removeSource(state[action.sourceType], action.source);
        return Object.assign({}, state);
    }
    default: return state;
    }
};

export const currentSourceTab = (state = WEB, action = {}) => {
    switch(action.type) {
    case CHANGE_CURRENT_SOURCE_TAB: {
        tab = action.currentTab;
        return action.currentTab;
    }
    default: return state;
    }
};

export const searchInConfiguredSources = (keyword = "", action = {}) => {
    if(action.type === CONFIGURED_SOURCE_SEARCH_KEYWORD) {
        return action.keyword;
    }
    return keyword;
};

export function deleteSourceStatus(state = "", action = {}) {
    if(action.type === DELETE_SOURCE_STATUS) {
        return action.message;
    }
    return state;
}

function removeSource(sources, sourceToDelete) {
    return R.filter(source => source._id !== sourceToDelete, sources);
}
