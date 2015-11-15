"use strict";
import DbSession from "../db/DbSession.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import Category from "./Category.js";
import { connect } from "react-redux";

export default class AllCategory {

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

    static addCategoryDocument(document, categoryName) {
        if(!document || !categoryName) {
            throw new Error("document and category name can not be empty");
        }
        document["categories"].categoryName = true;
        if(document._rev) {
            DbSession.instance().put(document, document._rev);
        } else {
            DbSession.instance().put(document);
            Category.addNewCategory(categoryName);
        }

    }
    static addCategory(categoryName) {
        if(!categoryName) {
            throw new Error("category name can not be empty");
        }

        DbSession.instance().get(AllCategory.documentType()).then(document => {
            AllCategory.addCategoryDocument(document, categoryName);
        }).catch(function(error) {
            if(error.status === HttpResponseHandler.codes.NOT_FOUND) {
                let document = AllCategory.newDocument();
                AllCategory.addCategoryDocument(document, categoryName);
            }
        });
    }
}