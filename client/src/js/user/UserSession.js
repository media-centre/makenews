"use strict";
import moment from "moment";
import { logout } from "../login/LogoutActions.js";
import AppSessionStorage from "../utils/AppSessionStorage.js";
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
        return AppSessionStorage.instance().getValue("lastAccessedTime");
    }

    setLastAccessedTime(time) {
        AppSessionStorage.instance().setValue("lastAccessedTime", time);
    }

    isActiveContinuously() {
        let currentTime = moment().valueOf();
        return currentTime - this.getLastAccessedTime() < nineMinutes;
    }

    startSlidingSession() {
        this.setLastAccessedTime(moment().valueOf());
        this._continueSessionIfActive();
    }

    _continueSessionIfActive() {
        let timer = setInterval(() => {
            if(!this.isActiveContinuously()) {
                _logoutAndClearInterval(this);
            }
        }, nineMinutes);

        function _logoutAndClearInterval(_this) {
            logout();
            clearInterval(timer);
            _this[linkTransition].push("/");
        }
    }
}
