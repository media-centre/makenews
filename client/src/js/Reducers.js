import { login, loginPageLocale } from "./login/LoginReducers";
import { combineReducers } from "redux";
import { mainHeaderStrings } from "./main/reducers/MainReducer";
import { changePassword } from "./user/UserProfileReducer";
import { currentHeaderTab } from "./header/HeaderReducer";
import { showAddUrl } from "./config/reducers/AddUrlReducer";
import { fetchedFeeds,
    newsBoardCurrentSourceTab,
    selectedArticle,
    fetchingWebArticle,
    fetchingFeeds
} from "./newsboard/reducers/DisplayFeedReducers";
import { configuredSources,
    currentSourceTab,
    sourceResults,
    searchInConfiguredSources,
    deleteSourceStatus
} from "./sourceConfig/reducers/SourceConfigurationReducers";
import { sourcesAuthenticationInfo } from "./config/reducers/SourcesAuthenticationInfo";
import { webArticleMarkup } from "./newsboard/reducers/DisplayArticleReducers";
import { addArticleToCollection } from "./newsboard/reducers/DisplayArticleReducers";
import { stories, untitledIndex } from "./storyboard/reducers/StoryBoardReducer";
import { displayCollection, currentCollection } from "./newsboard/reducers/DisplayCollectionReducer";
import { currentFilter, currentFilterSource } from "./newsboard/filter/FilterReducer";

const contentDiscoveryApp = combineReducers({
    login,
    loginPageLocale,
    mainHeaderStrings,
    changePassword,
    configuredSources,
    fetchedFeeds,
    showAddUrl,
    sourceResults,
    searchInConfiguredSources,
    currentSourceTab,
    currentHeaderTab,
    sourcesAuthenticationInfo,
    newsBoardCurrentSourceTab,
    selectedArticle,
    fetchingWebArticle,
    webArticleMarkup,
    addArticleToCollection,
    displayCollection,
    currentCollection,
    stories,
    currentFilter,
    currentFilterSource,
    untitledIndex,
    fetchingFeeds,
    deleteSourceStatus
});

export default contentDiscoveryApp;
