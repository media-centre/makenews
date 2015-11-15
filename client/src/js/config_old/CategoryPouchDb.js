"use strict";
import DbSession from "../db/DbSession.js";
import DbParameters from "../db/config/DbParameters.js";
import RssFeedConfigDbInterface from "./RssFeedConfigDbInterface";
import CategoryDbInterface from "./CategoryDbInterface.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";

export default class CategoryPouchDb {
    constructor() {
        this.db = DbSession.instance();
        //this.document = this.fetchDocument("SourceConfig");
        if(!this.db) {
            throw new Error("db and config document must exists");
        }
    }

    addCategory(categoryName) {
        console.log("add category name has been called");
        this.db.get("CategoryConfig").then(document => {
            console.log("CategoryConfig = ");
            let newCategory = categoryName + Date.now();
            document.categoryTypes[newCategory] = true;
            console.log("category name = " + newCategory);
            console.log(document);

            DbSession.instance().put(document, document._rev, function(err, response){
                if(err){
                    console.log("error = ");
                    console.log(err);
                }else {
                    console.log("printing all docs .....................");
                    DbSession.instance().allDocs({
                        include_docs: true,
                        fields: ['name']
                    }).then(function (doc) {
                        console.log(doc);
                    }).catch(function (err) {
                        console.log(err);
                    });
                }
            });
        }).catch(function (err) {
            if(err.status === HttpResponseHandler.codes.NOT_FOUND) {
                let document = CategoryDbInterface.newDocument();
                document.categoryTypes[categoryName] = true;
                console.log("in else of add category");
                console.log(document);
                DbSession.instance().put(document);
            }
        });
    }

}
