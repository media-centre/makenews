/* eslint no-unused-vars:0, handle-callback-err:0 */

"use strict";
import DbParameters from "./config/DbParameters.js";
import PouchDB from "pouchdb";

export default class DbSession {
    static instance() {
        return new Promise((resolve, reject) => {
            if(this.db) {
                resolve(this.db);
            } else {
                let dbParameters = DbParameters.instance();

                new PouchDB(dbParameters.getLocalDb(), { "auto_compaction": "true" }).then(session => {
                    this.db = session;
                    DbSession.sync();
                    resolve(this.db);
                }).catch(error => {
                    new PouchDB(dbParameters.getRemoteDb()).then(session => {
                        this.db = session;
                        resolve(session);
                    });
                });
            }
        });
    }

    static clearInstance() {
        this.db = null;
        DbParameters.instance().clearInstance();
        if(this.currentSyn) {
            this.currentSyn.cancel();
            this.currentSyn = null;
        }
    }

    static sync() {
        if(this.currentSyn) {
            this.currentSyn.cancel();
            this.currentSyn = null;
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
