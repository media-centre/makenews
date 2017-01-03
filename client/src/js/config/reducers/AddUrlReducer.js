import { RSS_ADD_URL_STATUS } from "./../actions/AddUrlActions";

export function addUrlMessage(state = { "message": "", "added": false }, action = {}) {
    switch (action.type) {
    case RSS_ADD_URL_STATUS: {
        return action.status;
    }
    default: return state;
    }
}
