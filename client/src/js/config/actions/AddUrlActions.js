/* eslint no-unused-vars:0*/
import AjaxClient from "./../../utils/AjaxClient";

export function addRssUrl(url) {
    return dispatch => {
        let ajax = AjaxClient.instance("/add-url", true);
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        ajax.post(headers, { "url": url }).then((result) => {
            return result;
        }).catch((error) => {
            // console.log("Action---", error);
            // return error;
        });
    };
}
