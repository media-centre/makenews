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
                this.replicateDb(this.dbParameters.getRemoteDbUrl(), this.dbParameters.getLocalDbUrl(), {
                    "retry": true,
                    "live": false
                }, true);
                resolve(session);
            });
        });
    }


    sync() {
        if(DbSession.localToRemoteReplication) {
            DbSession.localToRemoteReplication.cancel();
            DbSession.localToRemoteReplication = null;
        }

        DbSession.localToRemoteReplication = this.replicateDb(this.dbParameters.getLocalDbUrl(), this.dbParameters.getRemoteDbUrl(), {
            "retry": true,
            "live": true
        }, false);

        const THREEMINUTE = 180000;
        this.replicateRemoteDb(THREEMINUTE);
    }

    replicateRemoteDb(intervalTime) {
        setInterval(() => {
            let dbParameters = DbParameters.instance();
            this.replicateDb(dbParameters.getRemoteDbUrl(), dbParameters.getLocalDbUrl(), {
                "retry": false,
                "live": false
            });
        }, intervalTime);
    }


    replicateDb(fromDbUrl, toDbUrl, options, startSync = false) {
        console.log(fromDbUrl, toDbUrl, options, startSync);
        let fromDb = DbSession.newPouchDb(fromDbUrl);
        PouchDB.replicate(fromDb, toDbUrl, options).on("change", (info) => {
            // handle change
        }).on("paused", () => {
            // replication paused (e.g. user went offline)
        }).on("active", () => {
            // replicate resumed (e.g. user went back online)
        }).on("denied", (info) => {
            console.warn("replication denied", info);
            // a document failed to replicate, e.g. due to permissions
        }).on("complete", (info) => {
            console.log("completed, startSync = ", startSync);
            if(startSync) {
                console.log("started sync");
                DbSession.newLocalPouchDb().then(session => {
                    DbSession.db = session;
                    this.sync();
                }).catch(error => {
                    console.warn("error while creating db", error);
                });
            }
        }).on("error", (err) => {
            console.warn("replication errored", err);
            // handle error
        });
    }

    static new() {
        return new DbSession();
    }

    static newPouchDb(url) {
        return new PouchDB(url);
    }

    static newRemotePouchDb() {
        return new PouchDB(DbParameters.instance().getRemoteDbUrl());
    }

    static newLocalPouchDb() {
        return new PouchDB(DbParameters.instance().getLocalDbUrl(), { "auto_compaction": "true" });
    }

    static clearInstance() {
        DbSession.db = null;
        if(DbSession.localToRemoteReplication) {
            DbSession.localToRemoteReplication.cancel();
            DbSession.localToRemoteReplication = null;
        }
    }
}
