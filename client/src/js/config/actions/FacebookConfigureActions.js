import AjaxClient from "./../../utils/AjaxClient";
import LoginPage from "../../login/pages/LoginPage";
import DbParameters from "../../db/DbParameters";

export const FACEBOOK_GOT_PROFILES = "FACEBOOK_GOT_PROFILES";
export const FACEBOOK_ADD_PROFILE = "FACEBOOK_ADD_PROFILE";
export const FACEBOOK_GOT_CONFIGURED_PROFILES = "FACEBOOK_GOT_CONFIGURED_PROFILES";
export const FACEBOOK_CHANGE_CURRENT_TAB = "FACEBOOK_CHANGE_CURRENT_TAB";
export const PROFILES = "Profiles";
export const PAGES = "Pages";
export const GROUPS = "Groups";

export function facebookProfilesReceived(profiles) {
    return {
        "type": FACEBOOK_GOT_PROFILES,
        profiles
    };
}

export function configuredProfilesReceived(profiles) {
    return {
        "type": FACEBOOK_GOT_CONFIGURED_PROFILES,
        profiles
    };
}

export function addFacebookProfile(profile) {
    return {
        "type": FACEBOOK_ADD_PROFILE,
        profile
    };
}

export function facebookSourceTabSwitch(currentTab) {
    return {
        "type": FACEBOOK_CHANGE_CURRENT_TAB,
        currentTab
    };
}

export function facebookGetProfiles() {
    let ajaxClient = AjaxClient.instance("/facebook-profiles", false);
    return dispatch => {
        ajaxClient.get({ "userName": LoginPage.getUserName() })
            .then((data) => {
                dispatch(facebookProfilesReceived(data));
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
