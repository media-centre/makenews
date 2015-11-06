"use strict";
import { LOGIN_FAILED, LOGIN_SUCCESS, CREATE_DB, ADD_RSS_FEEDS, DELETE_RSS_FEEDS } from "./Actions";
import { combineReducers } from "redux";
import LocalDb from "./pouch/LocalDb.js";
import { List, Map } from "immutable";


function login(state = { "errorMessage": "" }, action = {}) {
    switch(action.type) {
    case LOGIN_FAILED:
        return {
            "errorMessage": action.responseMessage
        };
    case LOGIN_SUCCESS:
        return {
            "errorMessage": "successful",
            "userName": action.userName
        };
    default:
        return state;
    }
}

function database(state = { "localDb": null }, action = {}) {
    switch(action.type) {
        case CREATE_DB:
            let db = new LocalDb(action.userDetails);
            return {
                "localDb" : db
            };
        default:
            return state;
    }
}

function configSources(sources = Map({ "webFeeds": Map() }), action = {}) {
    switch(action.type) {
        case ADD_RSS_FEEDS:
            let rssFeeds = sources.get("webFeeds");
            return sources.set(action.rssFeed, true);
        case DELETE_RSS_FEEDS:
            return sources.remove(action.rssFeed);
        default:
            return sources;
    }

}

const contentDiscoveryApp = combineReducers({
    login,
    database,
    configSources
});

export default contentDiscoveryApp;
