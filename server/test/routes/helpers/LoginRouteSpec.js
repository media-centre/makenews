/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */


import LoginRoute from "../../../src/routes/helpers/LoginRoute";
import UserRequest from "../../../src/login/UserRequest";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import EnvironmentConfig from "../../../src/config/EnvironmentConfig";
import { userDetails } from "../../../src/Factory";
import { assert } from "chai";
import sinon from "sinon";
import DeleteSourceHandler from "../../../src/hashtags/DeleteSourceHandler";

describe("LoginRoute", () => {
    let request = null, response = null, userName = null, password = null,
        sandbox = sinon.sandbox.create();
    beforeEach("LoginRoute", () => {
        userName = "test_user_name";
        password = "test_password";
    });

    afterEach("LoginRoute", () => {
        sandbox.restore();
    });

    describe("handle", () => {
        let token = null, authSessionCookie = null, next = null,
            userReqGetAuthSessionCookieMock = null, userRequest = null, deleteHashMock = null;
        beforeEach("handle", () => {
            request = {
                "body": {
                    "username": userName,
                    "password": password
                }
            };
            token = "dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA";
            authSessionCookie = `AuthSession=${token}; Version=1; Path=/; HttpOnly`;
            userRequest = new UserRequest(userName, password);
            sandbox.stub(UserRequest, "instance").withArgs(userName, password).returns(userRequest);
            let deleteHanlder = DeleteSourceHandler.instance();
            sandbox.mock(DeleteSourceHandler).expects("instance").returns(deleteHanlder);
            deleteHashMock = sandbox.mock(deleteHanlder).expects("deleteSources")
                .returns(Promise.resolve({ "ok": true }));
            userReqGetAuthSessionCookieMock = sandbox.mock(userRequest).expects("getAuthSessionCookie");
        });

        it("should respond with authsession cookie and json data if login is successful", (done) => {
            const updateUserMock = sandbox.mock(userDetails).expects("updateUser");
            sandbox.stub(userRequest, "getUserDetails").returns(Promise.resolve({
                "_id": "org.couchdb.user:minion",
                "name": "minion",
                "visitedUser": true
            }));
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
                    try {
                        assert.deepEqual(
                            {
                                "userName": userName,
                                "dbParameters": {
                                    "serverUrl": "http://localhost:5000",
                                    "remoteDbUrl": "http://localhost:5984"
                                }
                            }, data);
                        userReqGetAuthSessionCookieMock.verify();
                        updateUserMock.verify();
                        deleteHashMock.verify();
                        done();
                    } catch(err) {
                        done(err);
                    }
                }
            };

            const clientConfig = {
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
            const loginRoute = new LoginRoute(request, response, next);
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

        it("should set firstTimeUser in response if user is not visited before", (done) => {
            sandbox.mock(userDetails).expects("updateUser");
            sinon.stub(userRequest, "getUserDetails").returns(Promise.resolve({
                "_id": "org.couchdb.user:minion",
                "name": "minion"
            }));
            response = {
                "status": () => {
                    return response;
                },
                "append": () => {
                    return response;
                },
                "json": (data) => {
                    try {
                        assert.deepEqual(
                            {
                                userName,
                                "dbParameters": {
                                    "serverUrl": "http://localhost:5000",
                                    "remoteDbUrl": "http://localhost:5984"
                                },
                                "firstTimeUser": true
                            }, data);
                        done();
                    } catch(err) {
                        done(err);
                    }
                }
            };

            const clientConfig = {
                "get": (param) => {
                    assert.strictEqual("db", param);
                    return {
                        "serverUrl": "http://localhost:5000",
                        "remoteDbUrl": "http://localhost:5984"
                    };
                }
            };
            sandbox.stub(EnvironmentConfig, "instance")
                .withArgs(EnvironmentConfig.files.CLIENT_PARAMETERS).returns(clientConfig);

            userReqGetAuthSessionCookieMock.returns(Promise.resolve(authSessionCookie));

            const loginRoute = new LoginRoute(request, response, next);
            loginRoute.handle();
        });

        it("should not set firstTimeUser in response if user has visited before", (done) => {
            sandbox.mock(userDetails).expects("updateUser");
            sinon.stub(userRequest, "getUserDetails").returns(Promise.resolve({
                "_id": "org.couchdb.user:minion",
                "name": "minion",
                "visitedUser": true
            }));
            response = {
                "status": () => {
                    return response;
                },
                "append": () => {
                    return response;
                },
                "json": (data) => {
                    try {
                        assert.deepEqual(
                            {
                                userName,
                                "dbParameters": {
                                    "serverUrl": "http://localhost:5000",
                                    "remoteDbUrl": "http://localhost:5984"
                                }
                            }, data);
                        done();
                    } catch(err) {
                        done(err);
                    }
                }
            };

            const clientConfig = {
                "get": (param) => {
                    assert.strictEqual("db", param);
                    return {
                        "serverUrl": "http://localhost:5000",
                        "remoteDbUrl": "http://localhost:5984"
                    };
                }
            };
            sandbox.stub(EnvironmentConfig, "instance")
                .withArgs(EnvironmentConfig.files.CLIENT_PARAMETERS).returns(clientConfig);

            userReqGetAuthSessionCookieMock.returns(Promise.resolve(authSessionCookie));

            const loginRoute = new LoginRoute(request, response, next);
            loginRoute.handle();
        });

        it("should respond with unauthorized if fetching user details fails", (done) => {
            const userDetailsMock = sinon.mock(userRequest).expects("getUserDetails");
            userDetailsMock.returns(Promise.reject("error"));
            response = {
                "status": (statusCode) => {
                    assert.equal(HttpResponseHandler.codes.UNAUTHORIZED, statusCode);
                    return response;
                },
                "json": (data) => {
                    assert.deepEqual({ "message": "unauthorized" }, data);
                    userReqGetAuthSessionCookieMock.verify();
                    done();
                }
            };

            userReqGetAuthSessionCookieMock.returns(Promise.resolve(authSessionCookie));

            let loginRoute = new LoginRoute(request, response, next);
            loginRoute.handle();
        });
    });
});
