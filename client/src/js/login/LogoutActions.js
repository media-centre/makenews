"use strict";

import AjaxClient from "../utils/AjaxClient";
import DbSession from "../db/DbSession.js";
import AppSessionStorage from "../utils/AppSessionStorage.js";

export function logout() {
    DbSession.clearInstance();
    AjaxClient.instance("/logout").get();
    AppSessionStorage.instance().clear();
}
