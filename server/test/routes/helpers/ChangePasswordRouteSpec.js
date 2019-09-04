/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import ChangePasswordRoute from "../../../src/routes/helpers/ChangePasswordRoute";
import * as UserRequest from "../../../src/login/UserRequest";
import sinon from "sinon";
import { assert } from "chai";
import { userDetails } from "./../../../src/Factory";
import { mockResponse } from "./../../helpers/MockResponse";

describe("ChangePasswordRoute", () => {
    let request = null, userName = "test1", sandbox = null, currentPassword = null, newPassword = null;
    beforeEach("ChangePasswordRoute", () => {
        currentPassword = "current_password";
        newPassword = "new_password";
        sandbox = sinon.sandbox.create();
    });

    afterEach("ChangePasswordRoute", () => {
        sandbox.restore();
    });

    describe("validate", () => {
        it("should respond with bad request for empty current password", () =>{
            request = {
                "body": {
                    "currentPassword": "",
                    "newPassword": newPassword
                },
                "cookies": {
                    "AuthSession": "auth_session"
                }
            };
            const response = {};
            const changePasswordRoute = new ChangePasswordRoute(request, response);

            assert.strictEqual(changePasswordRoute.validate(), "missing parameters");
        });

        it("should respond with bad request for empty new password", () =>{
            request = {
                "body": {
                    currentPassword,
                    "newPassword": ""
                },
                "cookies": {
                    "AuthSession": "auth_session"
                }
            };
            const response = {};
            const changePasswordRoute = new ChangePasswordRoute(request, response);

            assert.strictEqual(changePasswordRoute.validate(), "missing parameters");
        });
    });

    describe("handle", () => {
        it("should update with new password", async() => {
            const updatePasswordMock = sandbox.mock(UserRequest).expects("updatePassword");
            const response = mockResponse();
            request = {
                "body": {
                    "currentPassword": currentPassword,
                    "newPassword": newPassword
                },
                "cookies": {
                    "AuthSession": "auth_session"
                }
            };

            sandbox.stub(userDetails, "getUser").returns({ userName });
            updatePasswordMock.withArgs(userName, newPassword, currentPassword).returns(Promise.resolve("successful"));

            const changePasswordRoute = new ChangePasswordRoute(request, response);
            await changePasswordRoute.handle();

            assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
            assert.deepEqual(response.json(), { "message": "Password updation successful" });
        });

        it("should respond with error when password updation failed", async() => {
            const updatePasswordMock = sandbox.mock(UserRequest).expects("updatePassword");
            const response = mockResponse();
            request = {
                "body": {
                    "currentPassword": currentPassword,
                    "newPassword": newPassword
                },
                "cookies": {
                    "AuthSession": "auth_session"
                }
            };

            sandbox.stub(userDetails, "getUser").returns({ userName });
            updatePasswordMock.withArgs(userName, newPassword, currentPassword).returns(Promise.reject("error"));

            const changePasswordRoute = new ChangePasswordRoute(request, response);
            await changePasswordRoute.handle();

            assert.strictEqual(response.status(), HttpResponseHandler.codes.INTERNAL_SERVER_ERROR);
            assert.deepEqual(response.json(), { "message": "Password updation failed" });
        });

        it("should respond with authorization error when user current credentials are incorrect", async() => {
            const updatePasswordMock = sandbox.mock(UserRequest).expects("updatePassword");
            const response = mockResponse();
            request = {
                "body": {
                    "currentPassword": currentPassword,
                    "newPassword": newPassword
                },
                "cookies": {
                    "AuthSession": "auth_session"
                }
            };

            sandbox.stub(userDetails, "getUser").returns({ userName });
            updatePasswordMock.withArgs(userName, newPassword, currentPassword).returns(Promise.reject("login failed"));

            const changePasswordRoute = new ChangePasswordRoute(request, response);
            await changePasswordRoute.handle();

            assert.strictEqual(response.status(), HttpResponseHandler.codes.UNAUTHORIZED);
            assert.deepEqual(response.json(), { "message": "Incorrect user credentials" });
        });
    });

});

