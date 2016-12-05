import AjaxClient from "./../../utils/AjaxClient";

export const GOT_CONFIGURED_SOURCES = "GOT_CONFIGURED_SOURCES";

export function configuredSourcesReceived(sources) {
    return {
        "type": GOT_CONFIGURED_SOURCES,
        "sources": sources
    };
}
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
