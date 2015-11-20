/* eslint no-unused-vars:0 */

"use strict";
import CategoryDb from "../db/CategoryDb.js";
import CategoriesApplicationQueries from "../db/CategoriesApplicationQueries.js";
import RssFeedsConfigurationDb from "../db/RssFeedsConfigurationDb.js";

export const DISPLAY_CATEGORY = "DISPLAY_CATEGORY";

export function populateCategoryDetailsAsync(categoryId) {
    return dispatch => {
        CategoriesApplicationQueries.fetchSourceUrlsObj(categoryId).then(sourceUrlsObj => {
            dispatch(populateCategoryDetails(sourceUrlsObj, categoryId));
        }).catch((error) => {
            dispatch(populateCategoryDetails(null, categoryId));
        });
    };
}

export function populateCategoryDetails(sourceUrlsObj, categoryId) {
    return { "type": DISPLAY_CATEGORY, sourceUrlsObj, categoryId };
}

export function addRssUrlAsync(categoryName, url) {
    return dispatch => {
        RssFeedsConfigurationDb.addRssFeed(categoryName, url).then(response => {
            CategoryDb.fetchDocumentByCategoryName(categoryName).then(document => {
                dispatch(populateCategoryDetails(document));
            });
        });
    };

}


