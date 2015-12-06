"use strict";

import { allCategories, categoryDetails, configurePageLocale } from "./config/reducers/ConfigReducer.js";
import { allFeeds } from "./surf/reducers/SurfReducer.js";
import { login, loginPageLocale } from "./login/LoginReducers.js";
import { combineReducers } from "redux";
import { mainHeaderLocale } from "./main/reducers/MainReducer.js";

const contentDiscoveryApp = combineReducers({
    login,
    allFeeds,
    loginPageLocale,
    allCategories,
    categoryDetails,
    configurePageLocale,
    mainHeaderLocale
});

export default contentDiscoveryApp;
