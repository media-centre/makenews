/* eslint no-use-before-define:0, no-unused-expressions: 0 */

"use strict";
import moment from "moment";
import { logout } from "../login/LogoutActions.js";
import AppSessionStorage from "../utils/AppSessionStorage.js";
import AjaxClient from "../utils/AjaxClient.js";
const nineMinutes = 540000;
let linkTransition = Symbol();

export default class UserSession {
    static instance(history) {
        return new UserSession(history);
    }

    constructor(history) {
        this[linkTransition] = history;
    }

    getLastAccessedTime() {
        return AppSessionStorage.instance().getValue(AppSessionStorage.KEYS.LAST_ACCESSED_TIME);
    }

    setLastAccessedTime(time = moment().valueOf()) {
        AppSessionStorage.instance().setValue(AppSessionStorage.KEYS.LAST_ACCESSED_TIME, time);
    }

    isActiveContinuously() {
        let currentTime = moment().valueOf();
        return currentTime - this.getLastAccessedTime() < nineMinutes;
    }

    startSlidingSession() {
        this.setLastAccessedTime();
        this._continueSessionIfActive();
    }

    _continueSessionIfActive() {
        let timer = setInterval(() => {
            this.isActiveContinuously() ? _renewSession() : _logoutAndClearInterval();
        }, nineMinutes);

        let _logoutAndClearInterval = () => {
            logout();
            clearInterval(timer);
            this[linkTransition].push("/");
        };

        let _renewSession = () => {
            AjaxClient.instance("/renew_session").get();
        };

        return () => {
            return timer;
        };
    }
}
