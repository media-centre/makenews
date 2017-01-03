/* eslint no-unused-vars:0 no-magic-numbers:0*/
import AjaxClient from "./../../utils/AjaxClient";
import { WEB_ADD_SOURCE } from "./WebConfigureActions";


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
            return dispatch(handleMessages("Added successfully", true));
        }).catch((error) => {
            return dispatch(handleMessages(error.message, false));
        });
    };
}

export const invalidRssUrl = () => handleMessages("Please enter proper url.", false);

export function handleMessages(message, added) {
    return {
        "type": RSS_ADD_URL_STATUS,
        "status": { message, added }
    };
}
