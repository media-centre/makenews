"use strict";
import moment from "moment";
import { logout } from "../login/LogoutActions.js";
const nineMinutes = 540000;
let linkTransition = Symbol();

export default class UserSession {
    static instance(history) {
        return new UserSession(history);
    }

    constructor(history) {
        this[linkTransition] = history;
    }

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

    startSlidingSession() {
        this._lastAccessedTime = moment().valueOf();
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
