import {
    FACEBOOK_GOT_SOURCES,
    FACEBOOK_ADD_PROFILE,
    FACEBOOK_ADD_PAGE,
    FACEBOOK_ADD_GROUP
} from "./../actions/FacebookConfigureActions";
import { CLEAR_SOURCES } from "./../../sourceConfig/actions/SourceConfigurationActions";
import { List } from "immutable";

export const facebookSources = (state = { "data": [], "nextPage": {} }, action = {}) => {
    switch(action.type) {
    case FACEBOOK_GOT_SOURCES: {
        return Object.assign({}, state, { "data": List(state.data).concat(action.sources.data).toArray(), "nextPage": action.sources.paging }); //eslint-disable-line new-cap
    }
    case CLEAR_SOURCES: {
        return { "data": [], "nextPage": {} };
    }

    case FACEBOOK_ADD_PROFILE:
    case FACEBOOK_ADD_PAGE:
    case FACEBOOK_ADD_GROUP: {
        return Object.assign({}, state, { "data": _addSource(state.data, action.sources) });
    }

    default: return state;
    }
};

function _addSourceProps(source) {
    source._id = source.id;
    source.added = true;
    delete source.id;
}

function _addSource(sources, sourcesToConfigure) {
    if(sources.length === sourcesToConfigure.length) {
        return sourcesToConfigure.map(source => {
            if(!source._id) {
                _addSourceProps(source);
            }
            return source;
        });
    }
    let [sourceToConfigure] = sourcesToConfigure;
    let addedSource = sources.find(source => source.id === sourceToConfigure.id);
    _addSourceProps(addedSource);
    return sources;
}
