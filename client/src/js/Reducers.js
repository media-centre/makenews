"use strict";

import { allCategories, categoryDetails } from "./config/reducers/ConfigReducer.js";
import { login } from "./login/LoginReducers.js";
import { combineReducers } from "redux";

const contentDiscoveryApp = combineReducers({
    login,
    allCategories,
    categoryDetails
});

export default contentDiscoveryApp;
