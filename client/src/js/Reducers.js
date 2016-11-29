/* eslint react/jsx-wrap-multilines:0*/
import { allCategories, categoryDetails, configurePageLocale } from "./config/reducers/ConfigReducer";
import { allFeeds } from "./surf/reducers/SurfReducer";
import { parkedFeeds } from "./park/reducers/ParkReducer";
import { login, loginPageLocale } from "./login/LoginReducers";
import { highlightedTab } from "./tabs/TabReducers";
import { combineReducers } from "redux";
import { mainHeaderLocale } from "./main/reducers/MainReducer";
import { parkCounter } from "./feeds/reducers/FeedReducer";
import { changePassword, userProfileStrings } from "./user/UserProfileReducer";
import { configuredSources, facebookSources, facebookCurrentSourceTab } from "./config/reducers/FacebookReducer";

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
    parkCounter,
    changePassword,
    userProfileStrings,
    configuredSources,
    facebookSources,
    facebookCurrentSourceTab
});

export default contentDiscoveryApp;
