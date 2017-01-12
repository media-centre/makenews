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
    let twitterAuthenticated = false;
    try {
        let response = await ajaxClient.get();
        twitterAuthenticated = response.twitterAuthenticated;
    } catch(err) {
        //ignore error
    }
    return dispatch => {
        dispatch(twitterTokenInformation(twitterAuthenticated));
    };
}
