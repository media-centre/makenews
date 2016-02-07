"use strict";
import CategoryDb from "../db/CategoryDb.js";

export const DISPLAY_ALL_CATEGORIES = "DISPLAY_ALL_CATEGORIES";

export function displayAllCategoriesAsync() {
    return dispatch => {
        CategoryDb.fetchAllCategories().then((categories) => {
            dispatch(displayAllCategories(categories));
        });
    };
}

export function displayAllCategories(categories) {
    return { "type": DISPLAY_ALL_CATEGORIES, categories };
}
