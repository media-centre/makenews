import AjaxClient from "../utils/AjaxClient";
export const CHANGE_PASSWORD_SUCCESSFUL = "CHANGE_PASSWORD_SUCCESSFUL";
export const INCORRECT_USER_CREDENTIALS = "INCORRECT_USER_CREDENTIALS";
export const PASSWORD_UPDATION_FAILED = "PASSWORD_UPDATION_FAILED";
export const NEW_PWD_CONFIRM_PWD_MISMATCH = "NEW_PWD_CONFIRM_PWD_MISMATCH";
export const NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD = "NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD";

export function changePassword(currentPassword, newPassword) {
    return async(dispatch) => {
        try {
            const ajax = AjaxClient.instance("/change-password");
            const headers = {
                "Accept": "application/json",
                "Content-type": "application/json"
            };
            await ajax.post(headers, { currentPassword, newPassword });
            dispatch({ "type": CHANGE_PASSWORD_SUCCESSFUL });
        } catch (error) {
            if (error.message === "Incorrect user credentials") {
                dispatch({ "type": INCORRECT_USER_CREDENTIALS });
            } else {
                dispatch({ "type": PASSWORD_UPDATION_FAILED });
            }
        }
    };
}

export function newPwdConfirmPwdMismatchAction() {
    return dispatch => {
        dispatch({ "type": NEW_PWD_CONFIRM_PWD_MISMATCH });
    };
}

export function newPasswordShouldNotMatchCurrentPwdAction() {
    return dispatch => {
        dispatch({ "type": NEW_PWD_SHOULD_NOT_MATCH_CURRENT_PWD });
    };
}
