import { FACEBOOK_GOT_PROFILES, FACEBOOK_ADD_PROFILE, FACEBOOK_GOT_CONFIGURED_PROFILES } from "./../actions/FacebookConfigureActions";
import { List } from "immutable";

export const facebookConfiguredUrls = (state = { "profiles": [], "pages": [], "groups": [] }, action = {}) => {
    switch (action.type) {
    case FACEBOOK_ADD_PROFILE: {
        return Object.assign({}, state, { "profiles": List(state.profiles).push(action.profile).toArray() }); //eslint-disable-line new-cap
    }
    case FACEBOOK_GOT_CONFIGURED_PROFILES: {
        return Object.assign({}, state, { "profiles": action.profiles });
    }
    default: return state;
    }
};

export const facebookProfiles = (state = [], action = {}) => {
    switch(action.type) {
    case FACEBOOK_GOT_PROFILES: {
        return action.profiles;
    }
    case FACEBOOK_ADD_PROFILE: {
        return Object.assign([], addSource(state, action.profile.id));
    }
    default: return state;
    }
};

function addSource(profiles, id) {
    profiles.find(profile => profile.id === id).added = true;
    return profiles;
}
