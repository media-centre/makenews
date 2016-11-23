/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import ChangePasswordRoute from "../../../src/routes/helpers/ChangePasswordRoute";
import UserRequest from "../../../src/login/UserRequest";
import sinon from "sinon";
import { assert } from "chai";


describe("ChangePasswordRoute", () => {
    let request = null, userName = "test1", sandbox = null, currentPassword = null, newPassword = null;
    beforeEach("ChangePasswordRoute", () => {
        currentPassword = "current_password";
        newPassword = "new_password";
        sandbox = sinon.sandbox.create();
        sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
    });

    afterEach("ChangePasswordRoute", () => {
        sandbox.restore();
    });

    describe("handle", () => {
        beforeEach("handle", () => {
        });

        afterEach("handle", () => {
        });

        describe("invalid", () => {
            it("should respond with bad request for empty user name", (done) =>{
                let response = {
                    "status": (status) => {
                        assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                        return response;
                    },
                    "json": (json) => {
                        assert.deepEqual({ "message": "bad request" }, json);
                        done();
                    }
                };
                request = {
                    "body": {
                        "userName": "",
                        "currentPassword": currentPassword,
                        "newPassword": newPassword
                    }
                };

                let changePasswordRoute = new ChangePasswordRoute(request, response);
                changePasswordRoute.handle();
            });

            it("should respond with bad request for empty current password", (done) =>{
                let response = {
                    "status": (status) => {
                        assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                        return response;
                    },
                    "json": (json) => {
                        assert.deepEqual({ "message": "bad request" }, json);
                        done();
                    }
                };
                request = {
                    "body": {
                        "userName": userName,
                        "currentPassword": "",
                        "newPassword": newPassword
                    }
                };

                let changePasswordRoute = new ChangePasswordRoute(request, response);
                changePasswordRoute.handle();
            });

            it("should respond with bad request for empty new password", (done) =>{
                let response = {
                    "status": (status) => {
                        assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                        return response;
                    },
                    "json": (json) => {
                        assert.deepEqual({ "message": "bad request" }, json);
                        done();
                    }
                };
                request = {
                    "body": {
                        "userName": userName,
                        "currentPassword": currentPassword,
                        "newPassword": ""
                    }
                };

                let changePasswordRoute = new ChangePasswordRoute(request, response);
                changePasswordRoute.handle();
            });
        });

        it("should update with new password", (done) => {
            let userRequest = new UserRequest(userName, currentPassword);
            let updatePasswordMock = sandbox.mock(userRequest).expects("updatePassword");
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual({ "message": "Password updation successful" }, json);
                    updatePasswordMock.verify();
                    done();
                }
            };
            request = {
                "body": {
                    "userName": userName,
                    "currentPassword": currentPassword,
                    "newPassword": newPassword
                }
            };
            sandbox.stub(UserRequest, "instance").returns(userRequest);
            updatePasswordMock.withArgs(newPassword).returns(Promise.resolve("successful"));
            let changePasswordRoute = new ChangePasswordRoute(request, response);
            changePasswordRoute.handle();

        });

        it("should respond with error when password updation failed", (done) => {
            let userRequest = new UserRequest(userName, currentPassword);
            let updatePasswordMock = sandbox.mock(userRequest).expects("updatePassword");
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual({ "message": "Password updation failed" }, json);
                    updatePasswordMock.verify();
                    done();
                }
            };
            request = {
                "body": {
                    "userName": userName,
                    "currentPassword": currentPassword,
                    "newPassword": newPassword
                }
            };
            sandbox.stub(UserRequest, "instance").returns(userRequest);
            updatePasswordMock.withArgs(newPassword).returns(Promise.reject("error"));
            let changePasswordRoute = new ChangePasswordRoute(request, response);
            changePasswordRoute.handle();

        });

        it("should respond with authorization error when user current credentials are incorrect", (done) => {
            let userRequest = new UserRequest(userName, currentPassword);
            let updatePasswordMock = sandbox.mock(userRequest).expects("updatePassword");
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.UNAUTHORIZED, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual({ "message": "Incorrect user credentials" }, json);
                    updatePasswordMock.verify();
                    done();
                }
            };
            request = {
                "body": {
                    "userName": userName,
                    "currentPassword": currentPassword,
                    "newPassword": newPassword
                }
            };
            sandbox.stub(UserRequest, "instance").returns(userRequest);
            updatePasswordMock.withArgs(newPassword).returns(Promise.reject("login failed"));
            let changePasswordRoute = new ChangePasswordRoute(request, response);
            changePasswordRoute.handle();

        });
    });

});

