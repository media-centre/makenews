import AjaxClient from "../utils/AjaxClient";
export const FACEBOOK_EXPIRE_TIME = "FACEBOOK_EXPIRE_TIME";

export function updateTokenExpireTime(expires_after) { //eslint-disable-line
    return {
        "type": FACEBOOK_EXPIRE_TIME,
        "expires_after": expires_after //eslint-disable-line
    };
}

export function getExpiresTime() { //eslint-disable-line
    return dispatch => {
        let ajaxClient = AjaxClient.instance("/facebook-token-expire-time");
        ajaxClient.get().then(response => {
            dispatch(updateTokenExpireTime(response.expires_after));
        }).catch(error => { //eslint-disable-line
            let ZERO = 0;
            dispatch(updateTokenExpireTime(ZERO));
        });
    };
}
