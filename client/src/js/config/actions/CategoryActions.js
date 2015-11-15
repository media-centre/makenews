/* eslint no-unused-vars:0 */

"use strict";
import CategoryDb from "../db/CategoryDb.js";
import RssFeedsConfigurationDb from "../db/RssFeedsConfigurationDb.js";

export const DISPLAY_CATEGORY = "DISPLAY_CATEGORY";

export function populateCategoryDetailsAsync(categoryName) {
    return dispatch => {
        CategoryDb.fetchDocumentByCategoryName(categoryName).then(categoryDocument => {
            dispatch(populateCategoryDetails(categoryDocument, categoryName));
        }).catch((error) => {
            dispatch(populateCategoryDetails(null, categoryName));
        });
    };
}

export function populateCategoryDetails(categoryDocument, categoryName) {
    return { "type": DISPLAY_CATEGORY, categoryDocument, categoryName };
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


