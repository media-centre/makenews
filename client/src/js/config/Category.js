"use strict";
import DbSession from "../db/DbSession.js";
import DbParameters from "../db/config/DbParameters.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";

export default class Category {

    static fetchDocumentByCategoryId(categoryId) {
        return new Promise((resolve, reject) => {
            DbSession.instance().get(categoryId).then(document => {
                resolve(document);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static fetchDocumentByCategoryName(categoryName) {
        return new Promise((resolve, reject) => {
            Category.fetchDocumentByCategoryId(Category.getId(categoryName)).then(document => {
                resolve(document);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static saveNewCategoryDocument(categoryName) {
        let document = newDocument(categoryName);
        return new Promise((resolve, reject) => {
            Category.saveDocument(document).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static saveDocument(document) {
        if(!document || !document._id) {
            throw new Error("can not save invalid document");
        }
        return new Promise((resolve, reject) => {
            if (document._rev) {
                DbSession.instance().put(document, document._rev, (error, response) => {
                    if(!error) {
                        resolve(response);
                    }else{
                        reject(error);
                    }
                });
            } else {
                DbSession.instance().put(document, (error, response) => {
                    if(!error) {
                        resolve(response);
                    }else{
                        reject(error);
                    }
                });
            }
        });
    }

    static getId(categoryName) {
        return "Category-" + categoryName;
    }

    static documentType() {
        return "ConfigCategory";
    }

    static newDocument() {
        let document = {
            "rssFeeds" : {},
            "faceBookFeeds" : {},
            "twitterFeeds" : {},
            "type": Category.documentType()
        };
        return document;
    }

    static newCategoryDocument(categoryName) {
        let document = Category.newDocument();
        document._id = Category.getId(categoryName);
        document.name = categoryName;
        return document;
    }

}
