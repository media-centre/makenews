"use strict";

import AjaxClient from "../utils/AjaxClient";

export function logout() {
    AjaxClient.instance("/logout")
        .get();
}
