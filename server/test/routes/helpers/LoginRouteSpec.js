/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */


import LoginRoute from "../../../src/routes/helpers/LoginRoute";
import UserRequest from "../../../src/login/UserRequest";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import EnvironmentConfig from "../../../src/config/EnvironmentConfig";
import LogTestHelper from "../../helpers/LogTestHelper";
import Logger from "../../../src/logging/Logger";
import { userDetails } from "../../../src/Factory";
import { assert } from "chai";
import sinon from "sinon";

describe("LoginRoute", () => {
    let request = null, response = null, userName = null, password = null,
        sandbox = sinon.sandbox.create();
    beforeEach("LoginRoute", () => {
        userName = "test_user_name";
        password = "test_password";
        sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
    });

    afterEach("LoginRoute", () => {
        sandbox.restore();
    });

    describe("handle", () => {
        let token = null, authSessionCookie = null, next = null,
            userReqGetAuthSessionCookieMock = null, userRequest = null;
        beforeEach("handle", () => {
            request = {
                "body": {
                    "username": userName,
                    "password": password
                }
            };
            token = "dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA";
            authSessionCookie = "AuthSession=" + token + "; Version=1; Path=/; HttpOnly";
            userRequest = new UserRequest(userName, password);
            sandbox.stub(UserRequest, "instance").withArgs(userName, password).returns(userRequest);
            userReqGetAuthSessionCookieMock = sandbox.mock(userRequest).expects("getAuthSessionCookie");
        });

        it("should respond with authsession cookie and json data if login is successful", (done) => {
            let updateUserMock = sandbox.mock(userDetails).expects("updateUser");
            response = {
                "status": (statusCode) => {
                    assert.equal(HttpResponseHandler.codes.OK, statusCode);
                    return response;
                },
                "append": (cookieName, receivedToken) => {
                    assert.strictEqual("Set-Cookie", cookieName);
                    assert.strictEqual(authSessionCookie, receivedToken);
                    return response;
                },
                "json": (data) => {
                    assert.deepEqual(
                        { "userName": userName,
                            "dbParameters": {
                                "serverUrl": "http://localhost:5000",
                                "remoteDbUrl": "http://localhost:5984"
                            }
                        }, data);
                    userReqGetAuthSessionCookieMock.verify();
                    updateUserMock.verify();
                    done();
                }
            };

            let clientConfig = {
                "get": (param) => {
                    assert.strictEqual("db", param);
                    return {
                        "serverUrl": "http://localhost:5000",
                        "remoteDbUrl": "http://localhost:5984"
                    };
                }
            };
            sandbox.stub(EnvironmentConfig, "instance").withArgs(EnvironmentConfig.files.CLIENT_PARAMETERS).returns(clientConfig);

            userReqGetAuthSessionCookieMock.returns(Promise.resolve(authSessionCookie));
            updateUserMock.withArgs(token, userName).returns("db_test");
            let loginRoute = new LoginRoute(request, response, next);
            loginRoute.handle();
        });

        it("should respond with unauthorized if fetching authsession cookie is failed", (done) => {
            response = {
                "status": (statusCode) => {
                    assert.equal(HttpResponseHandler.codes.UNAUTHORIZED, statusCode);
                },
                "json": (data) => {
                    assert.deepEqual({ "message": "unauthorized" }, data);
                    userReqGetAuthSessionCookieMock.verify();
                    done();
                }
            };

            userReqGetAuthSessionCookieMock.returns(Promise.reject("error"));

            let loginRoute = new LoginRoute(request, response, next);
            loginRoute.handle();
        });
    });
});
