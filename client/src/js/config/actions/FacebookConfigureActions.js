import AjaxClient from "./../../utils/AjaxClient";
import LoginPage from "../../login/pages/LoginPage";
import fetch from "isomorphic-fetch";
import AppWindow from "../../utils/AppWindow";
import { intersectionWith } from "../../utils/SearchResultsSetOperations";
import { hasMoreSourceResults, noMoreSourceResults, switchSourceTab } from "./../../sourceConfig/actions/SourceConfigurationActions";

export const FACEBOOK_GOT_SOURCES = "FACEBOOK_GOT_SOURCES";
export const FACEBOOK_ADD_PROFILE = "FACEBOOK_ADD_PROFILE";
export const FACEBOOK_ADD_PAGE = "FACEBOOK_ADD_PAGE";
export const FACEBOOK_ADD_GROUP = "FACEBOOK_ADD_GROUP";
export const PROFILES = "Profiles";
export const PAGES = "Pages";
export const GROUPS = "Groups";

export function facebookSourcesReceived(response) {
    return {
        "type": FACEBOOK_GOT_SOURCES,
        "sources": response
    };
}


export async function addToConfiguredSources(dispatch, sources, sourceType, eventType) {
    let configuredSource = sources.map(source => Object.assign({}, source, { "url": source.id }));
    let data = await fetch(`${AppWindow.instance().get("serverUrl")}/facebook/configureSource`, {
        "method": "PUT",
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        "credentials": "same-origin",
        "body": JSON.stringify({ "sources": configuredSource, "type": sourceType })
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
        let sourceType = getState().facebookCurrentSourceTab;
        let sources = getState().facebookSources.data;
        dispatch(addSourceToConfigureListOf(sourceType, ...sources));
    };
}

export function addSourceToConfigureListOf(sourceType, ...sources) {
    switch (sourceType) {
    case PROFILES: {
        return dispatch => addToConfiguredSources(dispatch, sources, "fb_profile", FACEBOOK_ADD_PROFILE);
    }
    case PAGES: {
        return dispatch => addToConfiguredSources(dispatch, sources, "fb_page", FACEBOOK_ADD_PAGE);
    }
    case GROUPS: {
        return dispatch => addToConfiguredSources(dispatch, sources, "fb_group", FACEBOOK_ADD_GROUP);
    }
    default: {
        return {
            "type": FACEBOOK_ADD_PROFILE,
            sources
        };
    }
    }
}

export function fetchFacebookSources(keyword = "Murali", type, sourceType, props = {}) {
    let ajaxClient = AjaxClient.instance("/facebook-sources", false);
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    return (dispatch, getState) => {
        ajaxClient.post(headers, { "userName": LoginPage.getUserName(), keyword, type, "paging": props })
            .then((response) => {
                dispatch(switchSourceTab(sourceType));
                if(response.data.length) {
                    let configuredSources = getState().configuredSources[sourceType.toLowerCase()];
                    const cmp = (first, second) => first.id === second._id;
                    intersectionWith(cmp, response.data, configuredSources);
                    dispatch(facebookSourcesReceived(response));
                    dispatch(hasMoreSourceResults());
                } else {
                    dispatch(noMoreSourceResults());
                }
            });
    };
}
