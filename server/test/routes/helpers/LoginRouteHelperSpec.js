/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";

import LoginRouteHelper from "../../../src/routes/helpers/LoginRouteHelper.js";
import CouchSession from "../../../src/CouchSession.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import sinon from "sinon";
import { expect } from "chai";


describe("LoginRouteHelper", () => {
    describe("isValidUserInput", () => {

        it("should return true if username is empty", () => {
            const username = "";
            const password = "testPassword";
            let inValidUser = LoginRouteHelper.isValidUserInput(username, password);
            expect(inValidUser).to.be.ok;
        });

        it("should return true if password is empty", () => {
            const username = "testUser";
            const password = "";
            let inValidUser = LoginRouteHelper.isValidUserInput(username, password);
            expect(inValidUser).to.be.ok;
        });


        it("should return true if username has whitespaces and with non empty password", () => {
            const username = "      ";
            const password = "testPassword";
            let inValidUser = LoginRouteHelper.isValidUserInput(username, password);
            expect(inValidUser).to.be.ok;
        });


        it("should return false if username and password are not empty", () => {
            const username = "testUser";
            const password = "testPassword";
            let inValidUser = LoginRouteHelper.isValidUserInput(username, password);
            expect(inValidUser).to.be.not.ok;
        });
    });

    describe("handleInvalidInput", () => {
        it("should set the response status to unauthorized", () => {
            let response = {
                "status": function(data) {
                    expect(data).to.equal(HttpResponseHandler.codes.UNAUTHORIZED);
                    return response;
                },
                "json": function(data) {
                    expect(data).to.deep.equal({ "message": "invalid user or password" });
                }
            };
            LoginRouteHelper.handleInvalidInput(response);
        });
    });

    describe("handleLoginSuccess", function() {
        it("should set the token as cookie", () => {
            const token = "test_token";
            let response = {
                "status": function(data) {
                    expect(data).to.equal(HttpResponseHandler.codes.OK);
                    return response;
                },
                "append": function(cookieName, receivedToken) {
                    expect("Set-Cookie").to.equal(cookieName);
                    expect(token).to.equal(receivedToken);
                    return response;
                },
                "json": function(data) {
                    expect(data).to.deep.equal({ "message": "login successful" });
                }
            };
            LoginRouteHelper.handleLoginSuccess(response, token);
        });

    });

    describe("handleLoginFailure", function() {
        it("should set the response status as unauthorized", () => {
            const token = "test_token";
            let response = {
                "status": function(data) {
                    expect(data).to.equal(HttpResponseHandler.codes.UNAUTHORIZED);
                    return response;
                },
                "json": function(data) {
                    expect(data).to.deep.equal({ "message": "unauthorized" });
                }
            };
            LoginRouteHelper.handleLoginFailure(response, token);
        });

    });

    describe("loginCallback", () => {
        let request = null, response = null, inValidUserStub = null, couchSessionStub = null;

        beforeEach("loginCallback", () => {
            request = { "body": { "username": "test_user", "password": "test_password" } };
            response = {};
            inValidUserStub = sinon.stub(LoginRouteHelper, "isValidUserInput");
            couchSessionStub = sinon.stub(CouchSession, "login");
        });

        afterEach("loginCallback", () => {
            inValidUserStub.restore();
            couchSessionStub.restore();
        });

        it("should throw error if request is empty", () => {
            try {
                LoginRouteHelper.loginCallback(null, response);
            } catch (error) {
                expect(error.message).to.equal("request or response can not be empty");
            }
        });

        it("should throw error if response is empty", () => {
            try {
                LoginRouteHelper.loginCallback(request, null);
            } catch (error) {
                expect(error.message).to.equal("request or response can not be empty");
            }
        });

        it("should handle the error if invalid user name or password received.", () => {
            let handleInputMock = sinon.mock(LoginRouteHelper).expects("handleInvalidInput");

            inValidUserStub.withArgs(request.body.username, request.body.password).returns(true);
            handleInputMock.withArgs(response);
            LoginRouteHelper.loginCallback(request, response);
            handleInputMock.verify();
            LoginRouteHelper.handleInvalidInput.restore();
        });

        it("should handle the success if login is success with the valid user name and password.", () => {

            // let handleLoginSuccessMock = sinon.mock(LoginRouteHelper).expects("handleLoginSuccess");
            // inValidUserStub.withArgs(request.body.username, request.body.password).returns(false);
            // handleLoginSuccessMock.withArgs(response, token);
            // couchSessionStub.withArgs(request.body.username, request.body.password).returns(Promise.resolve(token));
            // LoginRouteHelper.loginCallback(request, response);
            // handleLoginSuccessMock.verify();
        });

        it("should handle the failure if login is failed.", () => {
        });

    });

});
