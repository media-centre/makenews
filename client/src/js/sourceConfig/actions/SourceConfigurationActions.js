import AjaxClient from "./../../utils/AjaxClient";

export const GOT_CONFIGURED_SOURCES = "GOT_CONFIGURED_SOURCES";
export const HAS_MORE_SOURCE_RESULTS = "HAS_MORE_SOURCE_RESULTS";
export const NO_MORE_SOURCE_RESULTS = "NO_MORE_SOURCE_RESULTS";
export const CLEAR_SOURCES = "CLEAR_SOURCES";

export function configuredSourcesReceived(sources) {
    return {
        "type": GOT_CONFIGURED_SOURCES,
        "sources": sources
    };
}

export const noMoreSourceResults = () => {
    return {
        "type": NO_MORE_SOURCE_RESULTS
    };
};

export const hasMoreSourceResults = () => {
    return {
        "type": HAS_MORE_SOURCE_RESULTS
    };
};


export const clearSources = () => {
    return {
        "type": CLEAR_SOURCES
    };
};

export function getConfiguredSources() {
    let ajaxClient = AjaxClient.instance("/configuredSources", false);
    return async dispatch => {
        let sources = [];
        try {
            sources = await ajaxClient.get();
        } catch (err) {
            sources = [];
        }
        dispatch(configuredSourcesReceived(sources));
    };
}
