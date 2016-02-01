/* eslint no-unused-vars:0, handle-callback-err:0, no-console:0 */

"use strict";
import DbParameters from "./DbParameters.js";
import UserSession from "../user/UserSession.js";
import PouchDB from "pouchdb";

export default class DbSession {
    static instance() {
        UserSession.instance().setLastAccessedTime();
        return new Promise((resolve, reject) => {
            if(this.db) {
                resolve(this.db);
            } else {
                DbSession.new().remoteDbInstance().then(session => {
                    this.db = session;
                    resolve(session);
                });
            }
        });
    }

    constructor() {
        this.dbParameters = DbParameters.instance();
    }

    remoteDbInstance() {
        return new Promise((resolve, reject) => {
            DbSession.newRemotePouchDb().then(session => {
                this.replicateRemoteDb();
                resolve(session);
            });
        });
    }


    sync() {
        if(DbSession.currentSyn) {
            DbSession.currentSyn.cancel();
            DbSession.currentSyn = null;
        }

        DbSession.currentSyn = PouchDB.sync(this.dbParameters.getLocalDbUrl(), this.dbParameters.getRemoteDbUrl(), {
            "live": true,
            "retry": true
        }).on("change", (info) => {
            // handle change
        }).on("paused", () => {
            // replication paused (e.g. user went offline)
        }).on("active", () => {
            // replicate resumed (e.g. user went back online)
        }).on("denied", (info) => {
            console.warn("replication denied", info);
            // a document failed to replicate, e.g. due to permissions
        }).on("complete", (info) => {
            // handle complete
        }).on("error", (err) => {
            console.warn("replication errored", err);
        });
    }

    replicateRemoteDb() {
        PouchDB.replicate(this.dbParameters.getRemoteDbUrl(), this.dbParameters.getLocalDbUrl(), {
            "retry": true
        }).on("change", (info) => {
            // handle change
        }).on("paused", () => {
            // replication paused (e.g. user went offline)
        }).on("active", () => {
            // replicate resumed (e.g. user went back online)
        }).on("denied", (info) => {
            console.warn("replication denied", info);
            // a document failed to replicate, e.g. due to permissions
        }).on("complete", (info) => {
            DbSession.newLocalPouchDb().then(session => {
                DbSession.db = session;
                this.sync();
            }).catch(error => {
                console.warn("error while creating db", error);
            });
            // handle complete
        }).on("error", (err) => {
            console.warn("replication errored", err);
            // handle error
        });
    }

    static new() {
        return new DbSession();
    }

    static newRemotePouchDb() {
        return new PouchDB(DbParameters.instance().getRemoteDbUrl());
    }

    static newLocalPouchDb() {
        return new PouchDB(DbParameters.instance().getLocalDbUrl(), { "auto_compaction": "true" });
    }

    static clearInstance() {
        DbSession.db = null;
        if(DbSession.currentSyn) {
            DbSession.currentSyn.cancel();
            DbSession.currentSyn = null;
        }
    }
}
