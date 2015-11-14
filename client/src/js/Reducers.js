"use strict";
import ConfigDbInterface from "./config/ConfigDbInterface.js";
import CategoryDbInterface from "./config/CategoryDbInterface.js";
import DbParameters from "./db/config/DbParameters.js";
import { LOGIN_FAILED, LOGIN_SUCCESS, CREATE_LOCAL_DB, ADD_RSS_FEEDS, DELETE_RSS_FEEDS } from "./Actions";
import { combineReducers } from "redux";
import { List } from "immutable";
import DbSession from "./db/DbSession.js";
import PouchDB from "pouchdb";
import AllCategory from "./config.new/AllCategory.js";
import Category from "./config.new/Category.js";
import RssFeedsConfiguration from "./config.new/RssFeedsConfiguration.js";


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
    configureRssFeedSource
});

export default contentDiscoveryApp;
