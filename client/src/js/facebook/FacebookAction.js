import AjaxClient from "../utils/AjaxClient";
export const FACEBOOK_EXPIRE_TIME = "FACEBOOK_EXPIRE_TIME";

export function updateTokenExpireTime(expireTime) { //eslint-disable-line
    return {
        "type": FACEBOOK_EXPIRE_TIME,
        "expireTime": expireTime
    };
}

export function getExpiresTime() { //eslint-disable-line
    return dispatch => {
        let ajaxClient = AjaxClient.instance("/facebook-token-expire-time");
        ajaxClient.get().then(response => {
            dispatch(updateTokenExpireTime(response.expireTime));
        }).catch(error => { //eslint-disable-line
            let ZERO = 0;
            dispatch(updateTokenExpireTime(ZERO));
        });
    };
}
