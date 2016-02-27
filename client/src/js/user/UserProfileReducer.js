"use strict";
import { INCORRECT_USER_CREDENTIALS, PASSWORD_UPDATION_FAILED, NEW_PWD_CONFIRM_PWD_MISMATCH, NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD, CHANGE_PASSWORD_SUCCESSFUL } from "./UserProfileActions.js";
import Toast from "../utils/custom_templates/Toast.js";
import Local from "../utils/Locale.js";

export function changePassword(state = { "errorMessage": "" }, action = {}) {
    let appEn = Local.applicationStrings();
    switch(action.type) {
    case INCORRECT_USER_CREDENTIALS:
        return {
            "errorMessage": appEn.messages.userProfile.invalidCredentials
        };

    case PASSWORD_UPDATION_FAILED:
        return {
            "errorMessage": appEn.messages.userProfile.passwordUpdateFailure
        };

    case NEW_PWD_CONFIRM_PWD_MISMATCH:
        return {
            "errorMessage": appEn.messages.userProfile.newPwdConfirmPwdMismatch
        };

    case NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD:
        return {
            "errorMessage": appEn.messages.userProfile.newPwdShouldNotMatchCurrentPwd
        };

    case CHANGE_PASSWORD_SUCCESSFUL:
        Toast.show(appEn.messages.userProfile.pwdChangeSuccessful);
        return { "errorMessage": "" };

    default:
        return state;
    }
}

export function userProfileStrings(state = {}, action = {}) { //eslint-disable-line
    let appEn = Local.applicationStrings();
    return appEn.messages.userProfile;
}
