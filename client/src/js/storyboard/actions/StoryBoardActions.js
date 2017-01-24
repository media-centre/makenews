import AjaxClient from "../../utils/AjaxClient";

export function addTitleToStory(title) {
    return (dispatch) => {
        let ajax = AjaxClient.instance("/add-story", true);
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        ajax.post(headers, { "title": title }).then(() => {
            dispatch(handleMessages());
        });
    };
}

function handleMessages() {

}
