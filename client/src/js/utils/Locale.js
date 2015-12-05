"use strict";
import appEn from "../../../config/appEn.js";

export default class Locale {
    static applicationStrings(language = Locale.languages.ENGLISH) {
        if(!language) {
            throw new Error("language can not be null");
        }
        switch(language) {
        case Locale.languages.ENGLISH:
            return appEn;
        default:
            return appEn;
        }
    }
}

Locale.languages = {
    "ENGLISH": "en"
}
;
