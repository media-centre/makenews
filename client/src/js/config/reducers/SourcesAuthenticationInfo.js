import { FACEBOOK_EXPIRE_INFO } from "../../facebook/FacebookAction";
import { TWITTER_AUTHENTICATION } from "../../twitter/TwitterTokenActions";

export function sourcesAuthenticationInfo(state = {}, action = {}) {
    switch(action.type) {
    case FACEBOOK_EXPIRE_INFO:
        return Object.assign({}, state, { "facebook": action.isValid });
    case TWITTER_AUTHENTICATION:
        return Object.assign({}, state, { "twitter": action.twitterAuthenticated });
    default:
        return state;
    }
}
