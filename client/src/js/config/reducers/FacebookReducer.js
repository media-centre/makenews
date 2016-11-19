import { FACEBOOK_GOT_PROFILES, FACEBOOK_ADD_PROFILE } from "./../actions/FacebookConfigureActions";
import { List } from "immutable";

export const facebookConfiguredUrls = (state = { "profiles": [], "pages": [], "groups": [] }, action = {}) => {
    switch (action.type) {
    case FACEBOOK_ADD_PROFILE: {
        return Object.assign({}, state, { "profiles": List(state.profiles).push(action.profile).toArray() }); //eslint-disable-line new-cap
    }
    default: return state;
    }
};

export const facebookProfiles = (state = [], action = {}) => {
    switch(action.type) {
    case FACEBOOK_GOT_PROFILES: {
        return action.profiles;
    }
    default: return state;
    }
};
