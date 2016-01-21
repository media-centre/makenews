/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import UserSession from "../../src/js/user/UserSession.js";
import AjaxClient from "../../src/js/utils/AjaxClient.js";
import AppSessionStorage from "../../src/js/utils/AppSessionStorage.js";
import { assert } from "chai";
import moment from "moment";
import sinon from "sinon";

describe("UserSession", () => {
    let history = null;
    before("before", () => {
        history = { "push": () => {} };
    });

    it("should set lastAccessedTime", () => {
        let lastAccessedTime = new Date().getTime();
        let userSession = UserSession.instance(history);
        userSession.lastAccessedTime = lastAccessedTime;
        assert.strictEqual(userSession.lastAccessedTime, lastAccessedTime);
    });

    describe("isActiveContinuously", () => {
        it("should return the true if active within 9 minutes", () => {
            var fiveMinute = 5;
            let lastAccessedTime = moment().add(fiveMinute, "m").valueOf();
            let userSession = new UserSession(history);
            userSession.lastAccessedTime = lastAccessedTime;
            assert.strictEqual(userSession.isActiveContinuously(), true);
        });

        xit("should return the false if not active for 9 minutes", () => {
            var nineMinute = 9;
            let lastAccessedTime = moment().subtract(nineMinute, "m").valueOf();
            let userSession = new UserSession(history);
            userSession.lastAccessedTime = lastAccessedTime;
            assert.strictEqual(userSession.isActiveContinuously(), false);
        });

        it("should return the false if not active for more than 9 minutes", () => {
            var tenMinute = 10;
            let lastAccessedTime = moment().subtract(tenMinute, "m").valueOf();
            let userSession = new UserSession(history);
            userSession.lastAccessedTime = lastAccessedTime;
            assert.strictEqual(userSession.isActiveContinuously(), false);
        });
    });

    describe("continueSessionIfActive", () => {
        it("should logout if user inactive for 9 minutes", () => {
            let userSession = new UserSession(history);
            var tenMinute = 10;
            userSession.lastAccessedTime = moment().subtract(tenMinute, "m").valueOf();
            let sandbox = sinon.sandbox.create();
            let clock = sandbox.useFakeTimers();
            let nineMinutes = 540000;
            let ajaxInstance = new AjaxClient("/logout");
            let ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");
            ajaxInstanceMock.withArgs("/logout").returns(ajaxInstance);
            let ajaxGetMock = sandbox.mock(ajaxInstance).expects("get").atMost(1);
            let appSessionStorage = new AppSessionStorage();
            sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
            sandbox.stub(appSessionStorage, "clear");
            let historyMock = sandbox.mock(history).expects("push");
            historyMock.withArgs("/");
            userSession._continueSessionIfActive();
            clock.tick(nineMinutes);
            clock.tick(nineMinutes);
            historyMock.verify();
            ajaxGetMock.verify();
            sandbox.restore();
        });

        it("should not call logout if user active continuously within 9 minutes", () => {
            let userSession = new UserSession(history);
            let sandbox = sinon.sandbox.create();
            let clock = sandbox.useFakeTimers();
            let nineMinutes = 540000;
            let ajaxInstance = new AjaxClient("/logout");
            let ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");

            var fiveMinute = 5;
            userSession.lastAccessedTime = moment().add(fiveMinute, "m").valueOf();
            ajaxInstanceMock.withArgs("/logout").returns(ajaxInstance);
            let ajaxGetMock = sandbox.mock(ajaxInstance).expects("get").never();
            userSession._continueSessionIfActive();
            clock.tick(nineMinutes);
            ajaxGetMock.verify();
            sandbox.restore();
        });

        describe("startSlidingSession", () => {
            it("should set the lastAccessedTime to current time", () => {
                let userSession = new UserSession(history);
                userSession.startSlidingSession();
                assert.strictEqual(new Date(userSession.lastAccessedTime).getHours(), new Date(moment().valueOf()).getHours());
            });
        });
    });
});
