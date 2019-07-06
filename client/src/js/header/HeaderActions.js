export const SCAN_NEWS = "Scanne deine News";
export const WRITE_A_STORY = "Schreibe eine Story";
export const CONFIGURE = "Einstellungen";
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
