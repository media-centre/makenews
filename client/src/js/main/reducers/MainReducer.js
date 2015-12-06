/*eslint new-cap:0, no-unused-vars:0*/
"use strict";
import Locale from "../../utils/Locale.js";

export function mainHeaderLocale(state = {}, action = {}) {
    let appLocaleEn = Locale.applicationStrings();
    return appLocaleEn.messages.headerStrings;
}
