"use strict";
import AjaxClient from "../utils/AjaxClient";
import DbSession from "../db/DbSession.js";
import AppSessionStorage from "../utils/AppSessionStorage.js";

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
            .then(successData => {
                let appSessionStorage = new AppSessionStorage();
                appSessionStorage.setValue(AppSessionStorage.KEYS.USERNAME, successData.userName);
                appSessionStorage.setValue(AppSessionStorage.KEYS.REMOTEDBURL, successData.dbParameters.remoteDbUrl);
                DbSession.instance().then(session => { //eslint-disable-line no-unused-vars
                    dispatch(loginSuccess(successData.userName));
                    history.push("/surf");
                });
            })
            .catch(errorData => { //eslint-disable-line no-unused-vars
                dispatch(loginFailed("Invalid user name or password"));
            });
    };
}

export function loginSuccess(userName) {
    return { "type": LOGIN_SUCCESS, userName };
}

export function loginFailed(responseMessage) {
    return { "type": LOGIN_FAILED, responseMessage };
}
