import AjaxClient from "./../../utils/AjaxClient";
import { WEB_ADD_SOURCE, fetchWebSources } from "./WebConfigureActions";
import Toast from "../../utils/custom_templates/Toast";
import { FACEBOOK_ADD_PAGE, fetchFacebookSources, PAGES } from "./../actions/FacebookConfigureActions";
import { TWITTER_ADD_SOURCE, fetchTwitterSources } from "./../actions/TwitterConfigureActions";

export const ADD_URL_STATUS = "ADD_URL_STATUS";

export function addRssUrl(url) {
    return (dispatch) => {
        let ajax = AjaxClient.instance("/add-url", true);
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        ajax.post(headers, { "url": url }).then((response) => {
            dispatch({
                "type": WEB_ADD_SOURCE,
                "sources": [response]
            });
            Toast.show("Added successfully", "success");
            dispatch(fetchWebSources(""));
            return dispatch(showAddUrl(false));
        }).catch((error) => {
            Toast.show(error.message);
            return dispatch(showAddUrl(true));
        });
    };
}

export function showAddUrl(added) {
    return {
        "type": ADD_URL_STATUS,
        "status": added
    };
}

export function addFacebookPage(pageUrl) {
    return async (dispatch) => {
        try {
            const ajax = AjaxClient.instance("/configure-facebook-page");
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };
            const response = await ajax.put(headers, { pageUrl });
            Toast.show(`Page ${response.name} added successfully`, "success");
            dispatch({ "type": FACEBOOK_ADD_PAGE, "sources": [response] });
            dispatch(fetchFacebookSources("", "page", PAGES));
            return dispatch(showAddUrl(false));
        } catch(err) {
            Toast.show(err.message);
            return dispatch(showAddUrl(true));
        }
    };
}

export function addTwitterHandle(twitterHandle) {
    return async (dispatch) => {
        try {
            const ajax = AjaxClient.instance("/configure-twitter-handle");
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };
            const response = await ajax.put(headers, { twitterHandle });
            Toast.show(`Twitter handle ${twitterHandle} added successfully`, "success");
            dispatch({ "type": TWITTER_ADD_SOURCE, "sources": [response] });
            dispatch(fetchTwitterSources(""));
            return dispatch(showAddUrl(false));
        } catch(err) {
            Toast.show(err.message);
            return dispatch(showAddUrl(true));
        }
    };
}
