/* eslint no-unused-vars:0 */

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

export function addRssUrlAsync(categoryId, url) {
    return dispatch => {
        AjaxClient.instance("/rss-feeds").get({ "url": url }).then((ajaxResponse) => {
            addRssUrlDocument(dispatch, categoryId, url, STATUS_VALID );
        }).catch(() => {
            addRssUrlDocument(dispatch, categoryId, url, STATUS_INVALID);
        });
    };
}

function addRssUrlDocument(dispatch, categoryId, url, status) {
    CategoriesApplicationQueries.addRssUrlConfiguration(categoryId, url, status).then(response => {
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
                dispatchCreateCategory(name)
            });
        }
    };

    function dispatchCreateCategory(categoryName) {
        CategoryDb.createCategory(CategoryDocument.getNewCategoryDocument(categoryName)).then(response => {
            response.name = categoryName;
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
            Array(existingNamesSize).fill().map((_, i) => i).some((i)=> {
                generatedName = "Untitled Category " + (i+1);
                if(existingNames.indexOf(generatedName) === -1) {
                    resolve(generatedName);
                    return true;
                }
            });
        });
    });
}