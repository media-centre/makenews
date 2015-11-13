"use strict";
import DbParameters from "./config/DbParameters.js";
import PouchDB from "pouchdb";

export default class DbSession {
    static instance() {
        if(!this.db) {
            if(DbParameters.type() !== "PouchDB") {
                throw new Error("Unsupported database " + DbParameters.type());
            }
            this.db = new PouchDB(DbParameters.getLocalDb());
        }
        return this.db;
    }

    static sync() {
        DbSession.instance();
        if(this.currentSyn) {
            this.currentSyn.cancel();
        }
        this.currentSyn = PouchDB.sync(DbParameters.getLocalDb(), DbParameters.getRemoteDb(), {
            live: true,
            retry: true
        }).on('change', function (info) {
            console.log("db got changed");
            // handle change
        }).on('paused', function () {
            // replication paused (e.g. user went offline)
        }).on('active', function () {
            // replicate resumed (e.g. user went back online)
        }).on('denied', function (info) {
            // a document failed to replicate, e.g. due to permissions
        }).on('complete', function (info) {
            // handle complete
        }).on('error', function (err) {
            // handle error
        });
    }
}
