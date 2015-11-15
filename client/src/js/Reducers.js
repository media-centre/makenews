"use strict";
import DbParameters from "./db/config/DbParameters.js";
import { LOGIN_FAILED, LOGIN_SUCCESS, CREATE_LOCAL_DB, ADD_RSS_FEEDS, DELETE_RSS_FEEDS, DISPLAY_ALL_CATEGORIES, DISPLAY_CATEGORY } from "./Actions";
import { combineReducers } from "redux";
import { List } from "immutable";
import DbSession from "./db/DbSession.js";
import PouchDB from "pouchdb";
import AllCategory from "./config/AllCategory.js";
import Category from "./config/Category.js";
import RssFeedsConfiguration from "./config/RssFeedsConfiguration.js";


function login(state = { "errorMessage": "" }, action = {}) {
    switch(action.type) {
    case LOGIN_FAILED:
        return {
            "errorMessage": action.responseMessage
        };
    case LOGIN_SUCCESS:
        DbParameters.setLocalDb(action.userDetails);
        DbSession.sync();
        localStorage.setItem("userInfo", "loggedIn");
        document.getElementById("temp-navigation").click();
        return {
            "errorMessage": "successful",
            "userName": action.userDetails
        };
    default:
        return state;
    }
}

function allCategories(state = [], action = {}) {
    switch(action.type) {
        case DISPLAY_ALL_CATEGORIES:
            return {"categories": action.categories};
        default:
            return state;
    }
}

function categoryDetails(state = getCategoryState(), action = {}) {
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

function configureRssFeedSource(source = List(), action = {}) {
    switch(action.type) {
        case ADD_RSS_FEEDS:
            RssFeedsConfiguration.addRssFeed("SundayTimes", "www.thoughtworks.com")
            return source;
        case DELETE_RSS_FEEDS:
            return source.deletein(action.rssFeed);
        default:
            return source;
    }

}

const contentDiscoveryApp = combineReducers({
    login,
    allCategories,
    categoryDetails,
    configureRssFeedSource
});

export default contentDiscoveryApp;
