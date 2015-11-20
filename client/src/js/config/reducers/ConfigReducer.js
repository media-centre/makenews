/* eslint no-underscore-dangle:0 new-cap:0*/
"use strict";
import { DISPLAY_ALL_CATEGORIES } from "../actions/AllCategoriesActions.js";
import { DISPLAY_CATEGORY } from "../actions/CategoryActions.js";
import CategoryDb from "../db/CategoryDb.js";
import { List } from "immutable";

export const DEFAULT_CATEGORY = "Default Category";

export function allCategories(state = { "categories": List([DEFAULT_CATEGORY]) }, action = {}) {
    switch(action.type) {
    case DISPLAY_ALL_CATEGORIES:
        let newList = List(action.categories);
        const NEGATIVE_INDEX = -1;
        if(newList.indexOf(DEFAULT_CATEGORY) === NEGATIVE_INDEX) {
            newList = newList.push({ "_id:": "", "name": DEFAULT_CATEGORY });
        }
        return { "categories": newList };
    default:
        return state;
    }
}

export function categoryDetails(state = getCategoryState(null), action = {}) {
    switch(action.type) {
    case DISPLAY_CATEGORY:
        //return getCategoryState(action.sourceUrlsObj, action.categoryId);
        return getCategoryState(action.sourceUrlsObj);
    default:
        return state;
    }
}

function getCategoryState(sourceUrlsObj = null, categoryId = null) {
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
    } else if(sourceUrlsObj.facebook) {
        categorySourceConfig.sources.facebook.details = sourceUrlsObj.facebook;
    } else if(sourceUrlsObj.twitter) {
        categorySourceConfig.sources.twitter.details = sourceUrlsObj.twitter;
    }

    return categorySourceConfig;
}
