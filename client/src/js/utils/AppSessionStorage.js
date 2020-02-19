/* eslint react/jsx-wrap-multilines:0*/
import StringUtil from "../../../../common/src/util/StringUtil";

export default class AppSessionStorage {
    static instance() {
        return new AppSessionStorage();
    }

    setValue(key, value) {
        if(StringUtil.isEmptyString(key) || typeof value === "undefined" || value === "") {
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
        return localStorage;
    }

    remove(key) {
        this.getLocalStorage().removeItem(key);
    }
}

AppSessionStorage.KEYS = {
    "LAST_RENEWED_TIME": "LastRenewedTime",
    "USER_NAME": "UserName",
    "FIRST_TIME_USER": "FirstTimeUser"
};
