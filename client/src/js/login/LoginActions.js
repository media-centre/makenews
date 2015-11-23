/* eslint no-unused-vars:0 no-unused-expressions:0*/
"use strict";
import AjaxClient from "../utils/AjaxClient";
import { createCategory } from "../config/actions/CategoryActions.js";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";

export function userLogin(userName, password) {
    return dispatch => {
        let ajax = AjaxClient.instance("/login");
        const headers = {
            "Accept": "application/json",
            "Content-type": "application/json"
        };
        const data = { "username": userName, "password": password };
        ajax.post(headers, data)
            .then(succesData => {
                dispatch(loginSuccess(succesData.userName));
                dispatch(createCategory("Default Category"));
            })
            .catch(errorData => {
                dispatch(loginFailed("Invalid user name or password"));
            });
    };
}

export function loginSuccess(userDetails) {
    return { "type": LOGIN_SUCCESS, userDetails };
}

export function loginFailed(responseMessage) {
    return { "type": LOGIN_FAILED, responseMessage };
}
