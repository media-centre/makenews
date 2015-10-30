import fetch from "isomorphic-fetch";
import customAjax from "./utils/AjaxRequest"

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';

export function userLogin(userName, password) {
    return dispatch => {
        customAjax.request(
            {
                method: 'POST',
                url: '/login',
                data: {"username": userName, "password": password}
            })
            .then(succesData => {
                dispatch(loginSuccess());
            })
            .catch(errorData => {
                dispatch(loginFailed("invalid user name or password"));
            });
    }
}

export function loginSuccess() {
    return {type: LOGIN_SUCCESS};
}

export function loginFailed(responseMessage) {
    return {type: LOGIN_FAILED, responseMessage};
}
