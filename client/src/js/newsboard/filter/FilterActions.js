export const CURRENT_FILTER = "CURRENT_FILTER";
export const FILTERED_SOURCES = "FILTERED_SOURCES";

export const filterTabSwitch = currentTab => ({
    "type": CURRENT_FILTER, currentTab
});

export const filteredSources = sources => ({
    "type": FILTERED_SOURCES, sources
});

