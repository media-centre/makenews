import AjaxClient from "../utils/AjaxClient";
import History from "../History";
import AppSessionStorage from "./../utils/AppSessionStorage";

export default class LogoutActions {
    static instance() {
        return new LogoutActions();
    }

    logout() {
        AjaxClient.instance("/logout", true).get();
        const appSessionStorage = AppSessionStorage.instance();
        appSessionStorage.remove(AppSessionStorage.KEYS.LAST_RENEWED_TIME);
        History.getHistory().push("/");
        window.location.reload();
    }
}
