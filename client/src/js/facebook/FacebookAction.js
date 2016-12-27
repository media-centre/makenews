export const FACEBOOK_EXPIRE_TIME = "FACEBOOK_EXPIRE_TIME";

export function updateTokenExpireTime(expires_after) { //eslint-disable-line
    return {
        "type": FACEBOOK_EXPIRE_TIME,
        "expires_after": expires_after //eslint-disable-line
    };
}
