/* eslint no-unused-vars:0*/
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
            let result = JSON.stringify(response);
            if (result.includes("URL added ") || response.indexOf("unexpected response from common db") >= 0) {
                result = "URL added Successfully";
            }else{
                if (response.indexOf("unexpected response from the db") >= 0) {
                    result = "URL is already exist";
                }
            }
            return dispatch(handleMessages(result));
        }).catch((error) => {
            let message = null;
            let result = JSON.stringify(error);
            if (result.includes("is not a proper feed")) {
                message = "Invalid RSS URL. Please check the URL";
            }else{
                message = result;
            }
            return dispatch(handleMessages(message));
        });
    };
}

export function handleMessages(message) {
    return {
        "type": MESSAGE,
        message
    };
}
