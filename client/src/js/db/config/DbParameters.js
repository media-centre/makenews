"use strict";
import EnvironmentConfig from "../../EnvironmentConfig.js";

export default class DbParameters {
    type() {
        return "PouchDB";
    }

    setLocalDb(dbUrl) {
        if(!dbUrl) {
            throw new Error("db url can not be empty = " + dbUrl);
        }
        if(!this.dbUrl) {
            this.dbUrl = dbUrl;
        }
    }

    getLocalDb() {
        if(!this.dbUrl) {
            throw new Error("db url not set yet.");
        }
        return this.dbUrl;
    }

    getRemoteDb() {
        let remoteDb = EnvironmentConfig.instance().get("remoteDbUrl");
        return remoteDb + "/" + this.dbUrl;
    }

    static instance() {
        if(!this.dbParameters) {
            this.dbParameters = new DbParameters();
        }
        return this.dbParameters;
    }

}
