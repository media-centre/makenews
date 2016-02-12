"use strict";
import Migration from "../Migration.js";
import CouchClient from "../../CouchClient.js";

export default class AddSourceTypeFilter {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.couchClient = CouchClient.instance(dbName, accessToken);
    }

    up() {
        return new Promise((resolve, reject) => {
            this.couchClient.getDocument("surf-filter-id").then((responseJson) => {
                responseJson.sourceTypes = [];
                this.couchClient.saveDocument("surf-filter-id", responseJson).then(response => {
                    Migration.logger(this.dbName).info("AddSourceTypeFilter::up - response %j", response);
                    resolve(response);
                }).catch(error => {
                    Migration.logger(this.dbName).error("AddSourceTypeFilter::up - error %j", error);
                    reject(error);
                });
            }).catch(error => {
                Migration.logger(this.dbName).error("AddSourceTypeFilter::up - error %j", error);
                reject(error);
            });
        });
    }
}
