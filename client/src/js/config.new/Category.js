"use strict";
import DbSession from "../db/DbSession.js";
import DbParameters from "../db/config/DbParameters.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";

export default class Category {

    static documentType() {
        return "ConfigCategory";
    }

    static newDocument() {
        let document = {
            "rssFeeds" : {},
            "type": Category.documentType()
        };
        return document;
    }

    static newCategoryDocument(categoryName) {
        let document = Category.newDocument();
        document._id = Category.getId(categoryName);
        return document;
    }

    static addNewCategory(categoryName) {
        let document = newDocument(categoryName);
        Category.saveDocument(document);
    }

    static saveDocument(document) {
        if(!document || !document._id) {
            throw new Error("can not save invalid document");
        }

        if(document._rev) {
            DbSession.instance().put(document, document._rev);
        } else {
            DbSession.instance().put(document);
        }
    }

    static getId(categoryName) {
        return "Category-" + categoryName;
    }
}
