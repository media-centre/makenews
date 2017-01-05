import { TWITTER_AUTHENTICATION } from "../../twitter/TwitterTokenActions";

export function twitterTokenInfo(state = { "twitterAuthenticated": false }, action = {}) {
    switch(action.type) {
    case TWITTER_AUTHENTICATION:
        return Object.assign({}, state, { "twitterAuthenticated": action.twitterAuthenticated });
    default:
        return state;
    }
}
