/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import UserProfileActions, { CHANGE_PASSWORD_SUCCESSFUL, INCORRECT_USER_CREDENTIALS, PASSWORD_UPDATION_FAILED, NEW_PWD_CONFIRM_PWD_MISMATCH, NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD } from "../../src/js/user/UserProfileActions";
import AjaxClient from "../../src/js/utils/AjaxClient";
import mockStore from "../helper/ActionHelper";
import UserSession from "../../src/js/user/UserSession";
import "../helper/TestHelper";
import sinon from "sinon";
import { assert } from "chai";

describe("UserProfileActions", ()=> {
    let sandbox = null;
    beforeEach("UserProfileActions", () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach("UserProfileActions", () => {
        sandbox.restore();
    });

    describe("changePassword", () => {
        let url = null, headers = null, data = null, userName = null, currentPassword = null, newPassword = null, ajaxClient = null, ajaxClientPostMock = null, verify = null;
        beforeEach("changePassword", () => {
            url = "/change_password";
            userName = "test";
            headers = {
                "Accept": "application/json",
                "Content-type": "application/json"
            };
            data = { "userName": userName, "currentPassword": currentPassword, "newPassword": newPassword };

            let userSession = new UserSession();
            sandbox.stub(UserSession, "instance").returns(userSession);
            sandbox.stub(userSession, "continueSessionIfActive");

            ajaxClient = new AjaxClient(url);
            sandbox.stub(AjaxClient, "instance").withArgs(url).returns(ajaxClient);
            ajaxClientPostMock = sandbox.mock(ajaxClient).expects("post");
            verify = function() {
                ajaxClientPostMock.verify();
            };

        });

        it("user name can not be empty string", () => {
            let changePasswordFn = () => {
                new UserProfileActions().changePassword("", currentPassword, newPassword);
            };
            assert.throw(changePasswordFn, "user name never be empty");
        });

        it("should dispatch the change password successful reducer when the password change from server is successful", (done) => {
            ajaxClientPostMock.withArgs(headers, data).returns(Promise.resolve("change password successful"));
            const expectedActions = [
                { "type": CHANGE_PASSWORD_SUCCESSFUL }
            ];

            const store = mockStore({ "errorMessage": "" }, expectedActions, done, verify);
            let userActions = new UserProfileActions();
            store.dispatch(userActions.changePassword(userName, currentPassword, newPassword));
        });

        it("should dispatch the incorrect credentials reducer when the password change is failed", (done) => {
            ajaxClientPostMock.withArgs(headers, data).returns(Promise.reject({ "message": "Incorrect user credentials" }));

            const expectedActions = [
                { "type": INCORRECT_USER_CREDENTIALS }
            ];

            const store = mockStore({ "errorMessage": "" }, expectedActions, done, verify);
            let userActions = new UserProfileActions();
            store.dispatch(userActions.changePassword(userName, currentPassword, newPassword));
        });

        it("should dispatch the password updation failed reducer when the password change is failed", (done) => {
            ajaxClientPostMock.withArgs(headers, data).returns(Promise.reject({ "message": "Password updation failed" }));

            const expectedActions = [
                { "type": PASSWORD_UPDATION_FAILED }
            ];

            const store = mockStore({ "errorMessage": "" }, expectedActions, done, verify);
            let userActions = new UserProfileActions();
            store.dispatch(userActions.changePassword(userName, currentPassword, newPassword));
        });
    });


    describe("newPwdConfirmPwdMismatch", (done) => {
        it("should dispatch the action of new password does not match with confirm password", () => {
            const expectedActions = [
                { "type": NEW_PWD_CONFIRM_PWD_MISMATCH }
            ];

            const store = mockStore({ "errorMessage": "" }, expectedActions, done);
            let userActions = new UserProfileActions();
            store.dispatch(userActions.newPwdConfirmPwdMismatch());
        });
    });

    describe("newPasswordShouldNotMatchCurrentPwd", (done) => {
        it("should dispatch the action of new password should not match current password action", () => {
            const expectedActions = [
                { "type": NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD }
            ];

            const store = mockStore({ "errorMessage": "" }, expectedActions, done);
            let userActions = new UserProfileActions();
            store.dispatch(userActions.newPasswordShouldNotMatchCurrentPwd());
        });
    });
});
