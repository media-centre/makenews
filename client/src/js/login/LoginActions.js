"use strict";
import AjaxClient from "../utils/AjaxClient";
import { createCategory } from "../config/actions/CategoryActions.js";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";

export function userLogin(history, userName, password) {
    return dispatch => {
        let ajax = AjaxClient.instance("/login");
        const headers = {
            "Accept": "application/json",
            "Content-type": "application/json"
        };
        const data = { "username": userName, "password": password };
        ajax.post(headers, data)
            .then(succesData => {
                dispatch(loginSuccess(history, succesData.userName));
            })
            .catch(errorData => {
                dispatch(loginFailed("Invalid user name or password"));
            });
    };
}

export function loginSuccess(history, userName) {
    return { "type": LOGIN_SUCCESS, history, userName };
}

export function loginFailed(responseMessage) {
    return { "type": LOGIN_FAILED, responseMessage };
}
