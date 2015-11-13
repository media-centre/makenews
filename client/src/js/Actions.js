"use strict";
import AjaxClient from "./utils/AjaxClient";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";
export const ADD_RSS_FEEDS = "ADD_RSS_FEEDS";
export const ADD_NEW_CATEGORY = "ADD_NEW_CATEGORY";
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
              console.log(succesData);
              dispatch(loginSuccess(succesData.userName));
              dispatch(addNewRssFeed("wwww.sdfsadf.com"));
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

export function addNewRssFeed(rssFeed) {
    return { "type": ADD_RSS_FEEDS, rssFeed };
}

export function addCategoryTypes(categoryDetails) {
    return { "type": ADD_NEW_CATEGORY, categoryDetails };
}
