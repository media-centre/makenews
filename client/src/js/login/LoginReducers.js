/*eslint no-unused-vars:0 */


import { LOGIN_SUCCESS, LOGIN_FAILED } from "./LoginActions";
import Locale from "../utils/Locale";

export function login(state = { "errorMessage": "" }, action = {}) {

    switch(action.type) {
    case LOGIN_FAILED:
        return {
            "errorMessage": action.responseMessage
        };
    case LOGIN_SUCCESS:
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
