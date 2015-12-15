/*eslint no-unused-vars:0 */
"use strict";

import { LOGIN_SUCCESS, LOGIN_FAILED } from "./LoginActions.js";
import Locale from "../utils/Locale.js";

export function login(state = { "errorMessage": "" }, action = {}) {

    switch(action.type) {
    case LOGIN_FAILED:
        return {
            "errorMessage": action.responseMessage
        };
    case LOGIN_SUCCESS:
        localStorage.setItem("userInfo", action.userName);
        return {
            "errorMessage": "",
            "userName": action.userName
        };
    default:
        return state;

    }
}

export function loginPageLocale(state = {}, action = {}) {
    let appLocaleEn = Locale.applicationStrings();
    return appLocaleEn.messages.loginPage;
}
