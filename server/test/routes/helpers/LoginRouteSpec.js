import LoginRoute from "../../../src/routes/helpers/LoginRoute";
import * as UserRequest from "../../../src/login/UserRequest";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import { userDetails } from "../../../src/Factory";
import { assert } from "chai";
import sinon from "sinon";
import DeleteSourceHandler from "../../../src/hashtags/DeleteSourceHandler";


describe("LoginRoute", () => {
    let request = null;
    let response = null;
    let userName = null;
    let password = null;
    const sandbox = sinon.sandbox.create();
    beforeEach("LoginRoute", () => {
        userName = "test_user_name";
        password = "test_password";
    });

    afterEach("LoginRoute", () => {
        sandbox.restore();
    });

    describe("handle", () => {
        let token = null;
        let authSessionCookie = null;
        const next = null;
        let userReqGetAuthSessionCookieMock = null;
        let deleteHashMock = null;
        let deleteOldFeedsMock = null;
        beforeEach("handle", () => {
            request = {
                "body": {
                    "username": userName,
                    "password": password
                }
            };
            token = "dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA";
            authSessionCookie = `AuthSession=${token}; Version=1; Path=/; HttpOnly`;
            const deleteHanlder = DeleteSourceHandler.instance(token);
            sandbox.mock(DeleteSourceHandler).expects("instance").returns(deleteHanlder);
            deleteHashMock = sandbox.mock(deleteHanlder).expects("deleteHashTags")
                .returns(Promise.resolve({ "ok": true }));
            deleteOldFeedsMock = sandbox.mock(deleteHanlder).expects("deleteOldFeeds")
                .returns(Promise.resolve({ "ok": true }));
            userReqGetAuthSessionCookieMock = sandbox.mock(UserRequest).expects("getAuthSessionCookie");
        });

        it("should respond with authsession cookie and json data if login is successful", (done) => {
            const updateUserMock = sandbox.mock(userDetails).expects("updateUser");
            sandbox.stub(UserRequest, "getUserDetails").returns(Promise.resolve({
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
                                "userName": userName
                            }, data);
                        userReqGetAuthSessionCookieMock.verify();
                        updateUserMock.verify();
                        deleteHashMock.verify();
                        deleteOldFeedsMock.verify();
                        done();
                    } catch(err) {
                        done(err);
                    }
                }
            };

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

            const loginRoute = new LoginRoute(request, response, next);
            loginRoute.handle();
        });

        it("should set firstTimeUser in response if user is not visited before", (done) => {
            sandbox.mock(userDetails).expects("updateUser");
            sandbox.stub(UserRequest, "getUserDetails").returns(Promise.resolve({
                "_id": "org.couchdb.user:minion",
                "name": "minion"
            }));
            sandbox.stub(UserRequest, "markAsVisitedUser").returns(Promise.resolve(false));
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
                                "firstTimeUser": true
                            }, data);
                        done();
                    } catch(err) {
                        done(err);
                    }
                }
            };

            userReqGetAuthSessionCookieMock.returns(Promise.resolve(authSessionCookie));

            const loginRoute = new LoginRoute(request, response, next);
            loginRoute.handle();
        });

        it("should not set firstTimeUser in response if user has visited before", (done) => {
            sandbox.mock(userDetails).expects("updateUser");
            sandbox.stub(UserRequest, "getUserDetails").returns(Promise.resolve({
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
                                userName
                            }, data);
                        done();
                    } catch(err) {
                        done(err);
                    }
                }
            };

            userReqGetAuthSessionCookieMock.returns(Promise.resolve(authSessionCookie));

            const loginRoute = new LoginRoute(request, response, next);
            loginRoute.handle();
        });

        it("should respond with unauthorized if fetching user details fails", (done) => {
            const userDetailsMock = sandbox.mock(UserRequest).expects("getUserDetails");
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

            const loginRoute = new LoginRoute(request, response, next);
            loginRoute.handle();
        });
    });
});
