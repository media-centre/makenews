import AjaxClient from "./../../utils/AjaxClient";
import { WEB_ADD_SOURCE } from "./WebConfigureActions";
import Toast from "../../utils/custom_templates/Toast";

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
