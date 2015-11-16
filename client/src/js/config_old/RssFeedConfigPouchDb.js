"use strict";

export default class RssFeedConfigPouchDb  {

    addRssFeed(existingRssFeedJson, newfeedDetails) {
        existingRssFeedJson[newfeedDetails] = true;

        return existingRssFeedJson;
        //    this.db.post({
        //{"_id": category},
        //{"rssfeed": [{"_id": "link1", "url": "http://testurl"}
        //    , "link2", "link3"]}
        //    });
        //    this.db.allDocs({
        //        include_docs: true,
        //        fields: ['name']
        //    }).then(function (doc) {
        //        console.log(doc);
        //    }).catch(function (err) {
        //        console.log(err);
        //    });
    }

    fetchCategoryDocument(categoryId) {
        return document;
    }
}
