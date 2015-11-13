"use strict";
import ConfigDbInterface from "./config/ConfigDbInterface.js";
import CategoryDbInterface from "./config/CategoryDbInterface.js";
import DbParameters from "./db/config/DbParameters.js";
import { LOGIN_FAILED, LOGIN_SUCCESS, CREATE_LOCAL_DB, ADD_RSS_FEEDS, DELETE_RSS_FEEDS } from "./Actions";
import { combineReducers } from "redux";
import { List } from "immutable";
import DbSession from "./db/DbSession.js";
import PouchDB from "pouchdb";


function login(state = { "errorMessage": "" }, action = {}) {
    switch(action.type) {
    case LOGIN_FAILED:
        return {
            "errorMessage": action.responseMessage
        };
    case LOGIN_SUCCESS:
        DbParameters.setLocalDb(action.userDetails);
        DbSession.sync();
        //DbParameters.setLocalDb(action.userName);
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
            CategoryDbInterface.instance().addCategory("sports");
            ConfigDbInterface.instance("sports").addRssFeed(action.rssFeed);
            CategoryDbInterface.instance().addCategory("politics");
            ConfigDbInterface.instance("plitics").addRssFeed(action.rssFeed);
            return source;
            //return source.push(action.rssFeed, true);
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
