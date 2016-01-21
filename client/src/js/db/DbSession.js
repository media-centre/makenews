/* eslint no-unused-vars:0, handle-callback-err:0 */

"use strict";
import DbParameters from "./DbParameters.js";
import UserSession from "../user/UserSession.js";
import PouchDB from "pouchdb";
import moment from "moment";

export default class DbSession {
    static instance() {
        UserSession.instance().setLastAccessedTime(moment().valueOf());
        return new Promise((resolve, reject) => {
            if(this.db) {
                resolve(this.db);
            } else {
                let dbParameters = DbParameters.instance();

                new PouchDB(dbParameters.getLocalDbUrl(), { "auto_compaction": "true" }).then(session => {
                    this.db = session;
                    DbSession.sync();
                    resolve(this.db);
                }).catch(error => {
                    new PouchDB(dbParameters.getRemoteDbUrl()).then(session => {
                        this.db = session;
                        resolve(session);
                    });
                });
            }
        });
    }

    static clearInstance() {
        this.db = null;
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
        this.currentSyn = PouchDB.sync(dbParameters.getLocalDbUrl(), dbParameters.getRemoteDbUrl(), {
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
