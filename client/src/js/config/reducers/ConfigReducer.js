/* eslint no-underscore-dangle:0 new-cap:0*/
"use strict";
import { DISPLAY_ALL_CATEGORIES } from "../actions/AllCategoriesActions.js";
import { DISPLAY_CATEGORY } from "../actions/CategoryActions.js";
import CategoryDb from "../db/CategoryDb.js";
import { List } from "immutable";

export const DEFAULT_CATEGORY = "Default Category"

export function allCategories(state = { "categories": List([DEFAULT_CATEGORY]) }, action = {}) {
    switch(action.type) {
    case DISPLAY_ALL_CATEGORIES:
        let newList = List(action.categories);
        const NEGATIVE_INDEX = -1;
        if(newList.indexOf(DEFAULT_CATEGORY) === NEGATIVE_INDEX) {
            newList = newList.push(DEFAULT_CATEGORY);
        }
        return { "categories": newList };
    default:
        return state;
    }
}

export function categoryDetails(state = getCategoryState(), action = {}) {
    switch(action.type) {
    case DISPLAY_CATEGORY:
        return getCategoryState(action.categoryDocument, action.categoryName);

    default:
        return state;
    }
}

function getCategoryState(document = null, categoryNameParameter = null) {
    let categoryName = categoryNameParameter;
    if(!categoryName) {
        categoryName = DEFAULT_CATEGORY;
    }

    let categoryDocument = document;
    if(!categoryDocument) {
        categoryDocument = CategoryDb.newCategoryDocumentByName(categoryName);
    }
    let rssSources = {};
    rssSources.name = "RSS";
    if(categoryDocument.rssFeeds) {
        rssSources.details = Object.keys(categoryDocument.rssFeeds);
    } else {
        rssSources.details = [];
    }

    let faceBookSources = {};
    faceBookSources.name = "Facebook";
    if(categoryDocument.faceBookFeeds) {
        faceBookSources.details = Object.keys(categoryDocument.faceBookFeeds);
    } else {
        faceBookSources.details = [];
    }

    let twitterSources = {};
    twitterSources.name = "Twitter";
    if(categoryDocument.twitterFeeds) {
        twitterSources.details = Object.keys(categoryDocument.twitterFeeds);
    } else {
        twitterSources.details = [];
    }

    let categoryConfig = { "sources": [] };
    categoryConfig.sources.push(rssSources);
    categoryConfig.sources.push(faceBookSources);
    categoryConfig.sources.push(twitterSources);

    categoryConfig.categoryName = categoryDocument.name;

    return categoryConfig;
}
