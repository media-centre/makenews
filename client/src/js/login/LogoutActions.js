"use strict";

import AjaxClient from "../utils/AjaxClient";
import DbSession from "../db/DbSession.js";
import AppSessionStorage from "../utils/AppSessionStorage.js";

export default class LogoutActions {
    static instance() {
        return new LogoutActions();
    }

    logout() {
        AjaxClient.instance("/logout").get();
        AppSessionStorage.instance().clear();
        DbSession.clearInstance();
        window.location.reload();
    }
}
