"use strict";

import AjaxClient from "../utils/AjaxClient";
import DbSession from "../db/DbSession.js";
import AppSessionStorage from "../utils/AppSessionStorage.js";

export function logout() {
    DbSession.clearInstance();
    AppSessionStorage.instance().clear();
    AjaxClient.instance("/logout").get();
}
