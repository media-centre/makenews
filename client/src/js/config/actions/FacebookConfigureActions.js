import AjaxClient from "./../../utils/AjaxClient";
import LoginPage from "../../login/pages/LoginPage";
import DbParameters from "../../db/DbParameters";
import fetch from "isomorphic-fetch";
import AppWindow from "../../utils/AppWindow";
import { intersectionWith } from "../../utils/SearchResultsSetOperations";

export const FACEBOOK_GOT_SOURCES = "FACEBOOK_GOT_SOURCES";
export const FACEBOOK_ADD_PROFILE = "FACEBOOK_ADD_PROFILE";
export const FACEBOOK_ADD_PAGE = "FACEBOOK_ADD_PAGE";
export const GOT_CONFIGURED_SOURCES = "GOT_CONFIGURED_SOURCES";
export const FACEBOOK_CHANGE_CURRENT_TAB = "FACEBOOK_CHANGE_CURRENT_TAB";
export const PROFILES = "Profiles";
export const PAGES = "Pages";
export const GROUPS = "Groups";

export function facebookSourcesReceived(sources) {
    return {
        "type": FACEBOOK_GOT_SOURCES,
        sources
    };
}

export function configuredSourcesReceived(sources) {
    return {
        "type": GOT_CONFIGURED_SOURCES,
        "sources": sources
    };
}

export async function addPageToConfiguredSources(dispatch, source) {
    let dbName = await DbParameters.instance().getLocalDbUrl();
    let configuredSource = Object.assign({}, source, { "url": source.id });
    let data = await fetch(`${AppWindow.instance().get("serverUrl")}/facebook/configuredSource`, {
        "method": "PUT",
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        "credentials": "same-origin",
        "body": JSON.stringify({ "dbName": dbName, "source": configuredSource })
    });
    if (data.ok) {
        dispatch({
            "type": FACEBOOK_ADD_PAGE,
            source
        });
    }
}

export function addSourceToConfigureListOf(souceType, source) {
    switch (souceType) {
    case PROFILES: {
        return {
            "type": FACEBOOK_ADD_PROFILE,
            source
        };
    }
    case PAGES: {
        return dispatch => addPageToConfiguredSources(dispatch, source);
    }
    default: {
        return {
            "type": FACEBOOK_ADD_PROFILE,
            source
        };
    }
    }
}

export function facebookSourceTabSwitch(currentTab) {
    return {
        "type": FACEBOOK_CHANGE_CURRENT_TAB,
        currentTab
    };
}

export function fetchFacebookProfiles() {
    let ajaxClient = AjaxClient.instance("/facebook-profiles", false);
    return dispatch => {
        ajaxClient.get({ "userName": LoginPage.getUserName() })
            .then((data) => {
                dispatch(facebookSourceTabSwitch(PROFILES));
                dispatch(facebookSourcesReceived(data));
            });
    };
}

export function getConfiguredSources() {
    let ajaxClient = AjaxClient.instance("/facebook/configured", false);
    return dispatch => {
        DbParameters.instance().getLocalDbUrl().then(dbName => {
            ajaxClient.get({ "dbName": dbName })
                .then((sources) => {
                    dispatch(configuredSourcesReceived(sources));
                });
        });
    };
}

function cmp(first, second) {
    return first.id === second._id;
}

function fetchFacebookPages(pageName) {
    let ajaxClient = AjaxClient.instance("/facebook-pages", false);
    return (dispatch, getState) => {
        ajaxClient.get({ "userName": LoginPage.getUserName(), "keyword": pageName })
            .then((response) => {
                dispatch(facebookSourceTabSwitch(PAGES));
                let configuredSources = getState().configuredSources.pages;
                intersectionWith(cmp, response.data, configuredSources);
                dispatch(facebookSourcesReceived(response.data));
            });
    };
}
export function getSourcesOf(sourceType, pageName) {
    switch (sourceType) {
    case PROFILES: {
        return fetchFacebookProfiles();
    }
    case PAGES: {
        return fetchFacebookPages(pageName);
    }
    default: {
        return fetchFacebookProfiles();
    }
    }
}
