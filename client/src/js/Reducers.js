"use strict";

import { allCategories, categoryDetails, configurePageLocale } from "./config/reducers/ConfigReducer.js";
import { allFeeds } from "./surf/reducers/SurfReducer.js";
import { parkedFeeds } from "./park/reducers/ParkReducer.js";
import { login, loginPageLocale } from "./login/LoginReducers.js";
import { highlightedTab } from "./tabs/TabReducers.js";
import { combineReducers } from "redux";
import { mainHeaderLocale } from "./main/reducers/MainReducer.js";
import { parkCounter } from "./feeds/reducers/FeedReducer.js";

const contentDiscoveryApp = combineReducers({
    login,
    allFeeds,
    parkedFeeds,
    loginPageLocale,
    allCategories,
    categoryDetails,
    configurePageLocale,
    mainHeaderLocale,
    highlightedTab,
    parkCounter
});

export default contentDiscoveryApp;
