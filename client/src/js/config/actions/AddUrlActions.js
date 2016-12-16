import RssRequestHandler from "./../../rss/RssRequestHandler";
import AjaxClient from "./../../utils/AjaxClient";

export function addRssUrl(url) {
    return dispatch => {
        let ajax = AjaxClient.instance("/add-url", true);
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        console.log("in action");
        ajax.post(headers, { "url": url }).then((result) => {
            console.log(result);
        });

    };
}
