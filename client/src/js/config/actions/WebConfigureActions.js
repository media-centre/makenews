import AjaxClient from "./../../utils/AjaxClient";
import { hasMoreSourceResults, noMoreSourceResults } from "../../sourceConfig/actions/SourceConfigurationActions";

export const WEB_GOT_SOURCE_RESULTS = "WEB_GOT_SOURCE_RESULTS";

export function gotWebSourceResults(sources) {
    return {
        "type": WEB_GOT_SOURCE_RESULTS,
        "sources": { "data": sources.docs, "paging": sources.paging }
    };
}

export function fetchWebSources(keyword, params = {}) {
    let ajaxClient = AjaxClient.instance("/web-sources");

    return async (dispatch) => {
        try {
            let data = await ajaxClient.get({ keyword, ...params });
            if(data.docs.length) {
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
