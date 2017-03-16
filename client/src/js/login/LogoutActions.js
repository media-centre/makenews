import AjaxClient from "../utils/AjaxClient";
import History from "../History";

export default class LogoutActions {
    static instance() {
        return new LogoutActions();
    }

    logout() {
        AjaxClient.instance("/logout", true).get();
        History.getHistory().push("/");
        window.location.reload();
    }
}
