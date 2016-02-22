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

    describe("setLastAccessedTime", () => {
        it("should set lastAccessedTime", () => {
            let sandbox = sinon.sandbox.create();
            let appSessionStorage = new AppSessionStorage();
            sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
            let lastAccessedTime = new Date().getTime();
            let userSession = UserSession.instance(history);
            let appSessionStorageSetMock = sandbox.mock(appSessionStorage).expects("setValue");
            let appSessionStorageGetMock = sandbox.mock(appSessionStorage).expects("getValue");
            appSessionStorageSetMock.withArgs(AppSessionStorage.KEYS.LAST_ACCESSED_TIME, lastAccessedTime);
            appSessionStorageGetMock.withArgs(AppSessionStorage.KEYS.LAST_ACCESSED_TIME).returns(lastAccessedTime);
            userSession.setLastAccessedTime(lastAccessedTime);
            assert.strictEqual(userSession.getLastAccessedTime(), lastAccessedTime);
            appSessionStorageSetMock.verify();
            appSessionStorageGetMock.verify();
            sandbox.restore();
        });

        it("should set lastAccessedTime to current time when no parameters passed", () => {
            let lastAccessedTime = new Date().getTime();
            let userSession = UserSession.instance(history);
            userSession.setLastAccessedTime();
            assert.strictEqual(new Date(userSession.getLastAccessedTime()).getHours(), new Date(lastAccessedTime).getHours());
        });
    });


    describe("user activity", () => {
        let appSessionStorage = null, sandbox = null, appSessionStorageGetStub = null;
        beforeEach("beforeEach", () => {
            sandbox = sinon.sandbox.create();
            appSessionStorage = new AppSessionStorage();
            sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
            appSessionStorageGetStub = sandbox.stub(appSessionStorage, "getValue");
        });

        afterEach("afterEach", () => {
            sandbox.restore();
        });

        describe("isActiveContinuously", () => {
            it("should return the true if active within 9 minutes", () => {
                let fiveMinute = 5;
                let lastAccessedTime = moment().add(fiveMinute, "m").valueOf();
                let userSession = new UserSession(history);
                appSessionStorageGetStub.withArgs(AppSessionStorage.KEYS.LAST_ACCESSED_TIME).returns(lastAccessedTime);
                assert.strictEqual(userSession.isActiveContinuously(), true);
            });

            it("should return the false if not active for 9 minutes", () => {
                let nineMinute = 9;
                let lastAccessedTime = moment().subtract(nineMinute, "m").valueOf();
                let userSession = new UserSession(history);
                userSession.lastAccessedTime = lastAccessedTime;
                assert.strictEqual(userSession.isActiveContinuously(), false);
            });

            it("should return the false if not active for more than 9 minutes", () => {
                let tenMinute = 10;
                let lastAccessedTime = moment().subtract(tenMinute, "m").valueOf();
                let userSession = new UserSession(history);
                appSessionStorageGetStub.withArgs(AppSessionStorage.KEYS.LAST_ACCESSED_TIME).returns(lastAccessedTime);
                assert.strictEqual(userSession.isActiveContinuously(), false);
            });
        });

        describe("continueSessionIfActive", () => {
            it("should logout if user inactive for 9 minutes", () => {
                let nineMinutes = 540000;
                let ajaxInstance = new AjaxClient("/logout");
                let ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");
                ajaxInstanceMock.withArgs("/logout").returns(ajaxInstance);
                let ajaxGetMock = sandbox.mock(ajaxInstance).expects("get").atMost(1);
                sandbox.stub(appSessionStorage, "clear");
                let historyMock = sandbox.mock(history).expects("push");
                historyMock.withArgs("/");
                let clock = sandbox.useFakeTimers();
                let userSession = new UserSession(history);
                sandbox.stub(userSession, "isActiveContinuously").returns(false);
                userSession._continueSessionIfActive();
                clock.tick(nineMinutes);
                clock.tick(nineMinutes);
                historyMock.verify();
                ajaxGetMock.verify();
            });

            it("should not call logout if user active continuously within 9 minutes", () => {
                let userSession = new UserSession(history);
                userSession.setLastAccessedTime();
                let nineMinutes = 540000;
                let ajaxInstance = new AjaxClient("/renew_session");
                let ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");
                let clock = sandbox.useFakeTimers();
                ajaxInstanceMock.withArgs("/renew_session").returns(ajaxInstance);
                let ajaxGetMock = sandbox.mock(ajaxInstance).expects("get").returns(Promise.resolve(true));
                sandbox.stub(userSession, "isActiveContinuously").returns(true);

                let timer = userSession._continueSessionIfActive();
                clock.tick(nineMinutes);
                ajaxGetMock.verify();
                clearInterval(timer);
            });

            it("should call logout if user active continuously within 9 minutes and not able to renew session", () => {
                let userSession = new UserSession(history);
                userSession.setLastAccessedTime();
                let nineMinutes = 540000;
                let ajaxInstance = new AjaxClient("/renew_session");
                let ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");
                let clock = sandbox.useFakeTimers();
                ajaxInstanceMock.withArgs("/renew_session").returns(ajaxInstance);
                let ajaxGetMock = sandbox.mock(ajaxInstance).expects("get").returns(Promise.reject());
                sandbox.stub(userSession, "isActiveContinuously").returns(true);
                sandbox.stub(userSession, "autoLogout");

                let timer = userSession._continueSessionIfActive();
                clock.tick(nineMinutes);
                ajaxGetMock.verify();
                clearInterval(timer);
            });
        });

    });

    describe("startSlidingSession", () => {
        it("should set the lastAccessedTime and start timer", () => {
            let sandbox = sinon.sandbox.create();
            let userSession = UserSession.instance(history);
            let setLastAccessedTimeMock = sandbox.mock(userSession).expects("setLastAccessedTime");
            let setTimerMock = sandbox.mock(userSession).expects("_continueSessionIfActive");
            userSession.startSlidingSession();
            setLastAccessedTimeMock.verify();
            setTimerMock.verify();
            sandbox.restore();
        });
    });
});
