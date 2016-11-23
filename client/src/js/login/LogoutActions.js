

import AjaxClient from "../utils/AjaxClient";
import DbSession from "../db/DbSession";
import AppSessionStorage from "../utils/AppSessionStorage";
import History from "../History";

export default class LogoutActions {
    static instance() {
        return new LogoutActions();
    }

    logout() {
        AjaxClient.instance("/logout", true).get();
        AppSessionStorage.instance().clear();
        DbSession.clearInstance();
        History.getHistory().push("/");
        window.location.reload();
    }
}
