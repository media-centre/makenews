"use strict";
import AppSessionStorage from "../utils/AppSessionStorage.js";
import StringUtil from "../../../../common/src/util/StringUtil.js";

export default class DbParameters {

    static instance() {
        return new DbParameters();
    }
    constructor() {
        this.appSession = AppSessionStorage.instance();
    }

    getLocalDbUrl() {
        let localDbUrl = this.appSession.getValue(AppSessionStorage.KEYS.USERNAME);
        if(StringUtil.isEmptyString(localDbUrl)) {
            throw new Error("local db url can not be empty");
        }
        return localDbUrl;
    }

    getRemoteDbUrl() {
        let remoteDbUrl = this.appSession.getValue(AppSessionStorage.KEYS.REMOTEDBURL);
        if(StringUtil.isEmptyString(remoteDbUrl)) {
            throw new Error("remote db url can not be empty");
        }
        return remoteDbUrl + "/" + this.getLocalDbUrl();
    }
}
