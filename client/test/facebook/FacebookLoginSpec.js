/* eslint max-nested-callbacks: [2, 5] */

import FacebookLogin from "../../src/js/facebook/FacebookLogin";
import { assert } from "chai";
import UserInfo from "../../src/js/user/UserInfo";
import sinon from "sinon";

describe("FacebookLogin", () => {
    describe("IsTokenExpired", () => {
        let sandbox = null, userInfoStub = null;
        beforeEach("IsTokenExpired", () => {
            sandbox = sinon.sandbox.create();
            sandbox.mock(FacebookLogin.prototype).expects("loadSDK");
            userInfoStub = sandbox.stub(UserInfo, "getUserDocument");
            sandbox.stub(FacebookLogin, "getCurrentTime").returns(1234); //eslint-disable-line no-magic-numbers
        });

        afterEach("IsTokenExpired", () => {
            sandbox.restore();
        });

        it("should resolve token expired true when facebook token is not present in database", () => {
            userInfoStub.returns(Promise.resolve({}));

            return FacebookLogin.isTokenExpired().then(isTokenExpired => {
                assert.isTrue(isTokenExpired);
            });
        });

        it("should resolve token expired true when facebook token is present in the database and it is expired", () => {
            userInfoStub.returns(Promise.resolve({
                "facebookExpiredAfter": 1233
            }));

            return FacebookLogin.isTokenExpired().then(isTokenExpired => {
                assert.isTrue(isTokenExpired);
            });
        });

        it("should resolve token expired false when facebook token is present in the database and it is not expired", () => {
            userInfoStub.returns(Promise.resolve({
                "facebookExpiredAfter": 1235
            }));

            return FacebookLogin.isTokenExpired().then(isTokenExpired => {
                assert.isFalse(isTokenExpired);
            });
        });

        it("should resolve token expired true when UserInfo throws error", () => {
            userInfoStub.returns(Promise.reject({}));

            return FacebookLogin.isTokenExpired().then(isTokenExpired =>{
                assert.isTrue(isTokenExpired);
            });
        });
    });

    describe("Login", () => {
        let sandbox = null, facebookLogin = null;

        beforeEach("Login", () => {
            sandbox = sinon.sandbox.create();
            sandbox.mock(FacebookLogin.prototype).expects("loadSDK");
        });

        afterEach("Login", () => {
            sandbox.restore();
        });

        it("should resolve true if user has already logged in", () => {
            facebookLogin = FacebookLogin.instance();
            return facebookLogin.login().then(isLoggedIn => {
                // assert.isTrue(isLoggedIn);
            });
        });

        xit("should resolve true if user has successfully logged in by entering credentials", (done) => {
            let isTokenExpired = sandbox.mock(FacebookLogin).expects("isTokenExpired");
            isTokenExpired.returns(Promise.resolve(true));

            FacebookLogin.getInstance().then(instance => {
                let showLoginMock = sandbox.mock(instance).expects("showLogin").withArgs(() => {});
                showLoginMock.returns({ "authResponse": {} });
                instance.login().then((isExpired) => {
                    assert.isTrue(isExpired);
                    done();
                });
            });
        });
    });

    xdescribe("showLogin", () => {
        let sandbox = null, facebookLogin = null;
        beforeEach("showLogin", () => {
            sandbox = sinon.sandbox.create();
            sandbox.mock(FacebookLogin.prototype).expects("loadSDK");
            facebookLogin = FacebookLogin.instance();
        });

        afterEach("showLogin", () => {
            sandbox.restore();
        });

        it("should call the callback with null when FB is not defined", () => {
            let callback = sinon.spy();
            facebookLogin.showLogin(callback);

            assert.isTrue(callback.called);
        });
    });
});
