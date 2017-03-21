import AjaxClient from "./../utils/AjaxClient";
import History from "./../History";

export async function markAsVisitedUser() {
    const ajaxClient = AjaxClient.instance("/visited-user", true);
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    try {
        await ajaxClient.put(headers, {});
        History.getHistory().push("/configure/web");
    } catch (err) { //eslint-disable-line

    }
}
