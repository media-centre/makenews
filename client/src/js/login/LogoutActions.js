import AjaxClient from "../utils/AjaxClient";
import AppSessionStorage from "../utils/AppSessionStorage";
import History from "../History";

export default class LogoutActions {
    static instance() {
        return new LogoutActions();
    }

    logout() {
        AjaxClient.instance("/logout", true).get();
        AppSessionStorage.instance().clear();
        History.getHistory().push("/");
        localStorage.removeItem("userName");
        window.location.reload();
    }
}
