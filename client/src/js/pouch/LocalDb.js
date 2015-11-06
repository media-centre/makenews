"use strict";
import DbParameters from "./config/DbParameters.js";
import PouchDB from "pouchdb";

export default class LocalDb {
    constructor(databaseUrl) {
        this.databaseUrl = databaseUrl;
        this.db = this.create();
    }

    create() {
        this.db = new PouchDB(this.databaseUrl, DbParameters.get());
    }

    drop() {
        this.db.destroy();
    }
}
