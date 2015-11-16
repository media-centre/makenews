"use strict";
import RssFeedConfigPouchDb from "./RssFeedConfigPouchDb";
import DbParameters from "../db/config/DbParameters.js";

export default class RssFeedConfigDbInterface {

    constructor(categoryName) {
        if (new.target === RssFeedConfigDbInterface) {
            throw new TypeError("Cannot construct rss feed config object directly");
        }
    }

    static instance() {
        if(DbParameters.type() === "PouchDB") {
            return new RssFeedConfigPouchDb();
        }else{
            throw new Error("Invalid db type");
        }
    }

}

