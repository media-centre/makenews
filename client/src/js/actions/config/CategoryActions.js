"use strict";
import Category from "../../config/Category.js";
import RssFeedsConfiguration from "../../config/RssFeedsConfiguration.js";

export const DISPLAY_CATEGORY = "DISPLAY_CATEGORY";

export function populateCategoryDetailsAsync(categoryName) {
    return dispatch => {
        Category.fetchDocumentByCategoryName(categoryName).then(categoryDocument => {
            dispatch(populateCategoryDetails(categoryDocument));
        }).catch((error) => {
            dispatch(populateCategoryDetails(null));
        });
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
            });
        });
    };
}
