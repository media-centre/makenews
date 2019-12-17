import {
    CHANGE_PASSWORD_SUCCESSFUL,
    INCORRECT_USER_CREDENTIALS,
    PASSWORD_UPDATION_FAILED,
    NEW_PWD_CONFIRM_PWD_MISMATCH,
    NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD,
    newPwdConfirmPwdMismatchAction,
    newPasswordShouldNotMatchCurrentPwdAction,
    changePassword
} from "../../src/js/user/UserProfileActions";
import AjaxClient from "../../src/js/utils/AjaxClient";
import mockStore from "../helper/ActionHelper";
import "../helper/TestHelper";
import sinon from "sinon";

describe("UserProfileActions", ()=> {
    let sandbox = null;
    beforeEach("UserProfileActions", () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach("UserProfileActions", () => {
        sandbox.restore();
    });

    describe("changePassword", () => {
        let url = null;
        let headers = null;
        let data = null;
        const currentPassword = null;
        const newPassword = null;
        let ajaxClient = null;
        let ajaxClientPostMock = null;
        let verify = null;
        beforeEach("changePassword", () => {
            url = "/change-password";
            headers = {
                "Accept": "application/json",
                "Content-type": "application/json"
            };
            data = { currentPassword, newPassword };

            ajaxClient = new AjaxClient(url);
            sandbox.stub(AjaxClient, "instance").withArgs(url).returns(ajaxClient);
            ajaxClientPostMock = sandbox.mock(ajaxClient).expects("post");
            verify = function() {
                ajaxClientPostMock.verify();
            };

        });

        it("should dispatch the change password successful reducer when the password change from server is successful", (done) => {
            ajaxClientPostMock.withArgs(headers, data).returns(Promise.resolve("change password successful"));
            const expectedActions = [
                { "type": CHANGE_PASSWORD_SUCCESSFUL }
            ];

            const store = mockStore({ "errorMessage": "" }, expectedActions, done, verify);
            store.dispatch(changePassword(currentPassword, newPassword));
        });

        it("should dispatch the incorrect credentials reducer when the password change is failed", (done) => {
            ajaxClientPostMock.withArgs(headers, data).returns(Promise.reject({ "message": "Incorrect user credentials" }));

            const expectedActions = [
                { "type": INCORRECT_USER_CREDENTIALS }
            ];

            const store = mockStore({ "errorMessage": "" }, expectedActions, done, verify);
            store.dispatch(changePassword(currentPassword, newPassword));
        });

        it("should dispatch the password updation failed reducer when the password change is failed", (done) => {
            ajaxClientPostMock.withArgs(headers, data).returns(Promise.reject({ "message": "Password updation failed" }));

            const expectedActions = [
                { "type": PASSWORD_UPDATION_FAILED }
            ];

            const store = mockStore({ "errorMessage": "" }, expectedActions, done, verify);
            store.dispatch(changePassword(currentPassword, newPassword));
        });
    });

    describe("newPwdConfirmPwdMismatch", () => {
        it("should dispatch the action of new password does not match with confirm password", (done) => {
            const expectedActions = [
                { "type": NEW_PWD_CONFIRM_PWD_MISMATCH }
            ];

            const store = mockStore({ "errorMessage": "" }, expectedActions, done);
            store.dispatch(newPwdConfirmPwdMismatchAction());
        });
    });

    describe("newPasswordShouldNotMatchCurrentPwd", () => {
        it("should dispatch the action of new password should not match current password action", (done) => {
            const expectedActions = [
                { "type": NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD }
            ];

            const store = mockStore({ "errorMessage": "" }, expectedActions, done);
            store.dispatch(newPasswordShouldNotMatchCurrentPwdAction());
        });
    });
});
