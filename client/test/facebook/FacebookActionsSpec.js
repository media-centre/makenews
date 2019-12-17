import { updateTokenExpiredInfo, FACEBOOK_EXPIRE_INFO, isFBTokenExpired } from "../../src/js/facebook/FacebookAction";
import AjaxClient from "../../src/js/utils/AjaxClient";
import mockStore from "../helper/ActionHelper";
import sinon from "sinon";
import { assert } from "chai";

describe("FacebookActions", () => {
    describe("upDateTokenExpireTime", () => {
        it("it should return the action type and expires_after value", () => {
            const isValid = false;
            const action = {
                "type": FACEBOOK_EXPIRE_INFO,
                isValid
            };
            const result = updateTokenExpiredInfo(isValid);
            assert.strictEqual(result.type, action.type);
            assert.strictEqual(result.expireTime, action.expireTime);
        });
    });


    describe("isFBTokenExpired", () => {
        let sandbox = null;
        let ajaxClient = null;
        let ajaxGetmock = null;
        beforeEach("isFBTokenExpired", () => {
            sandbox = sinon.sandbox.create();
            ajaxClient = new AjaxClient("/facebook-token-expired", false);
            sandbox.stub(AjaxClient, "instance").returns(ajaxClient);
        });

        afterEach("isFBTokenExpired", () => {
            sandbox.restore();
        });

        it("should get the isExpired info from the server", (done) => {
            ajaxGetmock = sandbox.mock(ajaxClient).expects("get").returns(Promise.resolve({ "isExpired": true }));
            const store = mockStore([], [{ "type": FACEBOOK_EXPIRE_INFO, "isValid": false }], done);
            isFBTokenExpired().then(func => {
                store.dispatch(func);
                ajaxGetmock.verify();
            });
        });

        it("should dispatch isExpired info false when it failed to fetch info from server", (done) => {
            ajaxGetmock = sandbox.mock(ajaxClient).expects("get").returns(Promise.reject({ "status": "Bad Request" }));
            const store = mockStore([], [{ "type": FACEBOOK_EXPIRE_INFO, "isValid": false }], done);
            isFBTokenExpired().then(func => {
                store.dispatch(func);
                ajaxGetmock.verify();
            });
        });
    });
});
