import { INCORRECT_USER_CREDENTIALS, PASSWORD_UPDATION_FAILED, NEW_PWD_CONFIRM_PWD_MISMATCH, NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD, CHANGE_PASSWORD_SUCCESSFUL } from "./UserProfileActions";
import Locale from "../utils/Locale";

export function changePassword(state = { "errorMessage": "", "isSuccess": false }, action = {}) {
    let appEn = Locale.applicationStrings();
    switch(action.type) {
    case INCORRECT_USER_CREDENTIALS:
        return {
            "errorMessage": appEn.messages.changePassword.invalidCredentials
        };

    case PASSWORD_UPDATION_FAILED:
        return {
            "errorMessage": appEn.messages.changePassword.passwordUpdateFailure
        };

    case NEW_PWD_CONFIRM_PWD_MISMATCH:
        return {
            "errorMessage": appEn.messages.changePassword.newPwdConfirmPwdMismatch
        };

    case NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD:
        return {
            "errorMessage": appEn.messages.changePassword.newPwdShouldNotMatchCurrentPwd
        };

    case CHANGE_PASSWORD_SUCCESSFUL:
        return { "errorMessage": "", "isSuccess": true };

    default:
        return state;
    }
}
