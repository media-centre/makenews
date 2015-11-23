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

export function createCategory(categoryName = DEFAULT_CATEGORY, callback = ()=> {}) {
    return dispatch => {
        CategoryDb.createCategory(CategoryDocument.getNewCategoryDocument(categoryName)).then(success => {
            callback(success);
        }).catch(error => {
            callback(error);
        });
    };
}
