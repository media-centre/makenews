export const SCAN_NEWS = "Scan News";
export const WRITE_A_STORY = "Write a Story";
export const CONFIGURE = "Configure";

export function setCurrentHeaderTab(currentHeaderTab) {
    return {
        "type": currentHeaderTab,
        currentHeaderTab
    };
}
