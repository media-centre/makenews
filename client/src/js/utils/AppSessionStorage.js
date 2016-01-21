"use strict";
import StringUtil from "../../../../common/src/util/StringUtil.js";

export default class AppSessionStorage {
    static instance() {
        return new AppSessionStorage();
    }

    setValue(key, value) {
        if(StringUtil.isEmptyString(key) || !value) {
            throw new Error("Key or value cannot be empty");
        }
        this.getLocalStorage().setItem(key, value);
    }

    getValue(key) {
        if(StringUtil.isEmptyString(key)) {
            throw new Error("Key cannot be empty");
        }
        return this.getLocalStorage().getItem(key);
    }

    getLocalStorage() {
        return window.localStorage;
    }

    remove(key) {

        this.getLocalStorage().removeItem(key);
    }

    clear() {
        this.remove(AppSessionStorage.KEYS.USERNAME);
        this.remove(AppSessionStorage.KEYS.REMOTEDBURL);
    }
}

AppSessionStorage.KEYS = {
    "USERNAME": "UserName",
    "REMOTEDBURL": "RemoteUrl"
};
