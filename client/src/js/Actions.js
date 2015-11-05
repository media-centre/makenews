"use strict";
import AjaxClient from "./utils/AjaxClient";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";

export function userLogin(userName, password) {
    return dispatch => {
        let ajax = new AjaxClient("/login");
        const headers = {
            "Accept": "application/json",
            "Content-type": "application/json"
        };
        const data = { "username": userName, "password": password };
        ajax.post(headers, data)
          .then(succesData => {
              dispatch(loginSuccess());
          })
          .catch(errorData => {
              dispatch(loginFailed("invalid user name or password"));
          });
    };
}

export function loginSuccess() {
    return { "type": LOGIN_SUCCESS };
}

export function loginFailed(responseMessage) {
    return { "type": LOGIN_FAILED, responseMessage };
}
