"use strict";
import AppSessionStorage from "../utils/AppSessionStorage.js";
import StringUtil from "../../../../common/src/util/StringUtil.js";
import CryptUtil from "../../../../server/src/util/CryptUtil";

export default class DbParameters {

    static instance() {
        return new DbParameters();
    }
    constructor() {
        this.appSession = AppSessionStorage.instance();
    }

    getLocalDbUrl() {
        if(this.localDbUrl === undefined) {
            let localDbUrl = this.appSession.getValue(AppSessionStorage.KEYS.USERNAME);
            if (StringUtil.isEmptyString(localDbUrl)) {
                throw new Error("local db url can not be empty");
            }
            this.localDbUrl = CryptUtil.dbNameHash(localDbUrl);
        }
        return this.localDbUrl;
    }

    getRemoteDbUrl() {
        let remoteDbUrl = this.appSession.getValue(AppSessionStorage.KEYS.REMOTEDBURL);
        if(StringUtil.isEmptyString(remoteDbUrl)) {
            throw new Error("remote db url can not be empty");
        }
        return remoteDbUrl + "/" + this.getLocalDbUrl();
    }
}
