import AjaxClient from "./../../utils/AjaxClient";
import LoginPage from "../../login/pages/LoginPage";
import DbParameters from "../../db/DbParameters";

export const FACEBOOK_GOT_SOURCES = "FACEBOOK_GOT_SOURCES";
export const FACEBOOK_ADD_PROFILE = "FACEBOOK_ADD_PROFILE";
export const FACEBOOK_ADD_PAGE = "FACEBOOK_ADD_PAGE";
export const FACEBOOK_GOT_CONFIGURED_PROFILES = "FACEBOOK_GOT_CONFIGURED_PROFILES";
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

export function configuredProfilesReceived(profiles) {
    return {
        "type": FACEBOOK_GOT_CONFIGURED_PROFILES,
        profiles
    };
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
        return {
            "type": FACEBOOK_ADD_PAGE,
            source
        };
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

export function getConfiguredProfiles() {
    let ajaxClient = AjaxClient.instance("/facebook/configured/profiles", false);
    return dispatch => {
        DbParameters.instance().getLocalDbUrl().then(dbName => {
            ajaxClient.get({ "dbName": dbName })
                .then((data) => {
                    dispatch(configuredProfilesReceived(data.profiles));
                });
        });
    };
}

function fetchFacebookPages(pageName) {
    let ajaxClient = AjaxClient.instance("/facebook-pages", false);
    return dispatch => {
        ajaxClient.get({ "userName": LoginPage.getUserName(), "pageName": pageName })
            .then((response) => {
                dispatch(facebookSourceTabSwitch(PAGES));
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
