"use strict";
import CategoriesApplicationQueries from "../db/CategoriesApplicationQueries.js";

export const DISPLAY_ALL_CATEGORIES = "DISPLAY_ALL_CATEGORIES";

export function displayAllCategoriesAsync() {
    return dispatch => {
        CategoriesApplicationQueries.fetchAllCategories().then((categories) => {
            dispatch(dispalyAllCategories(categories));
        });
    };
}

export function dispalyAllCategories(categories) {
    return { "type": DISPLAY_ALL_CATEGORIES, categories };
}
