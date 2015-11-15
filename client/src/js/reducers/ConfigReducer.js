"use strict";
import { DISPLAY_ALL_CATEGORIES } from "../actions/config/AllCategoriesActions.js";
import { DISPLAY_CATEGORY } from "../actions/config/CategoryActions.js";
import Category from "../config/Category.js";

export function allCategories(state = {"categories": []}, action = {}) {
    switch(action.type) {
        case DISPLAY_ALL_CATEGORIES:
            return {"categories": action.categories};
        default:
            return state;
    }
}

export function categoryDetails(state = getCategoryState(), action = {}) {
    switch(action.type) {
        case DISPLAY_CATEGORY:
            return getCategoryState(action.categoryDocument);

        default:
            return state;
    }
}

function getCategoryState(categoryDocument = null) {
    if(!categoryDocument) {
        categoryDocument = Category.newDocument();
    }
    let rssSources = {};
    rssSources.name = "RSS";
    if(categoryDocument.rssFeeds) {
        rssSources.details = Object.keys(categoryDocument.rssFeeds);
    }else{
        rssSources.details = [];
    }

    let faceBookSources = {};
    faceBookSources.name = "Facebook";
    if(categoryDocument.faceBookFeeds) {
        faceBookSources.details = Object.keys(categoryDocument.faceBookFeeds);
    }else{
        faceBookSources.details = [];
    }

    let twitterSources = {};
    twitterSources.name = "Twitter";
    if(categoryDocument.twitterFeeds){
        twitterSources.details = Object.keys(categoryDocument.twitterFeeds);
    }else{
        twitterSources.details = [];
    }

    let categoryConfig = {"sources": []};
    categoryConfig.sources.push(rssSources);
    categoryConfig.sources.push(faceBookSources);
    categoryConfig.sources.push(twitterSources);

    categoryConfig.categoryName = categoryDocument._id;

    return categoryConfig;
}