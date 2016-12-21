import AjaxClient from "./../../utils/AjaxClient";
import * as FbActions from "./../../config/actions/FacebookConfigureActions";
import * as WebConfigActions from "./../../config/actions/WebConfigureActions";
import fetch from "isomorphic-fetch";
import AppWindow from "../../utils/AppWindow";
import R from "ramda"; //eslint-disable-line id-length

export const GOT_CONFIGURED_SOURCES = "GOT_CONFIGURED_SOURCES";
export const HAS_MORE_SOURCE_RESULTS = "HAS_MORE_SOURCE_RESULTS";
export const NO_MORE_SOURCE_RESULTS = "NO_MORE_SOURCE_RESULTS";
export const CLEAR_SOURCES = "CLEAR_SOURCES";
export const CHANGE_CURRENT_SOURCE_TAB = "CHANGE_CURRENT_SOURCE_TAB";
export const WEB = "WEB";
export const TWITTER = "TWITTER";
export const SOURCE_SEARCH_KEYWORD = "SOURCE_SEARCH_KEYWORD";

export function configuredSourcesReceived(sources) {
    return {
        "type": GOT_CONFIGURED_SOURCES,
        "sources": sources
    };
}

export const noMoreSourceResults = () => {
    return {
        "type": NO_MORE_SOURCE_RESULTS
    };
};

export const hasMoreSourceResults = () => {
    return {
        "type": HAS_MORE_SOURCE_RESULTS
    };
};


export const clearSources = () => {
    return {
        "type": CLEAR_SOURCES
    };
};

export function getConfiguredSources() {
    let ajaxClient = AjaxClient.instance("/configuredSources", false);
    return async dispatch => {
        let sources = null;
        try {
            sources = await ajaxClient.get();
            dispatch(configuredSourcesReceived(sources));
        } catch(err) { //eslint-disable-line no-empty
            /* TODO: we can use this to stop the spinner or give a warning once request failed */ //eslint-disable-line
        }
    };
}

export function addSourceToConfigureList(sourceType, ...sources) {
    switch (sourceType) {
    case FbActions.PROFILES: {
        let configuredSources = sources.map(source => Object.assign({}, source, { "url": source.id }));
        return dispatch => addToConfiguredSources(dispatch, configuredSources, "fb_profile", FbActions.FACEBOOK_ADD_PROFILE);
    }
    case FbActions.PAGES: {
        let configuredSources = sources.map(source => Object.assign({}, source, { "url": source.id }));
        return dispatch => addToConfiguredSources(dispatch, configuredSources, "fb_page", FbActions.FACEBOOK_ADD_PAGE);
    }
    case FbActions.GROUPS: {
        let configuredSources = sources.map(source => Object.assign({}, source, { "url": source.id }));
        return dispatch => addToConfiguredSources(dispatch, configuredSources, "fb_group", FbActions.FACEBOOK_ADD_GROUP);
    }
    case WEB: {
        return dispatch => addToConfiguredSources(dispatch, sources, "web", WebConfigActions.WEB_ADD_SOURCE);
    }
    default: {
        return {
            "type": FbActions.FACEBOOK_ADD_PROFILE,
            sources
        };
    }
    }
}

async function addToConfiguredSources(dispatch, sources, sourceType, eventType) {
    let data = await fetch(`${AppWindow.instance().get("serverUrl")}/facebook/configureSource`, {
        "method": "PUT",
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        "credentials": "same-origin",
        "body": JSON.stringify({ "sources": sources, "type": sourceType })
    });
    if (data.ok) {
        dispatch({
            "type": eventType,
            sources
        });
    }
}

export function addAllSources() {
    return (dispatch, getState) => {
        let sourceType = getState().currentSourceTab;
        let sources = getState().sourceResults.data;
        let unConfiguredSources = R.reject(source => source.added, sources);
        dispatch(addSourceToConfigureList(sourceType, ...unConfiguredSources));
    };
}

export function switchSourceTab(currentTab) {
    return {
        "type": CHANGE_CURRENT_SOURCE_TAB,
        currentTab
    };
}

export function searchSourceKeyword(keyword = "") {
    return {
        "type": SOURCE_SEARCH_KEYWORD,
        keyword
    };
}

export function getSources(sourceType, keyword, params) {
    switch (sourceType) {
    case FbActions.PAGES: {
        return FbActions.fetchFacebookSources(keyword, "page", sourceType, params);
    }
    case FbActions.GROUPS: {
        return FbActions.fetchFacebookSources(keyword, "group", sourceType, params);
    }
    case FbActions.PROFILES: {
        return FbActions.fetchFacebookSources(keyword, "profile", sourceType, params);
    }
    case WEB: {
        return WebConfigActions.fetchWebSources(keyword, params);
    }
    default: {
        return FbActions.fetchFacebookSources(keyword, "page", sourceType, params);
    }
    }
}
