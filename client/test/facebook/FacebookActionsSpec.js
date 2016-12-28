import { updateTokenExpireTime, FACEBOOK_EXPIRE_TIME, getTokenExpireTime } from "../../src/js/facebook/FacebookAction";
import AjaxClient from "../../src/js/utils/AjaxClient";
import mockStore from "../helper/ActionHelper";
import sinon from "sinon";
import { assert } from "chai";

describe("FacebookActions", () => {
    describe("upDateTokenExpireTime", () => {
        it("it should return the action type and expires_after value", () => {
            let expireTime = 1234;
            let action = {
                "type": FACEBOOK_EXPIRE_TIME,
                "expireTime": expireTime
            };
            let result = updateTokenExpireTime(expireTime);
            assert.strictEqual(result.type, action.type);
            assert.strictEqual(result.expireTime, action.expireTime);
        });
    });
    
    describe("getTokenExpireTime", () => {
        let sandbox = null, ajaxClient = null, ajaxGetmock = null;
        beforeEach("getExpireTime", () => {
            sandbox = sinon.sandbox.create();
            ajaxClient = new AjaxClient("/facebook-token-expire-time", false);
            sandbox.stub(AjaxClient, "instance").returns(ajaxClient);
        });

        afterEach("getExpireTime", () => {
            sandbox.restore();
        });

        it("should get the expires time from the server", (done) => {
            let expireTime = 12345;
            ajaxGetmock = sandbox.mock(ajaxClient).expects("get").returns(Promise.resolve({ "expireTime": expireTime }));
            let store = mockStore([], [{ "type": FACEBOOK_EXPIRE_TIME, "expireTime": expireTime }], done);
            store.dispatch(getTokenExpireTime());
            ajaxGetmock.verify();
        });

        it("should get the expires time as ZERO when token is not available in the server", (done) => {
            let expireTime = 0;
            ajaxGetmock = sandbox.mock(ajaxClient).expects("get").returns(Promise.resolve({ "expireTime": expireTime }));
            let store = mockStore([], [{ "type": FACEBOOK_EXPIRE_TIME, "expireTime": expireTime }], done);
            store.dispatch(getTokenExpireTime());
            ajaxGetmock.verify();
        });
    });
});
