/* eslint no-use-before-define:0, no-unused-expressions: 0 */

import moment from "moment";
import LogoutActions from "../login/LogoutActions";
import AppSessionStorage from "../utils/AppSessionStorage";
import AjaxClient from "../utils/AjaxClient";
const nineMinutes = 540000;

export default class UserSession {
    static instance() {
        return new UserSession();
    }

    getLastAccessedTime() {
        return AppSessionStorage.instance().getValue(AppSessionStorage.KEYS.LAST_RENEWED_TIME);
    }

    setLastAccessedTime(time = moment().valueOf()) {
        AppSessionStorage.instance().setValue(AppSessionStorage.KEYS.LAST_RENEWED_TIME, time);
    }

    continueSessionIfActive() {
        let currentTime = moment().valueOf(), fiveMinutes = 300000;
        if(!this.isActiveContinuously(currentTime)) {
            this.autoLogout();
            return;
        }
        if(currentTime - this.getLastAccessedTime() > fiveMinutes) {
            this.renewSession();
            this.setLastAccessedTime(currentTime);
        } else {
            this.setLastAccessedTime(currentTime);
        }
    }

    renewSession() {
        AjaxClient.instance("/renew_session", true).get();
    }

    isActiveContinuously(time = moment().valueOf()) {
        return time - this.getLastAccessedTime() < nineMinutes;
    }

    autoLogout() {
        LogoutActions.instance().logout();
    }
}
