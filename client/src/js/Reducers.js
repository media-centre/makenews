import { login, loginPageLocale } from "./login/LoginReducers";
import { combineReducers } from "redux";
import { mainHeaderStrings } from "./main/reducers/MainReducer";
import { changePassword, userProfileStrings } from "./user/UserProfileReducer";
import { currentHeaderTab } from "./header/HeaderReducer";
import { addUrlMessage } from "./config/reducers/AddUrlReducer";
import { fetchedFeeds, newsBoardCurrentSourceTab, selectedArticle, fetchingWebArticle, fetchingFeeds } from "./newsboard/reducers/DisplayFeedReducers";
import { configuredSources, hasMoreSourceResults, currentSourceTab, sourceResults, searchInConfiguredSources } from "./sourceConfig/reducers/SourceConfigurationReducers";
import { tokenExpiresTime } from "./config/reducers/FacebookTokenReducer";
import { twitterTokenInfo } from "./config/reducers/TwitterTokenReducer";
import { webArticleMarkup } from "./newsboard/reducers/DisplayArticleReducers";
import { addToCollectionStatus, addArticleToCollection } from "./newsboard/reducers/DisplayArticleReducers";
import { stories, untitledIndex } from "./storyboard/reducers/StoryBoardReducer";
import { displayCollection, currentCollection } from "./newsboard/reducers/DisplayCollectionReducer";
import { setLastAccestime } from "./utils/SessionReducer";
import { currentFilter, currentFilterSource } from "./newsboard/filter/FilterReducer";

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
    selectedArticle,
    fetchingWebArticle,
    webArticleMarkup,
    addToCollectionStatus,
    addArticleToCollection,
    displayCollection,
    currentCollection,
    stories,
    setLastAccestime,
    currentFilter,
    currentFilterSource,
    untitledIndex,
    fetchingFeeds
});

export default contentDiscoveryApp;
