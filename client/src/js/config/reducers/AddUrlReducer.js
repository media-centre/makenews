import { MESSAGE } from "./../actions/AddUrlActions";
export const addUrlMessage = (state = "", action = {}) => {
    switch (action.type) {
    case MESSAGE: {
        return action.message;
    }
    default: return state;
    }
};
