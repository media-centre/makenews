/* eslint no-use-before-define:0, no-unused-expressions: 0 */

"use strict";
import moment from "moment";
import { logout } from "../login/LogoutActions.js";
import AppSessionStorage from "../utils/AppSessionStorage.js";
import AjaxClient from "../utils/AjaxClient.js";
import History from "../History";
const nineMinutes = 540000;

export default class UserSession {
    static instance() {
        return new UserSession();
    }

    getLastAccessedTime() {
        return AppSessionStorage.instance().getValue(AppSessionStorage.KEYS.LAST_ACCESSED_TIME);
    }

    setLastAccessedTime(time = moment().valueOf()) {
        AppSessionStorage.instance().setValue(AppSessionStorage.KEYS.LAST_ACCESSED_TIME, time);
    }

    continueSessionIfActive() {
        let currentTime = moment().valueOf(), fiveMinutes = 300000;
        if(!this.isActiveContinuously(currentTime)) {
            this.autoLogout();
            return;
        }
        if(currentTime - this.getLastAccessedTime() > fiveMinutes) {
            this.renewSession();
            AppSessionStorage.instance().setValue(AppSessionStorage.KEYS.LAST_ACCESSED_TIME, currentTime);
        }
    }

    renewSession() {
        AjaxClient.instance("/renew_session", true).get();
    }

    isActiveContinuously(time = moment().valueOf()) {
        return time - this.getLastAccessedTime() > nineMinutes;
    }

    autoLogout() {
        logout();
        History.getHistory().push("/");
    }
}
