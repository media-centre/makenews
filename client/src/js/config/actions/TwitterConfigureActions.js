import AjaxClient from "./../../utils/AjaxClient";
import { hasMoreSourceResults,
    noMoreSourceResults,
    fetchingSources,
    fetchingSourcesFailed } from "../../sourceConfig/actions/SourceConfigurationActions";
import { intersectionWith } from "../../utils/SearchResultsSetOperations";

export const TWITTER_GOT_SOURCE_RESULTS = "TWITTER_GOT_SOURCE_RESULTS";
export const TWITTER_ADD_SOURCE = "TWITTER_ADD_SOURCE";

export function gotTwitterSourceResults(sources, keyword) {
    return {
        "type": TWITTER_GOT_SOURCE_RESULTS,
        "sources": { "data": sources.docs,
            "paging": sources.paging,
            "twitterPreFirstId": sources.twitterPreFirstId,
            "keyword": keyword }
    };
}

export function fetchTwitterSources(keyword, paging = {}, twitterPreFirstId = 0) { //eslint-disable-line no-magic-numbers
    let ajaxClient = AjaxClient.instance("/twitter-handles");
    return async (dispatch, getState) => {
        dispatch(fetchingSources);
        try {
            let data = await ajaxClient.get({ keyword, ...paging, twitterPreFirstId });
            if(data.docs.length) {
                let configuredSources = getState().configuredSources.twitter;
                const cmp = (first, second) => first.id === second._id;
                intersectionWith(cmp, data.docs, configuredSources);
                dispatch(gotTwitterSourceResults(data, keyword));
                dispatch(hasMoreSourceResults);
            } else {
                dispatch(noMoreSourceResults);
                dispatch(fetchingSourcesFailed);
            }
        } catch(err) { //eslint-disable-line un-used-variable
            dispatch(fetchingSourcesFailed);
        }
    };
}
