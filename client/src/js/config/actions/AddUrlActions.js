import AjaxClient from "./../../utils/AjaxClient";
import { WEB_ADD_SOURCE } from "./WebConfigureActions";
import Toast from "../../utils/custom_templates/Toast";
import { FACEBOOK_ADD_PAGE } from "./../actions/FacebookConfigureActions";
import { TWITTER_ADD_SOURCE } from "./../actions/TwitterConfigureActions";

export const RSS_ADD_URL_STATUS = "RSS_ADD_URL_STATUS";

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
            return dispatch(handleMessages(true));
        }).catch((error) => {
            Toast.show(error.message);
            return dispatch(handleMessages(false));
        });
    };
}

export function handleMessages(added) {
    return {
        "type": RSS_ADD_URL_STATUS,
        "status": { added }
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
            dispatch({ "type": FACEBOOK_ADD_PAGE, "sources": [response] });
        } catch(err) {
            Toast.show(err.message);
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
            dispatch({ "type": TWITTER_ADD_SOURCE, "sources": [response] });
        } catch(err) {
            Toast.show(err.message);
        }
    };
}
