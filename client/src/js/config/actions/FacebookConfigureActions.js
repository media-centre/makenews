import AjaxClient from "./../../utils/AjaxClient";
import LoginPage from "../../login/pages/LoginPage";
import { intersectionWith } from "../../utils/SearchResultsSetOperations";
import {
    hasMoreSourceResults,
    noMoreSourceResults,
    switchSourceTab,
    fetchingSources,
    fetchingSourcesFailed } from "./../../sourceConfig/actions/SourceConfigurationActions";

export const FACEBOOK_GOT_SOURCES = "FACEBOOK_GOT_SOURCES";
export const FACEBOOK_ADD_PROFILE = "FACEBOOK_ADD_PROFILE";
export const FACEBOOK_ADD_PAGE = "FACEBOOK_ADD_PAGE";
export const FACEBOOK_ADD_GROUP = "FACEBOOK_ADD_GROUP";
export const PROFILES = "profiles";
export const PAGES = "pages";
export const GROUPS = "groups";

export function facebookSourcesReceived(response) {
    return {
        "type": FACEBOOK_GOT_SOURCES,
        "sources": response
    };
}

export function fetchFacebookSources(keyword = "Murali", type, sourceType, props = {}) {
    let ajaxClient = AjaxClient.instance("/facebook-sources", false);
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    return async (dispatch, getState) => {
        dispatch(fetchingSources);
        try {
            let response = await ajaxClient.post(headers, {
                "userName": LoginPage.getUserName(),
                keyword,
                type,
                "paging": props
            });
            dispatch(switchSourceTab(sourceType));
            if (response.data.length) {
                let configuredSources = getState().configuredSources[sourceType.toLowerCase()];
                const cmp = (first, second) => first.id === second._id;
                intersectionWith(cmp, response.data, configuredSources);
                dispatch(facebookSourcesReceived(response));
                dispatch(hasMoreSourceResults());
            } else {
                dispatch(noMoreSourceResults());
                dispatch(fetchingSourcesFailed);
            }
        } catch (err) {
            dispatch(fetchingSourcesFailed);
        }
    };
}
