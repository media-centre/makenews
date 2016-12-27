import { FACEBOOK_EXPIRE_TIME } from "../../facebook/FaceBookAction";

export function tokenExpiresTime(state = { "expiresTime": 0 }, action = {}) {
    switch(action.type) {
    case FACEBOOK_EXPIRE_TIME:
        return Object.assign({}, state, { "expiresTime": action.expires_after });
    default:
        return state;
    }
}
