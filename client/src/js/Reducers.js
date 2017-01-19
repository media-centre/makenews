/* eslint react/jsx-wrap-multilines:0*/
import { login, loginPageLocale } from "./login/LoginReducers";
import { combineReducers } from "redux";
import { mainHeaderStrings } from "./main/reducers/MainReducer";
import { changePassword, userProfileStrings } from "./user/UserProfileReducer";
import { currentHeaderTab } from "./header/HeaderReducer";
import { addUrlMessage } from "./config/reducers/AddUrlReducer";
import { fetchedFeeds, newsBoardCurrentSourceTab, selectedArticle } from "./newsboard/reducers/DisplayFeedReducers";
import { configuredSources, hasMoreSourceResults, currentSourceTab, sourceResults, searchInConfiguredSources } from "./sourceConfig/reducers/SourceConfigurationReducers";
import { tokenExpiresTime } from "./config/reducers/FacebookTokenReducer";
import { twitterTokenInfo } from "./config/reducers/TwitterTokenReducer";

const contentDiscoveryApp = combineReducers({
    login,
    loginPageLocale,
    mainHeaderStrings,
    changePassword,
    userProfileStrings,
    configuredSources,
    hasMoreSourceResults,
    fetchedFeeds,
    addUrlMessage,
    sourceResults,
    searchInConfiguredSources,
    currentSourceTab,
    currentHeaderTab,
    tokenExpiresTime,
    newsBoardCurrentSourceTab,
    twitterTokenInfo,
    selectedArticle
});

export default contentDiscoveryApp;
