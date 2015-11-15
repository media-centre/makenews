"use strict";
import DbSession from "../db/DbSession.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import Category from "./Category.js";
import { connect } from "react-redux";

export default class AllCategory {
    static fetchAllCategories() {
        return new Promise((resolve, reject)=> {
            DbSession.instance().get(AllCategory.documentType()).then(document => {
                let allCategories = document.categories;
                if(!allCategories) {
                    allCategories = {};
                }
                resolve(allCategories);
            }).catch(error => {
                if(error.status === HttpResponseHandler.codes.NOT_FOUND) {
                    resolve({});
                } else {
                    reject(error);
                }
            });
        });
    }

    static addCategoryDocument(document, categoryName) {
        if(!document || !categoryName) {
            throw new Error("document and category name can not be empty");
        }
        document.categories.categoryName = true;
        if(document._rev) {
            DbSession.instance().put(document, document._rev);
        } else {
            DbSession.instance().put(document);
            Category.saveNewCategoryDocument(categoryName);
        }

    }
    static addCategory(categoryName) {
        if(!categoryName) {
            throw new Error("category name can not be empty");
        }

        DbSession.instance().get(AllCategory.documentType()).then(document => {
            AllCategory.addCategoryDocument(document, categoryName);
        }).catch(error => {
            if(error.status === HttpResponseHandler.codes.NOT_FOUND) {
                let document = AllCategory.newDocument();
                AllCategory.addCategoryDocument(document, categoryName);
            }
        });
    }

    static documentType() {
        return "ConfigAllCategory";
    }

    static newDocument() {
        return {
            "_id": this.documentType(),
            "categories": {"TimeLine": true},
            "type": AllCategory.documentType()
        };
    }

}