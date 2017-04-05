import AjaxClient from "./../../utils/AjaxClient";
import { intersectionWith } from "../../utils/SearchResultsSetOperations";
import {
    fetchingSources,
    fetchingSourcesFailed } from "./../../sourceConfig/actions/SourceConfigurationActions";
import { FB_DEFAULT_SOURCES } from "../../utils/Constants";

export const FACEBOOK_GOT_SOURCES = "FACEBOOK_GOT_SOURCES";
export const FACEBOOK_ADD_PROFILE = "FACEBOOK_ADD_PROFILE";
export const FACEBOOK_ADD_PAGE = "FACEBOOK_ADD_PAGE";
export const FACEBOOK_ADD_GROUP = "FACEBOOK_ADD_GROUP";
export const PROFILES = "profiles";
export const PAGES = "pages";
export const GROUPS = "groups";

export function facebookSourcesReceived(response, keyword, currentTab) {
    return {
        "type": FACEBOOK_GOT_SOURCES,
        "sources": {
            "data": response.data,
            "paging": response.paging,
            "keyword": keyword
        },
        currentTab
    };
}

export function fetchFacebookSources(keyword, type, sourceType, props = {}) {

    return async (dispatch, getState) => {
        dispatch(fetchingSources);
        try {
            const sources = getState().sourceResults.data;
            const response = await _getFbSources(keyword, type, sources, props);
            if (response.data.length) {
                let configuredSources = getState().configuredSources[sourceType.toLowerCase()];
                const cmp = (first, second) => first.id === second._id;
                intersectionWith(cmp, response.data, configuredSources);
                dispatch(facebookSourcesReceived(response, keyword, sourceType));
            } else {
                dispatch(fetchingSourcesFailed(keyword));
            }
        } catch (err) {
            dispatch(fetchingSourcesFailed(keyword));
        }
    };
}

async function _getFbSources(keyword, type, sources, props) {
    let response = { "data": [] };
    if (keyword) {
        let ajaxClient = AjaxClient.instance("/facebook-sources", false);
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        response = await
            ajaxClient.post(headers, {
                keyword,
                type,
                "paging": props
            });
    } else {
        const updateSources = FB_DEFAULT_SOURCES[type];
        if(!sources.length || (updateSources.data)[0].id !== sources[0].id) { //eslint-disable-line no-magic-numbers
            response = updateSources;
        }
    }

    return response;
}
