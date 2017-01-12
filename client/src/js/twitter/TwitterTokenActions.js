import AjaxClient from "../utils/AjaxClient";
export const TWITTER_AUTHENTICATION = "TWITTER_AUTHENTICATION";

export function twitterTokenInformation(twitterAuthenticated) { //eslint-disable-line
    return {
        "type": TWITTER_AUTHENTICATION,
        "twitterAuthenticated": twitterAuthenticated
    };
}

export async function twitterAuthentication() { //eslint-disable-line
    let ajaxClient = AjaxClient.instance("/twitter-token");
    let expiryTime = 0;
    try {
        let response = ajaxClient.get();
        expiryTime = response.twitterAuthenticated;
    } finally {
        return dispatch => { //eslint-disable-line
            dispatch(twitterTokenInformation(expiryTime));
        };
    }
}
