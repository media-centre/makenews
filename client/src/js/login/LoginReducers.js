"use strict";
import DbParameters from "../db/config/DbParameters.js";
import DbSession from "../db/DbSession.js";
import { LOGIN_SUCCESS, LOGIN_FAILED } from "./LoginActions.js";

export function login(state = { "errorMessage": "" }, action = {}) {
    switch(action.type) {
    case LOGIN_FAILED:
        console.log("Test");
        return {
            "errorMessage": action.responseMessage
        };
    case LOGIN_SUCCESS:
        DbParameters.instance().setLocalDb(action.userDetails);
        DbSession.sync();
        localStorage.setItem("userInfo", "loggedIn");
        document.getElementById("temp-navigation").click();
        return {
            "errorMessage": "",
            "userName": action.userDetails
        };
    default:
        return state;
    }
}
