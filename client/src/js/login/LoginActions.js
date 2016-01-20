"use strict";
import AjaxClient from "../utils/AjaxClient";
import DbParameters from "../db/DbParameters.js";
import DbSession from "../db/DbSession.js";

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
                DbParameters.instance(succesData.userName, succesData.dbParameters.remoteDbUrl);
                DbSession.instance().then(session => { //eslint-disable-line no-unused-vars
                    dispatch(loginSuccess(succesData.userName));
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
