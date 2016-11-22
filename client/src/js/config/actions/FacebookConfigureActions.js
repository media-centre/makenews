import AjaxClient from "./../../utils/AjaxClient";
import LoginPage from "../../login/pages/LoginPage";
import DbParameters from "../../db/DbParameters";

export const FACEBOOK_GOT_PROFILES = "FACEBOOK_GOT_PROFILES";
export const FACEBOOK_ADD_PROFILE = "FACEBOOK_ADD_PROFILE";
export const FACEBOOK_GOT_CONFIGURED_PROFILES = "FACEBOOK_GOT_CONFIGURED_PROFILES";

export function facebookProfilesReceived(profiles) {
    return {
        "type": FACEBOOK_GOT_PROFILES,
        "profiles": profiles
    };
}

export function configuredProfilesReceived(profiles) {
    return {
        "type": FACEBOOK_GOT_CONFIGURED_PROFILES,
        "profiles": profiles
    };
}

export function addFacebookProfile(profile) {
    return {
        "type": FACEBOOK_ADD_PROFILE,
        "profile": profile
    };
}

export function facebookGetProfiles() {
    let ajaxClient = AjaxClient.instance("/facebook-profiles", false);
    return dispatch => {
        ajaxClient.get({ "userName": LoginPage.getUserName() })
            .then((data) => {
                dispatch(facebookProfilesReceived(data.profiles));
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
