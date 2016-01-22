/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import LoginRoute from "../../../src/routes/helpers/LoginRoute.js";
import UserRequest from "../../../src/login/UserRequest.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import EnvironmentConfig from "../../../src/config/EnvironmentConfig.js";
import LogTestHelper from "../../helpers/LogTestHelper.js";
import Logger from "../../../src/logging/Logger.js";
import { assert } from "chai";
import sinon from "sinon";

describe("LoginRoute", () => {
    let request = null, response = null, userName = null, password = null;
    before("LoginRoute", () => {
        userName = "test_user_name";
        password = "test_password";
        sinon.stub(Logger, "instance").returns(LogTestHelper.instance());
    });
    after("LoginRoute", () => {
        Logger.instance.restore();
    });
    describe("handle", () => {
        let token = null, authSessionCookie = null, next = null, userReqGetAuthSessionCookieMock = null, userRequest = null;
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
            sinon.stub(UserRequest, "instance").withArgs(userName, password).returns(userRequest);
            userReqGetAuthSessionCookieMock = sinon.mock(userRequest).expects("getAuthSessionCookie");
        });

        afterEach("handle", () => {
            userRequest.getAuthSessionCookie.restore();
            UserRequest.instance.restore();
        });

        it("should respond with authsession cookie and json data if login is successful", (done) => {
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
                }
            };
            next = () => {
                userReqGetAuthSessionCookieMock.verify();
                EnvironmentConfig.instance.restore();
                done();
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
            sinon.stub(EnvironmentConfig, "instance").withArgs(EnvironmentConfig.files.CLIENT_PARAMETERS).returns(clientConfig);

            userReqGetAuthSessionCookieMock.returns(Promise.resolve(authSessionCookie));

            let loginRoute = new LoginRoute(request, response, next);
            loginRoute.handle();
        });

        it("should respond with unauthorized if fetching authsession cookie is failed", (done) => {
            response = {
                "status": (statusCode) => {
                    assert.equal(HttpResponseHandler.codes.UNAUTHORIZED, statusCode);
                    return response;
                },
                "json": (data) => {
                    assert.deepEqual({ "message": "unauthorized" }, data);
                }
            };

            next = () => {
                userReqGetAuthSessionCookieMock.verify();
                done();
            };

            userReqGetAuthSessionCookieMock.returns(Promise.reject("error"));

            let loginRoute = new LoginRoute(request, response, next);
            loginRoute.handle();
        });
    });
});
