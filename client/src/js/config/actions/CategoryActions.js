/* eslint no-unused-vars:0 */

"use strict";
import CategoriesApplicationQueries from "../db/CategoriesApplicationQueries.js";
import CategoryDb from "../db/CategoryDb.js";
import CategoryDocument from "./CategoryDocuments.js";
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
        CategoriesApplicationQueries.addRssUrlConfiguration(categoryId, url).then(response => {
            dispatch(populateCategoryDetailsAsync(categoryId));
        });
    };
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

export function updateCategoryName(categoryId, categoryName = "", callback = ()=> {}) {
    return dispatch => {

        let isAlreadyExists = false, categoryDoc = null;
        CategoryDb.fetchAllCategoryDocuments().then(categories => {
            categories.some((category)=> {
                if(category._id !== categoryId && categoryName.toLowerCase() === category.name.toLowerCase()) {
                    isAlreadyExists = true;
                    callback({ "result": isAlreadyExists });
                    return true;
                }

                if(category._id === categoryId) {
                    categoryDoc = category;
                }
            });

            if(!isAlreadyExists && categoryDoc !== null) {
                categoryDoc.name = categoryName;
                CategoryDb.updateCategory(categoryDoc).then(response => {
                    callback({ "result": isAlreadyExists });
                });
            }

        }).catch(error => {
            callback({ "result": !found });
        });
    };
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