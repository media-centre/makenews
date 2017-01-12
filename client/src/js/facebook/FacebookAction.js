import AjaxClient from "../utils/AjaxClient";
export const FACEBOOK_EXPIRE_TIME = "FACEBOOK_EXPIRE_TIME";

export function updateTokenExpireTime(expireTime) { //eslint-disable-line
    return {
        "type": FACEBOOK_EXPIRE_TIME,
        "expireTime": expireTime
    };
}

export async function getTokenExpireTime() { //eslint-disable-line
    let ajaxClient = AjaxClient.instance("/facebook-token-expire-time");
    let expireTime = 0;
    try {
        let response = await ajaxClient.get();
        expireTime = response.expireTime;
    } finally {
        return dispatch => { //eslint-disable-line
            dispatch(updateTokenExpireTime(expireTime));
        };
    }
}
