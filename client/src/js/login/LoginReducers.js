"use strict";

import { LOGIN_SUCCESS, LOGIN_FAILED } from "./LoginActions.js";

export function login(state = { "errorMessage": "" }, action = {}) {
    switch(action.type) {
    case LOGIN_FAILED:
        return {
            "errorMessage": action.responseMessage
        };
    case LOGIN_SUCCESS:
        localStorage.setItem("userInfo", action.userDetails);
        document.getElementById("temp-navigation").click();
        return {
            "errorMessage": "",
            "userName": action.userDetails
        };
    default:
        return state;
    }
}
