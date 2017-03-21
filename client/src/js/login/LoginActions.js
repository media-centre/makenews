import AjaxClient from "../utils/AjaxClient";
import UserSession from "../user/UserSession";
import AppSessionStorage from "./../utils/AppSessionStorage";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";

export function userLogin(history, userName, password) {
    return async dispatch => {
        const ajax = AjaxClient.instance("/login", true);
        const headers = {
            "Accept": "application/json",
            "Content-type": "application/json"
        };
        const data = { "username": userName, "password": password };
        try {
            const response = await ajax.post(headers, data);
            const userSession = UserSession.instance();
            userSession.init(dispatch);
            dispatch(loginSuccess());
            const sessionStorage = AppSessionStorage.instance();
            sessionStorage.setValue(AppSessionStorage.KEYS.USER_NAME, userName);
            if(response.firstTimeUser) {
                history.push("/onboard");
                sessionStorage.setValue(AppSessionStorage.KEYS.FIRST_TIME_USER, true);
            } else {
                history.push("/newsBoard");
            }
        } catch(errorData) {
            dispatch(loginFailed("Invalid user name or password"));
        }
    };
}

export function loginSuccess() {
    return { "type": LOGIN_SUCCESS };
}

export function loginFailed(responseMessage) {
    return { "type": LOGIN_FAILED, responseMessage };
}
