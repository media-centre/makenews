/* eslint no-unused-vars:0*/

"use strict";
import CategoriesApplicationQueries from "../db/CategoriesApplicationQueries.js";
import CategoryDb from "../db/CategoryDb.js";
import { CategoryDocument, STATUS_INVALID, STATUS_VALID } from "./CategoryDocuments.js";
import AjaxClient from "../../utils/AjaxClient";
import { displayAllCategoriesAsync } from "./AllCategoriesActions.js";

export const DISPLAY_CATEGORY = "DISPLAY_CATEGORY";
export const DEFAULT_CATEGORY = "Default Category";

export function populateCategoryDetailsAsync(categoryId) {
    return dispatch => {
        CategoriesApplicationQueries.fetchSourceUrlsObj(categoryId).then(sourceUrlsObj => {
            dispatch(populateCategoryDetails(sourceUrlsObj));
        }).catch((error) => {
            dispatch(populateCategoryDetails(null));
        });
    };
}

export function populateCategoryDetails(sourceUrlsObj) {
    return { "type": DISPLAY_CATEGORY, sourceUrlsObj };
}

export function addRssUrlAsync(categoryId, url, callback) {
    return dispatch => {
        AjaxClient.instance("/rss-feeds").get({ "url": url }).then((responseFeed) => {
            addRssUrlDocument(dispatch, categoryId, url, STATUS_VALID, responseFeed.items);
            callback(STATUS_VALID);
        }).catch(() => {
            addRssUrlDocument(dispatch, categoryId, url, STATUS_INVALID);
            callback(STATUS_INVALID);
        });
    };
}

function addRssUrlDocument(dispatch, categoryId, url, status, responseFeed) {
    CategoriesApplicationQueries.addRssUrlConfiguration(categoryId, url, status, responseFeed).then(response => {
        dispatch(populateCategoryDetailsAsync(categoryId));
    });
}

export function createDefaultCategory(categoryName = DEFAULT_CATEGORY) {
    return dispatch => {
        let newCategoryDocument = CategoryDocument.getNewCategoryDocument(categoryName);
        CategoryDb.createCategoryIfNotExists(newCategoryDocument).then(success => {
            dispatch(displayAllCategoriesAsync());
        }).catch(error => {
            dispatch(displayAllCategoriesAsync());
        });
    };
}

export function createCategory(categoryName = "", callback = ()=> {}) {
    return dispatch => {
        if(categoryName) {
            dispatchCreateCategory(categoryName);
        } else {
            generateCategoryName().then((name) => {
                dispatchCreateCategory(name);
            });
        }
    };

    function dispatchCreateCategory(categoryName1) {
        CategoryDb.createCategory(CategoryDocument.getNewCategoryDocument(categoryName1)).then(response => {
            response.name = categoryName1;
            callback(response);
        }).catch(error => {
            callback(error);
        });
    }
}

export function updateCategoryName(categoryName = "", categoryId = "", callback = ()=> {}) {
    return dispatch => {

        CategoryDb.isCategoryExists(categoryName, categoryId).then((response)=> {
            if(response.status) {
                return callback({ "status": false });
            }
            updateCategoryNameHelper(categoryName, categoryId).then((updateResponse)=> {
                callback(updateResponse);
            }).catch((error)=> {
                callback(error);
            });
        }).catch((error)=> {
            callback(error);
        });
    };
}

function updateCategoryNameHelper(categoryName, categoryId) {
    return new Promise((resolve, reject) => {
        CategoryDb.getCategoryById(categoryId).then((response)=> {
            if (response.status) {

                let categoryDoc = response.category;
                categoryDoc.name = categoryName;

                CategoryDb.updateCategory(categoryDoc).then(()=> {
                    resolve({ "status": true });
                }).catch((error)=> {
                    reject(error);
                });
            } else {
                resolve(response);
            }
        }).catch((error)=> {
            reject(error);
        });
    });
}

function generateCategoryName() {
    return new Promise((resolve, reject) => {
        let generatedName = "";
        CategoryDb.fetchAllCategoryDocuments().then(categories => {
            let existingNames = categories.map(category => category.name);
            let existingNamesSize = existingNames.length + 1;
            Array(existingNamesSize).fill().map((value, index) => index).some((index)=> {
                generatedName = "Untitled Category " + (index + 1);
                let NEGATIVE_INDEX = -1;
                if(existingNames.indexOf(generatedName) === NEGATIVE_INDEX) {
                    resolve(generatedName);
                    return true;
                }
            });
        });
    });
}
