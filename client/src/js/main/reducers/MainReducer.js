/*eslint new-cap:0, no-unused-vars:0*/

import Locale from "../../utils/Locale";

export function mainHeaderStrings(state = {}, action = {}) {
    const appLocaleEn = Locale.applicationStrings();
    return appLocaleEn.messages.mainHeaderStrings;
}
