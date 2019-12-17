import UserSession from "../../src/js/user/UserSession";
import AppSessionStorage from "../../src/js/utils/AppSessionStorage";
import { assert } from "chai";
import moment from "moment";
import sinon from "sinon";

describe("UserSession", () => {
    describe("setLastAccessedTime", () => {
        it("should set lastAccessedTime", () => {
            const sandbox = sinon.sandbox.create();
            const appSessionStorage = new AppSessionStorage();
            sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
            const lastAccessedTime = new Date().getTime();
            const userSession = UserSession.instance();
            const appSessionStorageSetMock = sandbox.mock(appSessionStorage).expects("setValue");
            const appSessionStorageGetMock = sandbox.mock(appSessionStorage).expects("getValue");
            appSessionStorageSetMock.withArgs(AppSessionStorage.KEYS.LAST_RENEWED_TIME, lastAccessedTime);
            appSessionStorageGetMock.withArgs(AppSessionStorage.KEYS.LAST_RENEWED_TIME).returns(lastAccessedTime);
            userSession.setLastAccessedTime(lastAccessedTime);
            assert.strictEqual(userSession.getLastAccessedTime(), lastAccessedTime);
            appSessionStorageSetMock.verify();
            appSessionStorageGetMock.verify();
            sandbox.restore();
        });

        it("should set lastAccessedTime to current time when no parameters passed", () => {
            const lastAccessedTime = new Date().getTime();
            const userSession = UserSession.instance();
            userSession.setLastAccessedTime();
            assert.strictEqual(new Date(userSession.getLastAccessedTime()).getHours(), new Date(lastAccessedTime).getHours());
        });
    });

    describe("user activity", () => {
        let appSessionStorage = null;
        let sandbox = null;
        let appSessionStorageGetStub = null;
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
                const fiveMinute = 5;
                const lastAccessedTime = moment().add(fiveMinute, "m").valueOf();
                const userSession = new UserSession();
                userSession.sessionTime = 600000;
                appSessionStorageGetStub.withArgs(AppSessionStorage.KEYS.LAST_RENEWED_TIME).returns(lastAccessedTime);
                assert.strictEqual(userSession.isActiveContinuously(), true);
            });

            it("should return the false if not active for 8 minutes", () => {
                const eightMinutes = 8;
                const lastAccessedTime = moment().subtract(eightMinutes, "m").valueOf();
                const userSession = new UserSession();
                userSession.sessionTime = 600000;
                userSession.lastAccessedTime = lastAccessedTime;
                assert.strictEqual(userSession.isActiveContinuously(), false);
            });

            it("should return the false if not active for more than 8 minutes", () => {
                const tenMinute = 10;
                const lastAccessedTime = moment().subtract(tenMinute, "m").valueOf();
                const userSession = new UserSession();
                userSession.sessionTime = 600000;
                appSessionStorageGetStub.withArgs(AppSessionStorage.KEYS.LAST_RENEWED_TIME).returns(lastAccessedTime);
                assert.strictEqual(userSession.isActiveContinuously(), false);
            });
        });
    });
});
