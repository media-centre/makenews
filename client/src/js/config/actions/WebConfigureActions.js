import AjaxClient from "./../../utils/AjaxClient";
import {
    fetchingSources,
    fetchingSourcesFailed } from "../../sourceConfig/actions/SourceConfigurationActions";
import { intersectionWith } from "../../utils/SearchResultsSetOperations";

export const WEB_GOT_SOURCE_RESULTS = "WEB_GOT_SOURCE_RESULTS";
export const WEB_ADD_SOURCE = "WEB_ADD_SOURCE";

export function gotWebSourceResults(sources, keyword) {
    return {
        "type": WEB_GOT_SOURCE_RESULTS,
        "sources": { "data": sources.docs, "paging": sources.paging, "keyword": keyword }
    };
}

export function fetchWebSources(keyword, params = {}) {
    let ajaxClient = AjaxClient.instance("/web-sources");

    return async (dispatch, getState) => {
        dispatch(fetchingSources);
        try {
            let data = await ajaxClient.get({ keyword, ...params });
            if(data.docs.length) {
                let configuredSources = getState().configuredSources.web;
                const cmp = (first, second) => first.url === second._id;
                intersectionWith(cmp, data.docs, configuredSources);
                dispatch(gotWebSourceResults(data, keyword));
            } else {
                dispatch(fetchingSourcesFailed(keyword));
            }
        } catch(err) {
            dispatch(fetchingSourcesFailed(keyword));
        }
    };
}
