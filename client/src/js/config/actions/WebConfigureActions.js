import AjaxClient from "./../../utils/AjaxClient";
import { hasMoreSourceResults, noMoreSourceResults } from "../../sourceConfig/actions/SourceConfigurationActions";
import { intersectionWith } from "../../utils/SearchResultsSetOperations";

export const WEB_GOT_SOURCE_RESULTS = "WEB_GOT_SOURCE_RESULTS";
export const WEB_ADD_SOURCE = "WEB_ADD_SOURCE";

export function gotWebSourceResults(sources) {
    return {
        "type": WEB_GOT_SOURCE_RESULTS,
        "sources": { "data": sources.docs, "paging": sources.paging }
    };
}

export function fetchWebSources(keyword, params = {}) {
    let ajaxClient = AjaxClient.instance("/web-sources");

    return async (dispatch, getState) => {
        try {
            let data = await ajaxClient.get({ keyword, ...params });
            if(data.docs.length) {
                let configuredSources = getState().configuredSources.web;
                const cmp = (first, second) => first.url === second._id;
                intersectionWith(cmp, data.docs, configuredSources);
                dispatch(gotWebSourceResults(data));
                dispatch(hasMoreSourceResults());
            } else {
                dispatch(noMoreSourceResults());
            }
        } catch(err) { //eslint-disable-line no-empty
            /* TODO: we can use this to stop the spinner or give a warning once request failed */ //eslint-disable-line
        }
    };
}
