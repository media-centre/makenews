"use strict";
import { LOGIN_FAILED, LOGIN_SUCCESS } from "./Actions";
import { combineReducers } from "redux";

function login(state = { "errorMessage": "" }, action = {}) {
    switch(action.type) {
    case LOGIN_FAILED:
        return {
            "errorMessage": action.responseMessage
        };
    case LOGIN_SUCCESS:
        return {
            "errorMessage": "successful"
        };
    default:
        return state;
    }
}

const contentDiscoveryApp = combineReducers({
    login
});

export default contentDiscoveryApp;
