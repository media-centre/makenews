"use strict";
import AllCategory from "../../config/AllCategory.js";

export const DISPLAY_ALL_CATEGORIES = "DISPLAY_ALL_CATEGORIES";

export function displayAllCategoriesAsync() {
    return dispatch => {
        AllCategory.fetchAllCategories().then(categories => {
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