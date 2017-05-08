import AjaxClient from "./../../utils/AjaxClient";
import {
    fetchingSources,
    fetchingSourcesFailed
} from "../../sourceConfig/actions/SourceConfigurationActions";
import { intersectionWith } from "../../utils/SearchResultsSetOperations";

export const WEB_GOT_SOURCE_RESULTS = "WEB_GOT_SOURCE_RESULTS";
export const WEB_ADD_SOURCE = "WEB_ADD_SOURCE";

export function gotWebSourceResults(sources, keyword, currentTab) {
    return {
        "type": WEB_GOT_SOURCE_RESULTS,
        "sources": { "data": sources.docs, "paging": sources.paging, "keyword": keyword },
        currentTab
    };
}

export function fetchWebSources(keyword = "", params = {}) {
    const ajaxClient = AjaxClient.instance("/web-sources");

    return async (dispatch, getState) => {
        dispatch(fetchingSources);
        try {
            const data = await ajaxClient.get({ keyword, ...params });
            if(data.docs.length) {
                const configuredSources = getState().configuredSources.web;
                const cmp = (first, second) => first.id === second._id;
                intersectionWith(cmp, data.docs, configuredSources);
                dispatch(gotWebSourceResults(data, keyword, "web"));
            } else {
                dispatch(fetchingSourcesFailed(keyword));
            }
        } catch(err) {
            dispatch(fetchingSourcesFailed(keyword));
        }
    };
}
