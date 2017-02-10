import { setLastAccestime } from "./../../src/js/utils/SessionReducer";
import AppSessionStorage from "./../../src/js/utils/AppSessionStorage";
import UserSession from "./../../src/js/user/UserSession";
import sinon from "sinon";
import { assert } from "chai";

describe("Session Reducer", () => {

    let sandbox = sinon.sandbox.create();

    afterEach("Session Reducer", () => {
        sandbox.restore();
    });

    it("should set acces time", () => {

        let applicationStorageInstance = AppSessionStorage.instance();
        sandbox.stub(AppSessionStorage, "instance").returns(applicationStorageInstance);

        const lastAccessTime = 1234;
        sandbox.stub(applicationStorageInstance, "getValue")
            .withArgs(AppSessionStorage.KEYS.LAST_RENEWED_TIME)
            .returns(lastAccessTime);

        let userSessionInstance = UserSession.instance();
        sandbox.mock(UserSession).expects("instance").returns(userSessionInstance);
        let userSessionMock = sandbox.mock(userSessionInstance).expects("continueSessionIfActive");
        setLastAccestime();
        userSessionMock.verify();
    });

    it("should return empty when there is no access time", () => {
        let applicationStorageInstance = AppSessionStorage.instance();
        sandbox.stub(AppSessionStorage, "instance").returns(applicationStorageInstance);

        sandbox.stub(applicationStorageInstance, "getValue")
            .withArgs(AppSessionStorage.KEYS.LAST_RENEWED_TIME);

        assert.isFalse(setLastAccestime());
    });
});
