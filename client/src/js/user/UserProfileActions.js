"use strict";

import AjaxClient from "../utils/AjaxClient.js";
import StringUtil from "../../../../common/src/util/StringUtil.js";
export const CHANGE_PASSWORD_SUCCESSFUL = "CHANGE_PASSWORD_SUCCESSFUL";
export const INCORRECT_USER_CREDENTIALS = "INCORRECT_USER_CREDENTIALS";
export const PASSWORD_UPDATION_FAILED = "PASSWORD_UPDATION_FAILED";
export const NEW_PWD_CONFIRM_PWD_MISMATCH = "NEW_PWD_CONFIRM_PWD_MISMATCH";
export const NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD = "NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD";

export default class UserProfileActions {
    changePassword(userName, currentPassword, newPassword) {
        if(StringUtil.isEmptyString(userName)) {
            throw new Error("user name never be empty");
        }

        return dispatch => {
            let url = "/change_password";
            let data = this._changePasswordData(userName, currentPassword, newPassword);
            AjaxClient.instance(url).post(this._headers(), data).then(response => { //eslint-disable-line
                dispatch(this.changePasswordSuccessful());
            }).catch(error => {
                if(error.message === "Incorrect user credentials") {
                    dispatch(this.incorrectUserCredentials());
                } else {
                    dispatch(this.passwordUpdationFailed());
                }
            });
        };
    }

    static instance() {
        return new UserProfileActions();
    }

    newPwdConfirmPwdMismatch() {
        return dispatch => {
            dispatch({ "type": NEW_PWD_CONFIRM_PWD_MISMATCH });
        };
    }

    newPasswordShouldNotMatchCurrentPwd() {
        return dispatch => {
            dispatch({ "type": NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD });
        };
    }

    changePasswordSuccessful() {
        return { "type": CHANGE_PASSWORD_SUCCESSFUL };
    }

    incorrectUserCredentials() {
        return { "type": INCORRECT_USER_CREDENTIALS };
    }

    passwordUpdationFailed() {
        return { "type": PASSWORD_UPDATION_FAILED };
    }

    _headers() {
        return {
            "Accept": "application/json",
            "Content-type": "application/json"
        };
    }

    _changePasswordData(userName, currentPassword, newPassword) {
        return { "userName": userName, "currentPassword": currentPassword, "newPassword": newPassword };
    }
}
