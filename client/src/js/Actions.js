"use strict";
import AjaxClient from "./utils/AjaxClient";
import AllCategory from "./config/AllCategory.js";
import Category from "./config/Category.js";
import RssFeedsConfiguration from "./config/RssFeedsConfiguration.js";
import DbSession from "./db/DbSession.js";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";
export const ADD_RSS_FEEDS = "ADD_RSS_FEEDS";
export const DISPLAY_ALL_CATEGORIES = "DISPLAY_ALL_CATEGORIES";
export const DISPLAY_CATEGORY = "DISPLAY_CATEGORY";

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
              //dispatch(addNewRssFeed("wwww.sdfsadf.com"));
                dispatch(dispalyAllCategoriesAsync());
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

export function dispalyAllCategoriesAsync() {
    return dispatch => {
        DbSession.instance().get(AllCategory.documentType()).then(document => {
            if(!document.categories) {

            }
            let categories = Object.keys(document.categories).map(function(key) { return key });
            console.log(categories);
            //let categories = ["Time Line", "Sports", "Politics"];
            dispatch(dispalyAllCategories(categories));
        });

    };
}

export function dispalyAllCategories(categories) {
    return { "type": DISPLAY_ALL_CATEGORIES, categories };
}


export function populateCategoryDetailsAsync(categoryName) {
    return dispatch => {
        Category.fetchDocumentByCategoryName(categoryName).then(categoryDocument => {
            console.log(categoryDocument);
            dispatch(populateCategoryDetails(categoryDocument));
        }).catch(function (error) {
            dispatch(populateCategoryDetails(null));
        });
        //
        //DbSession.instance().get(Category.getId(categoryName)).then(categoryDocument => {
        //    console.log(categoryDocument);
        //    dispatch(populateCategoryDetails(categoryDocument));
        //}).catch(function (error) {
        //    dispatch(populateCategoryDetails(null));
        //});
    };
}

export function populateCategoryDetails(categoryDocument) {
    return { "type": DISPLAY_CATEGORY, categoryDocument };
}

export function addRssUrlAsync(categoryId, url) {
    return dispatch => {
        RssFeedsConfiguration.addRssFeed(categoryId, url).then(response => {
            Category.fetchDocumentByCategoryId(categoryId).then(document => {
                dispatch(populateCategoryDetails(document));
            }).catch(error => {

            });
        });
        //Category.fetchDocumentByCategoryId(categoryId).then(categoryDocument => {
        //    console.log(categoryDocument);
        //    categoryDocument.rssFeeds[url] = true;
        //
        //    Category.saveDocument(categoryDocument).then(response => {
        //        dispatch(populateCategoryDetails(categoryDocument));
        //    });
        //});
    };
}
