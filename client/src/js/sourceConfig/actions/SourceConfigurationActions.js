import AjaxClient from "./../../utils/AjaxClient";
import * as FbActions from "./../../config/actions/FacebookConfigureActions";
import * as WebConfigActions from "./../../config/actions/WebConfigureActions";

export const GOT_CONFIGURED_SOURCES = "GOT_CONFIGURED_SOURCES";
export const HAS_MORE_SOURCE_RESULTS = "HAS_MORE_SOURCE_RESULTS";
export const NO_MORE_SOURCE_RESULTS = "NO_MORE_SOURCE_RESULTS";
export const CLEAR_SOURCES = "CLEAR_SOURCES";
export const CHANGE_CURRENT_SOURCE_TAB = "CHANGE_CURRENT_SOURCE_TAB";
export const WEB = "WEB";
export const TWITTER = "TWITTER";

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

export function switchSourceTab(currentTab) {
    return {
        "type": CHANGE_CURRENT_SOURCE_TAB,
        currentTab
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
