"use strict";

import { allCategories, categoryDetails } from "./reducers/ConfigReducer.js";
import { login } from "./reducers/LoginReducers.js";
import { combineReducers } from "redux";

const contentDiscoveryApp = combineReducers({
    login,
    allCategories,
    categoryDetails
});

export default contentDiscoveryApp;