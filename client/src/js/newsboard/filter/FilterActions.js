export const CURRENT_FILTER = "CURRENT_FILTER";
export const FILTERED_SOURCES = "FILTERED_SOURCES";
export const REMOVE_SOURCE = "REMOVE_SOURCE";

export const filterTabSwitch = currentTab => ({
    "type": CURRENT_FILTER, currentTab
});

export const filteredSources = sources => ({
    "type": FILTERED_SOURCES, sources
});

export const removeSource = (sourceId, sourceType) => ({
    "type": REMOVE_SOURCE, sourceId, sourceType
});

