export const SCAN_NEWS = "SCAN_NEWS";
export const WRITE_A_STORY = "WRITE_A_STORY";
export const CONFIGURE = "CONFIGURE";

export function setCurrentHeaderTab(currentHeaderTab) {
    return {
        "type": currentHeaderTab,
        currentHeaderTab
    };
}
