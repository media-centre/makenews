import AjaxClient from "../utils/AjaxClient";
export const TWITTER_AUTHENTICATION = "TWITTER_AUTHENTICATION";

export function twitterTokenInformation(twitterAuthenticated) { //eslint-disable-line
    return {
        "type": TWITTER_AUTHENTICATION,
        "twitterAuthenticated": twitterAuthenticated
    };
}

export function twitterAuthentication() { //eslint-disable-line
    return dispatch => {
        let ajaxClient = AjaxClient.instance("/twitter-token");
        ajaxClient.get().then(response => {
            dispatch(twitterTokenInformation(response.twitterAuthenticated));
        }).catch(error => { //eslint-disable-line
            dispatch(twitterTokenInformation(false));
        });
    };
}
