import UserSession from "../../src/js/user/UserSession";
import AppSessionStorage from "../../src/js/utils/AppSessionStorage";
import { assert } from "chai";
import moment from "moment";
import sinon from "sinon";

describe("UserSession", () => {
    describe("setLastAccessedTime", () => {
        it("should set lastAccessedTime", () => {
            let sandbox = sinon.sandbox.create();
            let appSessionStorage = new AppSessionStorage();
            sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
            let lastAccessedTime = new Date().getTime();
            let userSession = UserSession.instance();
            let appSessionStorageSetMock = sandbox.mock(appSessionStorage).expects("setValue");
            let appSessionStorageGetMock = sandbox.mock(appSessionStorage).expects("getValue");
            appSessionStorageSetMock.withArgs(AppSessionStorage.KEYS.LAST_RENEWED_TIME, lastAccessedTime);
            appSessionStorageGetMock.withArgs(AppSessionStorage.KEYS.LAST_RENEWED_TIME).returns(lastAccessedTime);
            userSession.setLastAccessedTime(lastAccessedTime);
            assert.strictEqual(userSession.getLastAccessedTime(), lastAccessedTime);
            appSessionStorageSetMock.verify();
            appSessionStorageGetMock.verify();
            sandbox.restore();
        });

        it("should set lastAccessedTime to current time when no parameters passed", () => {
            let lastAccessedTime = new Date().getTime();
            let userSession = UserSession.instance();
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
                let userSession = new UserSession();
                userSession.sessionTime = 600000;
                appSessionStorageGetStub.withArgs(AppSessionStorage.KEYS.LAST_RENEWED_TIME).returns(lastAccessedTime);
                assert.strictEqual(userSession.isActiveContinuously(), true);
            });

            it("should return the false if not active for 8 minutes", () => {
                let eightMinutes = 8;
                let lastAccessedTime = moment().subtract(eightMinutes, "m").valueOf();
                let userSession = new UserSession();
                userSession.sessionTime = 600000;
                userSession.lastAccessedTime = lastAccessedTime;
                assert.strictEqual(userSession.isActiveContinuously(), false);
            });

            it("should return the false if not active for more than 8 minutes", () => {
                let tenMinute = 10;
                let lastAccessedTime = moment().subtract(tenMinute, "m").valueOf();
                let userSession = new UserSession();
                userSession.sessionTime = 600000;
                appSessionStorageGetStub.withArgs(AppSessionStorage.KEYS.LAST_RENEWED_TIME).returns(lastAccessedTime);
                assert.strictEqual(userSession.isActiveContinuously(), false);
            });
        });
    });
});
