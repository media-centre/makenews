import AjaxClient from "./../utils/AjaxClient";
import AppSessionStorage from "./../utils/AppSessionStorage";

export async function markAsVisitedUser() {
    const ajaxClient = AjaxClient.instance("/visited-user", true);
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    try {
        await ajaxClient.put(headers, {});
        AppSessionStorage.instance().remove(AppSessionStorage.KEYS.FIRST_TIME_USER);
    } catch (err) { //eslint-disable-line

    }
}
