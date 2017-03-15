
import AjaxClient from "../utils/AjaxClient";
import UserSession from "../user/UserSession";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";

export function userLogin(history, userName, password) {
    return dispatch => {
        let ajax = AjaxClient.instance("/login", true);
        const headers = {
            "Accept": "application/json",
            "Content-type": "application/json"
        };
        const data = { "username": userName, "password": password };
        ajax.post(headers, data)
            .then(() => {
                let userSession = UserSession.instance();
                userSession.init(dispatch);
                localStorage.setItem("userName", userName);
                dispatch(loginSuccess());
                history.push("/newsBoard");
            })
            .catch(errorData => { //eslint-disable-line no-unused-vars
                dispatch(loginFailed("Invalid user name or password"));
            });
    };
}

export function loginSuccess() {
    return { "type": LOGIN_SUCCESS };
}

export function loginFailed(responseMessage) {
    return { "type": LOGIN_FAILED, responseMessage };
}
