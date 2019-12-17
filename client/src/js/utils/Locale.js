import AppWindow from "./AppWindow";

export default class Locale {
    static applicationStrings(language = Locale.languages.ENGLISH) {
        if(!language) {
            throw new Error("language can not be null");
        }
        const appWindowInstance = AppWindow.instance();
        switch(language) {
        case Locale.languages.ENGLISH:
            return appWindowInstance.get("appEn");
        default:
            return appWindowInstance.get("appEn");
        }
    }
}

Locale.languages = {
    "ENGLISH": "en"
};
