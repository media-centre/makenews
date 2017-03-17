import AjaxClient from "../utils/AjaxClient";
export const TWITTER_AUTHENTICATION = "TWITTER_AUTHENTICATION";

export function twitterTokenInformation(twitterAuthenticated) {
    return {
        "type": TWITTER_AUTHENTICATION,
        "twitterAuthenticated": twitterAuthenticated
    };
}

export async function twitterAuthentication() {
    const ajaxClient = AjaxClient.instance("/twitter-token");
    let twitterAuthenticated = false;
    try {
        const response = await ajaxClient.get();
        twitterAuthenticated = response.twitterAuthenticated;
    } catch(err) {
        //ignore error
    }
    return dispatch => {
        dispatch(twitterTokenInformation(twitterAuthenticated));
    };
}
