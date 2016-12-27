/* eslint react/jsx-wrap-multilines:0*/
import { allCategories, categoryDetails, configurePageLocale } from "./config/reducers/ConfigReducer";
import { allFeeds } from "./surf/reducers/SurfReducer";
import { parkedFeeds } from "./park/reducers/ParkReducer";
import { login, loginPageLocale } from "./login/LoginReducers";
import { highlightedTab } from "./tabs/TabReducers";
import { combineReducers } from "redux";
import { mainHeaderLocale, mainHeaderStrings } from "./main/reducers/MainReducer";
import { parkCounter } from "./feeds/reducers/FeedReducer";
import { changePassword, userProfileStrings } from "./user/UserProfileReducer";
import { fetchedFeeds } from "./newsboard/reducers/DisplayFeedReducers";
import { currentHeaderTab } from "./header/HeaderReducer";
import { addUrlMessage } from "./config/reducers/AddUrlReducer";
import { configuredSources, hasMoreSourceResults, currentSourceTab, sourceResults, sourceSearchKeyword }
    from "./sourceConfig/reducers/SourceConfigurationReducers";
import { tokenExpiresTime } from "./config/reducers/FacebookTokenReducer";

const contentDiscoveryApp = combineReducers({
    login,
    allFeeds,
    parkedFeeds,
    loginPageLocale,
    allCategories,
    categoryDetails,
    configurePageLocale,
    mainHeaderLocale,
    mainHeaderStrings,
    highlightedTab,
    parkCounter,
    changePassword,
    userProfileStrings,
    configuredSources,
    hasMoreSourceResults,
    fetchedFeeds,
    addUrlMessage,
    sourceResults,
    sourceSearchKeyword,
    currentSourceTab,
    currentHeaderTab,
    tokenExpiresTime
});

export default contentDiscoveryApp;
