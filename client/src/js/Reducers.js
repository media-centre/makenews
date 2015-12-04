"use strict";

import { allCategories, categoryDetails } from "./config/reducers/ConfigReducer.js";
import { allFeeds } from "./surf/reducers/SurfReducer.js";
import { login } from "./login/LoginReducers.js";
import { combineReducers } from "redux";

const contentDiscoveryApp = combineReducers({
    login,
    allFeeds,
    allCategories,
    categoryDetails
});

export default contentDiscoveryApp;
