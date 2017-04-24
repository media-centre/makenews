import AjaxClient from "./../../utils/AjaxClient";
import * as FbActions from "./../../config/actions/FacebookConfigureActions";
import * as WebConfigActions from "./../../config/actions/WebConfigureActions";
import { removeSource } from "./../../newsboard/filter/FilterActions";
import * as TwitterConfigureActions from "./../../config/actions/TwitterConfigureActions";
import R from "ramda"; //eslint-disable-line id-length
import Toast from "../../utils/custom_templates/Toast";

export const GOT_CONFIGURED_SOURCES = "GOT_CONFIGURED_SOURCES";
export const CLEAR_SOURCES = "CLEAR_SOURCES";
export const CHANGE_CURRENT_SOURCE_TAB = "CHANGE_CURRENT_SOURCE_TAB";
export const WEB = "web";
export const TWITTER = "twitter";
export const FETCHING_SOURCE_RESULTS = "FETCHING_SOURCE_RESULTS";
export const FETCHING_SOURCE_RESULTS_FAILED = "FETCHING_SOURCE_RESULTS_FAILED";
export const CONFIGURED_SOURCE_SEARCH_KEYWORD = "CONFIGURED_SOURCE_SEARCH_KEYWORD";
export const SOURCE_DELETED = "SOURCE_DELETED";
export const UNMARK_DELETED_SOURCE = "UNMARK_DELETED_SOURCE";
export const DELETE_SOURCE_STATUS = "DELETE_SOURCE_STATUS";

export function configuredSourcesReceived(sources) {
    return {
        "type": GOT_CONFIGURED_SOURCES,
        "sources": sources
    };
}

export const clearSources = { "type": CLEAR_SOURCES };

export function getConfiguredSources() {
    let ajaxClient = AjaxClient.instance("/configure-sources");
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
        let configuredSources = Object.assign([], sources);
        return dispatch => addToConfiguredSources(dispatch, configuredSources, "web", WebConfigActions.WEB_ADD_SOURCE);
    }
    case TWITTER: {
        let configuredSources = sources.map(source => Object.assign({}, source, { "url": source.id }));
        return dispatch => addToConfiguredSources(dispatch, configuredSources, "twitter", TwitterConfigureActions.TWITTER_ADD_SOURCE);
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

    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    const ajaxClient = AjaxClient.instance("/configure-sources");
    const data = await ajaxClient.put(headers, { sources, "type": sourceType });

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
        if(unConfiguredSources.length) {
            dispatch(addSourceToConfigureList(sourceType, ...unConfiguredSources));
        }
    };
}

export function switchSourceTab(currentTab) {
    return {
        "type": CHANGE_CURRENT_SOURCE_TAB,
        currentTab
    };
}

export const fetchingSources = { "type": FETCHING_SOURCE_RESULTS };

export function fetchingSourcesFailed(keyword) {
    return {
        "type": FETCHING_SOURCE_RESULTS_FAILED,
        keyword
    };
}

export function searchInConfiguredSources(keyword = "") {
    return {
        "type": CONFIGURED_SOURCE_SEARCH_KEYWORD,
        keyword
    };
}

export function getSources(sourceType, keyword, params, twitterPreFirstId = 0) { //eslint-disable-line no-magic-numbers
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
    case TWITTER: {
        return TwitterConfigureActions.fetchTwitterSources(keyword, params, twitterPreFirstId);
    }
    default: {
        return FbActions.fetchFacebookSources(keyword, "page", sourceType, params);
    }
    }
}

export function deleteSource(sourceId, sourceType, event) {
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    const button = event.target;
    button.className = "spinner";
    button.textContent = "";
    return async dispatch => {
        const ajaxInstance = AjaxClient.instance("/delete-sources");
        try {
            const response = await ajaxInstance.post(headers, { "sources": [sourceId] });
            if(response.ok) {
                dispatch(unmarkSource(sourceId));
                dispatch(deletedSource(sourceId, sourceType));
                dispatch(removeSource(sourceId, sourceType));
            } else {
                throw new Error();
            }
        } catch(err) {
            button.className = "delete-source";
            button.innerHTML = "&times";
            Toast.show("Could not delete source");
        }
    };
}


function deletedSource(sourceId, sourceType) {
    return {
        "type": SOURCE_DELETED,
        "source": sourceId,
        sourceType
    };
}

function unmarkSource(sourceId) {
    return {
        "type": UNMARK_DELETED_SOURCE,
        "source": sourceId
    };
}
