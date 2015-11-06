"use strict";
import AjaxClient from "./utils/AjaxClient";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";
export const CREATE_DB = "CREATE_DB";
export const ADD_RSS_FEEDS = "ADD_RSS_FEEDS";
export const DELETE_RSS_FEEDS = "DELETE_RSS_FEEDS";

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
              dispatch(createDatabase(succesData.userName));
              dispatch(loginSuccess(succesData.userName));
          })
          .catch(errorData => {
              dispatch(loginFailed("invalid user name or password"));
          });
    };
}

export function loginSuccess(userDetails) {
    return { "type": LOGIN_SUCCESS, userDetails };
}

export function loginFailed(responseMessage) {
    return { "type": LOGIN_FAILED, responseMessage };
}

export function createDatabase(userDetails) {
    return { "type": CREATE_DB, userDetails };
}

export function addNewFeed(newFeed) {
    return { "type": ADD_RSS_FEEDS, newFeed };
}
