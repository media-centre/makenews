/* eslint no-underscore-dangle:0 new-cap:0*/
"use strict";
import { DISPLAY_ALL_CATEGORIES } from "../actions/AllCategoriesActions.js";
import { DISPLAY_CATEGORY } from "../actions/CategoryActions.js";
import { List } from "immutable";


export function allCategories(state = { "categories": List([]) }, action = {}) {
    switch(action.type) {
    case DISPLAY_ALL_CATEGORIES:
        return { "categories": List(action.categories) };
    default:
        return state;
    }
}

export function categoryDetails(state = getCategoryState(null), action = {}) {
    switch(action.type) {
    case DISPLAY_CATEGORY:
        return getCategoryState(action.sourceUrlsObj);
    default:
        return state;
    }
}

function getCategoryState(sourceUrlsObj = null) {
    let categorySourceConfig = {
        "sources": {
            "rss": { "name": "RSS", "details": [] },
            "facebook": { "name": "Facebook", "details": [] },
            "twitter": { "name": "Twitter", "details": [] }
        }
    };
    if(sourceUrlsObj === null) {
        return categorySourceConfig;
    }

    if(sourceUrlsObj.rss) {
        categorySourceConfig.sources.rss.details = sourceUrlsObj.rss;
    }
    if(sourceUrlsObj.facebook) {
        categorySourceConfig.sources.facebook.details = sourceUrlsObj.facebook;
    }
    if(sourceUrlsObj.twitter) {
        categorySourceConfig.sources.twitter.details = sourceUrlsObj.twitter;
    }
    return categorySourceConfig;
}
