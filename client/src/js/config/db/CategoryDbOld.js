///* eslint no-underscore-dangle:0, no-unused-vars:0 */
//
//"use strict";
//import DbSession from "../../db/DbSession.js";
//import AllCategoryDb from "./AllCategoriesDb.js";
//
//export default class CategoryDb {
//
//    static fetchDocumentByCategoryId(categoryId) {
//        return new Promise((resolve, reject) => {
//            DbSession.instance().get(categoryId).then(document => {
//                resolve(document);
//            }).catch((error) => {
//                reject(error);
//            });
//        });
//    }
//
//    static fetchDocumentByCategoryName(categoryName) {
//        return new Promise((resolve, reject) => {
//            CategoryDb.fetchDocumentByCategoryId(CategoryDb.getId(categoryName)).then(document => {
//                resolve(document);
//            }).catch(error => {
//                reject(error);
//            });
//        });
//    }
//
//    static saveNewCategoryDocument(categoryName) {
//        if(!categoryName) {
//            throw new Error("category name can not be empty");
//        }
//        let document = CategoryDb.newCategoryDocumentByName(categoryName);
//        return new Promise((resolve, reject) => {
//            CategoryDb.saveDocument(document).then(response => {
//                resolve(response);
//            }).catch(error => {
//                reject(error);
//            });
//        });
//    }
//
//    static saveDocument(document) {
//        if(!document || !document._id || !document.name) {
//            throw new Error("can not save invalid document");
//        }
//        return new Promise((resolve, reject) => {
//            AllCategoryDb.addCategory(document.name).then((response) => {
//                if (document._rev) {
//                    DbSession.instance().put(document, document._rev).then((saveResponse)=> {
//                        resolve(saveResponse);
//                    }).catch((saveError) => {
//                        reject(saveError);
//                    });
//                } else {
//                    DbSession.instance().put(document).then((saveResponse) => {
//                        resolve(saveResponse);
//                    }).catch((saveError) => {
//                        reject(saveError);
//                    });
//                }
//            });
//        });
//    }
//
//    static getId(categoryName) {
//        return "Category-" + categoryName;
//    }
//
//    static getName(categoryId) {
//        return categoryId.split("-")[1];
//    }
//
//    static documentType() {
//        return "ConfigCategory";
//    }
//
//    static newDocument() {
//        let document = {
//            "rssFeeds": {},
//            "faceBookFeeds": {},
//            "twitterFeeds": {},
//            "type": CategoryDb.documentType()
//        };
//        return document;
//    }
//
//    static newCategoryDocumentByName(categoryName) {
//        let document = CategoryDb.newDocument();
//        document._id = CategoryDb.getId(categoryName);
//        document.name = categoryName;
//        return document;
//    }
//
//    static newCategoryDocumentById(categoryId) {
//        let document = CategoryDb.newDocument();
//        document._id = categoryId;
//        document.name = CategoryDb.getName(categoryId);
//        return document;
//    }
//
//}
