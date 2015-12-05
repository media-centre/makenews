"use strict";

import { allCategories, categoryDetails } from "./config/reducers/ConfigReducer.js";
import { allFeeds } from "./surf/reducers/SurfReducer.js";
import { login, loginPageLocale } from "./login/LoginReducers.js";
import { combineReducers } from "redux";

const contentDiscoveryApp = combineReducers({
    login,
    allFeeds,
    loginPageLocale,
    allCategories,
    categoryDetails
});

export default contentDiscoveryApp;
