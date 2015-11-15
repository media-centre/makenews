"use strict";
import DbSession from "../db/DbSession.js";
import DbParameters from "../db/config/DbParameters.js";
import RssFeedConfigDbInterface from "./RssFeedConfigDbInterface";
import ConfigDbInterface from "./ConfigDbInterface.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";

export default class ConfigPouchDb {
    constructor(categoryName) {
        this.db = DbSession.instance();
        this.categoryName = categoryName;
        this.configCategoryId = "SourceConfig-" + categoryName;
        //this.document = this.fetchDocument("SourceConfig");
        if(!this.db) {
            throw new Error("db and config document must exists");
        }
    }

    addRssFeed(feedDetails) {
        let newDoc = this.newDocument();
        console.log("add rss feed has been called");
        this.db.get(this.configCategoryId).then(document => {
            console.log(document);
            document.rssFeed= feedDetails + Date.now();
            RssFeedConfigDbInterface.instance().addRssFeed(document.rssFeeds, feedDetails + Date.now());
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
                let document = newDoc;
                RssFeedConfigDbInterface.instance().addRssFeed(document.rssFeeds, feedDetails + Date.now());
                DbSession.instance().put(document);
            }
        });

        //let newRssFeeds = RssFeedConfigDbInterface.instance().addRssFeed(this.document.rssFeeds, feedDetails);
        //this.document.rssFeeds = newRssFeeds;
        //this.db.put(this.document);
        //.then(function (response) {
        //        console.log(response);
        //    }).catch(function (error) {
        //        console.log(error);
        //    });
    }

    //fetchDocument(categoryId) {
    //    this.db.get("SourceConfig").then(document => {
    //        console.log("Document = " );
    //        console.log(document);
    //        return document;
    //    }).catch(function (err) {
    //        console.log(err);
    //    });
    //    return ConfigDbInterface.newDocument();
    //}

    newDocument() {
        let document = {
            "rssFeeds" : {},
            "type": "SourceCategoryConfig",
            "categoryName": this.categoryName,
            "_id": this.configCategoryId
        };
        return document;
    }

}
