import { ADD_URL_STATUS } from "./../actions/AddUrlActions";

export function showAddUrl(state = false, action = {}) {
    switch (action.type) {
    case ADD_URL_STATUS: {
        return action.status;
    }
    default: return state;
    }
}
