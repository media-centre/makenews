"use strict";
import ConfigPouchDb from "./ConfigPouchDb.js";
import DbParameters from "../db/config/DbParameters.js";


export default class ConfigDb {
    constructor(categoryName) {
        if (new.target === ConfigDb) {
            throw new TypeError("Cannot construct ConfigDb instance directly");
        }
    }

    static instance(categoryName) {
        if(DbParameters.type() === "PouchDB") {
            return new ConfigPouchDb(categoryName);
        }else{
            throw new Error("Invalid db type");
        }
    }

}
