import AjaxClient from "./../../utils/AjaxClient";
import LoginPage from "../../login/pages/LoginPage";

export const FACEBOOK_GOT_PROFILES = "FACEBOOK_GOT_PROFILES";
export const FACEBOOK_ADD_PROFILE = "FACEBOOK_ADD_PROFILE";

export function facebookProfilesReceived(profiles) {
    return {
        "type": FACEBOOK_GOT_PROFILES,
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
    var userName = LoginPage.getUserName();
    return dispatch => {
        ajaxClient.get({ "userName": userName })
            .then((data) => {
                dispatch(facebookProfilesReceived(data.profiles));
            });
    };
}
