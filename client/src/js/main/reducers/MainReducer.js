/*eslint new-cap:0, no-unused-vars:0*/

import Locale from "../../utils/Locale";

export function mainHeaderLocale(state = {}, action = {}) {
    let appLocaleEn = Locale.applicationStrings();
    return appLocaleEn.messages.headerStrings;
}
