"use strict";
import moment from "moment";
import { logout } from "../login/LogoutActions.js";
const nineMinutes = 540000;
export default class UserSession {
    get lastAccessedTime() {
        return this._lastAccessedTime;
    }

    set lastAccessedTime(time) {
        this._lastAccessedTime = time;
    }

    isActiveContinuously() {
        let currentTime = moment().valueOf();
        return currentTime - this.lastAccessedTime < nineMinutes;
    }

    continueSessionIfActive() {
        let timer = setInterval(() => {
            if(!this.isActiveContinuously()) {
                _logoutAndClearInterval();
            }
        }, nineMinutes);

        function _logoutAndClearInterval() {
            logout();
            clearInterval(timer);
        }
    }
}
