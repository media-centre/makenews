"use strict";
import StringUtil from "../../../../common/src/util/StringUtil.js";

export default class DbParameters {
    static instance(localDbUrl, remoteDbUrl) {
        if(!this.dbParameters) {
            this.dbParameters = new DbParameters(localDbUrl, remoteDbUrl);
        }
        return this.dbParameters;
    }

    static clearInstance() {
        this.dbParameters = null;
    }

    constructor(localDbUrl, remoteDbUrl) {
        if(StringUtil.isEmptyString(localDbUrl) || StringUtil.isEmptyString(remoteDbUrl)) {
            throw new Error("db parameters can not be empty");
        }
        this.localDbUrl = localDbUrl;
        this.remoteDbUrl = remoteDbUrl + "/" + localDbUrl;
    }

    type() {
        return "PouchDB";
    }

    getLocalDb() {
        return this.localDbUrl;
    }

    getRemoteDb() {
        return this.remoteDbUrl;
    }
}
