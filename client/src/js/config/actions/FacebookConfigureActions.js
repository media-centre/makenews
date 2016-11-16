export const FACEBOOK_SEARCH_SOURCES = "FACEBOOK_SEARCH_SOURCES";

export function facebookSearchSources(keyword) {
    return {
        "type": FACEBOOK_SEARCH_SOURCES,
        "keyword": keyword
    };
}
