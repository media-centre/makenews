/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5], no-undefined: 0 */

import { INCORRECT_USER_CREDENTIALS, PASSWORD_UPDATION_FAILED, NEW_PWD_CONFIRM_PWD_MISMATCH, NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD, CHANGE_PASSWORD_SUCCESSFUL } from "../../src/js/user/UserProfileActions";
import Locale from "../../src/js/utils/Locale";
import { changePassword, changePasswordStrings, userProfileStrings } from "../../src/js/user/UserProfileReducer";
import { assert } from "chai";
import "../helper/TestHelper";
import sinon from "sinon";

describe("UserProfileReducer", ()=> {
    let sandbox = null, appEn = null;
    beforeEach("UserProfileReducer", () => {
        sandbox = sinon.sandbox.create();
        appEn = {
            "messages": {
                "changePassword": {
                    "passwordUpdateFailure": "Could not update the password",
                    "invalidCredentials": "Invalid credentials",
                    "newPwdConfirmPwdMismatch": "New password and confirm Password does not match",
                    "currentPassword": "current password",
                    "newPassword": "new password",
                    "confirmPassword": "confirm password",
                    "newPwdShouldNotMatchCurrentPwd": "New password should not be same as the current password",
                    "pwdChangeSuccessful": "Password successfully changed",
                    "pwdShouldNotBeEmpty": "Passwords should not be left blank"
                }
            }
        };

        sandbox.stub(Locale, "applicationStrings").returns(appEn);
    });

    afterEach("UserProfileReducer", () => {
        sandbox.restore();
    });

    describe("changePassword", () => {
        let defaultState = null;
        beforeEach("changePassword", () => {
            defaultState = { "errorMessage": "", "isSuccess": false };
        });

        it("should set the error message as empty by default", () => {
            assert.deepEqual(defaultState, changePassword(undefined));
        });

        it("should set the error message as empty if the change password is successful", () => {
            const action = { "type": CHANGE_PASSWORD_SUCCESSFUL };
            assert.deepEqual({ "errorMessage": "", "isSuccess": true }, changePassword(defaultState, action));
        });

        it("should set the invalid credentials error message incase of authorization failure", () => {
            const action = { "type": INCORRECT_USER_CREDENTIALS };
            assert.deepEqual({ "errorMessage": "Invalid credentials" }, changePassword(defaultState, action));
        });

        it("should set the password updation failed error message incase of updation failure", () => {
            const action = { "type": PASSWORD_UPDATION_FAILED };
            assert.deepEqual({ "errorMessage": "Could not update the password" }, changePassword(defaultState, action));
        });

        it("should set the invalid credentials error message in case of authorization failure", () => {
            const action = { "type": INCORRECT_USER_CREDENTIALS };
            assert.deepEqual({ "errorMessage": "Invalid credentials" }, changePassword(defaultState, action));
        });

        it("should set the new password and confirm password mismatch error message", () => {
            const action = { "type": NEW_PWD_CONFIRM_PWD_MISMATCH };
            assert.deepEqual({ "errorMessage": "New password and confirm Password does not match" }, changePassword(defaultState, action));
        });

        it("should set the new password should not match with current password error message", () => {
            const action = { "type": NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD };
            assert.deepEqual({ "errorMessage": "New password should not be same as the current password" }, changePassword(defaultState, action));
        });
    });

    describe("changePasswordStrings", () => {
        it("should return the change password strings always", () => {
            assert.deepEqual(appEn.messages.changePassword, changePasswordStrings(undefined));
        });
    });

    describe("userProfileStrings", () => {
        it("should return user profile strings", () => {
            assert.deepEqual(appEn.messages.userProfileStrings, userProfileStrings(undefined));
        });
    });
});
