/* eslint no-unused-vars:0, handle-callback-err:0 */

"use strict";
import DbParameters from "./config/DbParameters.js";
import PouchDB from "pouchdb";

export default class DbSession {
    static instance() {
        if(!this.db) {
            let dbParameters = DbParameters.instance();
            if(dbParameters.type() !== "PouchDB") {
                throw new Error("Unsupported database " + dbParameters.type());
            }
            this.db = new PouchDB(dbParameters.getLocalDb());
        }
        return this.db;
    }

    static sync() {
        DbSession.instance();

        if(this.currentSyn) {
            this.currentSyn.cancel();
        }
        let dbParameters = DbParameters.instance();
        this.currentSyn = PouchDB.sync(dbParameters.getLocalDb(), dbParameters.getRemoteDb(), {
            "live": true,
            "retry": true
        }).on("change", (info) => {
            // handle change
        }).on("paused", () => {
            // replication paused (e.g. user went offline)
        }).on("active", () => {
            // replicate resumed (e.g. user went back online)
        }).on("denied", (info) => {
            // a document failed to replicate, e.g. due to permissions
        }).on("complete", (info) => {
            // handle complete
        }).on("error", (err) => {
            // handle error
        });
    }
}
