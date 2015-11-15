//"use strict";
//import AjaxClient from "./utils/AjaxClient";
//import AllCategory from "./config/AllCategory.js";
//import Category from "./config/Category.js";
//import RssFeedsConfiguration from "./config/RssFeedsConfiguration.js";
//import DbSession from "./db/DbSession.js";
//
//export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
//export const LOGIN_FAILED = "LOGIN_FAILED";
//export const ADD_RSS_FEEDS = "ADD_RSS_FEEDS";
//export const DISPLAY_ALL_CATEGORIES = "DISPLAY_ALL_CATEGORIES";
//export const DISPLAY_CATEGORY = "DISPLAY_CATEGORY";
//
//export function userLogin(userName, password) {
//    return dispatch => {
//        let ajax = new AjaxClient("/login");
//        const headers = {
//            "Accept": "application/json",
//            "Content-type": "application/json"
//        };
//        const data = { "username": userName, "password": password };
//        ajax.post(headers, data)
//          .then(succesData => {
//              dispatch(loginSuccess(succesData.userName));
//          })
//          .catch(errorData => {
//              dispatch(loginFailed("invalid user name or password"));
//          });
//    };
//}
//
//export function loginSuccess(userDetails) {
//    return { "type": LOGIN_SUCCESS, userDetails };
//}
//
//export function loginFailed(responseMessage) {
//    return { "type": LOGIN_FAILED, responseMessage };
//}
//
//export function addNewRssFeed(rssFeed) {
//    return { "type": ADD_RSS_FEEDS, rssFeed };
//}
//
//export function displayAllCategoriesAsync() {
//    return dispatch => {
//        AllCategory.fetchAllCategories().then(categories => {
//            let categoryIds = Object.keys(categories).map(function(key) { return key });
//            dispatch(dispalyAllCategories(categoryIds));
//        });
//    };
//}
//
//export function dispalyAllCategories(categories) {
//    return { "type": DISPLAY_ALL_CATEGORIES, categories };
//}
//
//
//export function populateCategoryDetailsAsync(categoryName) {
//    return dispatch => {
//        Category.fetchDocumentByCategoryName(categoryName).then(categoryDocument => {
//            console.log(categoryDocument);
//            dispatch(populateCategoryDetails(categoryDocument));
//        }).catch(function (error) {
//            dispatch(populateCategoryDetails(null));
//        });
//    };
//}
//
//export function populateCategoryDetails(categoryDocument) {
//    return { "type": DISPLAY_CATEGORY, categoryDocument };
//}
//
//export function addRssUrlAsync(categoryId, url) {
//    return dispatch => {
//        RssFeedsConfiguration.addRssFeed(categoryId, url).then(response => {
//            Category.fetchDocumentByCategoryId(categoryId).then(document => {
//                dispatch(populateCategoryDetails(document));
//            });
//        });
//    };
//}
