/* eslint no-unused-vars:0 */

"use strict";
import CategoriesApplicationQueries from "../db/CategoriesApplicationQueries.js";

export const DISPLAY_CATEGORY = "DISPLAY_CATEGORY";

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


