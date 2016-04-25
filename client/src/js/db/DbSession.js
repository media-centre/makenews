/* eslint no-unused-vars:0, handle-callback-err:0, no-console:0 */

"use strict";
import DbParameters from "./DbParameters.js";
import UserSession from "../user/UserSession.js";
import FeedDb from "../feeds/db/FeedDb.js";
import PouchDB from "pouchdb";

export default class DbSession {
    static instance() {
        UserSession.instance().continueSessionIfActive();
        return new Promise((resolve, reject) => {
            if(this.db) {
                resolve(this.db);
            } else {
                const TWOSECONDS = 2000;
                if(this.initialized) {
                    let dbSessionCheckInterval = setInterval(() => {
                        if(this.db) {
                            clearInterval(dbSessionCheckInterval);
                            resolve(this.db);
                        }
                    }, TWOSECONDS);
                } else {
                    this.initialized = true;

                    var dbSession = DbSession.new(); //eslint-disable-line vars-on-top
                    dbSession.dbParameters.getRemoteDbUrl().then(remoteDbUrl => {
                        DbSession.remoteDbUrl = remoteDbUrl;
                        dbSession.dbParameters.getLocalDbUrl().then(localDbUrl => {
                            DbSession.localDbUrl = localDbUrl;
                            dbSession.remoteDbInstance().then(session => { //eslint-disable-line max-nested-callbacks
                                this.db = session;
                                resolve(session);
                            });
                        });
                    });
                }
            }
        });
    }

    constructor() {
        this.dbParameters = DbParameters.instance();
    }

    remoteDbInstance() {
        return new Promise((resolve, reject) => {
            DbSession.newRemotePouchDb().then(session => {
                this.replicateDb(DbSession.remoteDbUrl, DbSession.localDbUrl, {
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
        const THREEMINUTE = 180000;
        this.replicateRemoteDb(THREEMINUTE);
        this._deleteOldFeeds();
        DbSession.localToRemoteReplication = this.replicateDb(DbSession.localDbUrl, DbSession.remoteDbUrl, {
            "retry": true,
            "live": true
        }, false);
    }

    _deleteOldFeeds() {
        FeedDb.deletePastFeeds();
    }

    replicateRemoteDb(intervalTime) {
        DbSession.remoteToLocalTimeInterval = setInterval(() => {
            if (DbSession.remoteToLocalReplication) {
                DbSession.remoteToLocalReplication.cancel();
                DbSession.remoteToLocalReplication = null;
            }
            DbSession.remoteToLocalReplication = this.replicateDb(DbSession.remoteDbUrl, DbSession.localDbUrl, {
                "retry": false,
                "live": false
            });
        }, intervalTime);
    }


    replicateDb(fromDbUrl, toDbUrl, options, startSync = false) {
        let fromDb = DbSession.newPouchDb(fromDbUrl);
        return fromDb.sync(toDbUrl, options).on("change", (info) => {
        //PouchDB.replicate(fromDb, toDbUrl, options).on("change", (info) => {
            // handle change
        }).on("paused", () => {
            // replication paused (e.g. user went offline)
        }).on("active", () => {
            // replicate resumed (e.g. user went back online)
        }).on("denied", (info) => {
            console.warn("replication denied", info);
            // a document failed to replicate, e.g. due to permissions
        }).on("complete", (info) => {
            if(startSync) {
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
        return new Promise(resolve => {
            resolve(new PouchDB(DbSession.remoteDbUrl));
        });
    }

    static newLocalPouchDb() {
        return new Promise(resolve => {
            resolve(new PouchDB(DbSession.localDbUrl, { "auto_compaction": true, "cache": false }));
        });
    }

    static clearInstance() {
        DbSession.initialized = false;
        DbSession.db = null;
        if(DbSession.localToRemoteReplication) {
            DbSession.localToRemoteReplication.cancel();
            DbSession.localToRemoteReplication = null;
        }
        if(DbSession.remoteToLocalReplication) {
            DbSession.remoteToLocalReplication.cancel();
            DbSession.remoteToLocalReplication = null;
        }
        if(DbSession.remoteToLocalTimeInterval) {
            clearInterval(DbSession.remoteToLocalTimeInterval);
        }
    }
}
