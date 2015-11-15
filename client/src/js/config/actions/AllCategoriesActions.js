"use strict";
import AllCategoryDb from "../db/AllCategoriesDb.js";

export const DISPLAY_ALL_CATEGORIES = "DISPLAY_ALL_CATEGORIES";

export function displayAllCategoriesAsync() {
    return dispatch => {
        AllCategoryDb.fetchAllCategories().then((categories) => {
            let categoryIds = Object.keys(categories).map(key => {
                return key;
            });
            dispatch(dispalyAllCategories(categoryIds));
        });
    };
}

export function dispalyAllCategories(categories) {
    return { "type": DISPLAY_ALL_CATEGORIES, categories };
}
