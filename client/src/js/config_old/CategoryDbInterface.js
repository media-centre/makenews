"use strict";
import CategoryPouchDb from "./CategoryPouchDb.js";
import DbParameters from "../db/config/DbParameters.js";


export default class CategoryDbInterface {
    constructor() {
        if (new.target === CategoryDbInterface) {
            throw new TypeError("Cannot construct CategoryDbInterface instance directly");
        }
    }

    static instance() {
        if(DbParameters.type() === "PouchDB") {
            return new CategoryPouchDb();
        }else{
            throw new Error("Invalid db type");
        }
    }

    static newDocument() {
        let document = {
            "type": "CategoryConfig",
            "defaultCategory": "TimeLine",
            "categoryTypes": {"TimeLine": true},
            "_id": "CategoryConfig"
        };
        return document;
    }
}
