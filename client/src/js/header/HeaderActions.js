export const SCAN_NEWS = "Scan News";
export const WRITE_A_STORY = "Write a Story";
export const CONFIGURE = "Configure";
export const POP_UP = "POP_UP";

export function setCurrentHeaderTab(currentHeaderTab) {
    return {
        "type": currentHeaderTab,
        currentHeaderTab
    };
}

export function popUp(message = "", callback = () => {}, hide = false) {
    return {
        "type": POP_UP,
        message,
        callback,
        hide
    };
}
