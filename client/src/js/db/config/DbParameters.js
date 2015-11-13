"use strict";

export default class DbParameters {
    static get() {
        return (
            { "size": 50 }
        );
    }
    static type() {
        return "PouchDB";
    }

    static setLocalDb(dbUrl) {
        if(!dbUrl) {
            throw new Error("db name can be empty = " + dbUrl);
        }
        if(!this.dbUrl) {
            this.dbUrl = dbUrl;
        }
    }

    static getLocalDb() {
        if(!this.dbUrl) {
            throw new Error("local db name not set yet.");
        }
        return this.dbUrl;
    }

    static getRemoteDb() {
        console.log("remote db = " + "http://localhost:5984/" + this.dbUrl);
        return "http://localhost:5984/" + this.dbUrl;
    }

}