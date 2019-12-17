import AjaxClient from "../utils/AjaxClient";
export const FACEBOOK_EXPIRE_INFO = "FACEBOOK_EXPIRE_INFO";

export function updateTokenExpiredInfo(isValid) {
    return {
        "type": FACEBOOK_EXPIRE_INFO,
        isValid
    };
}

export async function isFBTokenExpired() {
    const ajaxClient = AjaxClient.instance("/facebook-token-expired");
    let isExpired = false;
    try {
        const response = await ajaxClient.get();
        isExpired = !response.isExpired;
    } catch(err) {
        //ignore error
    }
    return dispatch => {
        dispatch(updateTokenExpiredInfo(isExpired));
    };
}
