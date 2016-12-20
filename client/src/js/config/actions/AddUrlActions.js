/* eslint no-unused-vars:0 no-magic-numbers:0*/
import AjaxClient from "./../../utils/AjaxClient";

export const MESSAGE = "MESSAGE";

export function addRssUrl(url) {
    return (dispatch) => {
        let ajax = AjaxClient.instance("/add-url", true);
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        ajax.post(headers, { "url": url }).then((response) => {
            return dispatch(handleMessages(response));
        }).catch((error) => {
            return dispatch(handleMessages("Invalid RSS URL. Please check the URL"));
        });
    };
}

export function invalidRssUrl() {
    return (dispatch) => {
        return dispatch(handleMessages("Please enter proper url."));
    };
}

export function handleMessages(message) {
    return {
        "type": MESSAGE,
        message
    };
}
