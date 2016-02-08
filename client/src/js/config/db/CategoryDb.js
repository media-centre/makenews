/* eslint no-underscore-dangle:0, no-unused-vars:0, max-nested-callbacks:0, no-inline-comments:0, no-warning-comments:0 */

"use strict";
import PouchClient from "../../db/PouchClient.js";
import StringUtil from "../../../../../common/src/util/StringUtil.js";
import FeedApplicationQueries from "../../../js/feeds/db/FeedApplicationQueries";
import Source from "../Source";
import SourceDb from "../db/SourceDb.js";
import Category from "../Category.js";

export default class CategoryDb {
    static findById(id) {
        return new Promise((resolve, reject) => {
            PouchClient.getDocument(id).then(categoryDoc => {
                resolve(Category.instance(categoryDoc));
            }).catch(error => {
                reject(error);
            });
        });
    }

    static fetchAllCategoryDocuments() {
        return PouchClient.fetchDocuments("category/allCategories", { "include_docs": true });
    }

    static fetchAllCategories() {
        return new Promise((resolve, reject) => {
            CategoryDb.fetchAllCategoryDocuments().then((categoryDocs) => {
                let categories = categoryDocs.sort((first, second)=> {
                    return first.createdTime - second.createdTime;
                }).map((category) => {
                    return { "_id": category._id, "name": category.name };
                });
                resolve(categories);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static fetchCategoryByName(name) {
        if(StringUtil.isEmptyString(name)) {
            return new Promise((resolve, reject) => {
                reject("name should not be empty");
            });
        }
        return PouchClient.fetchDocuments("category/allCategoriesByName", { "include_docs": true, "key": name });
    }

    static deleteCategory(categoryId) {
        return new Promise((resolve, reject) => {
            CategoryDb.findById(categoryId).then(category => {
                category.delete().then(response => {
                    resolve(true);
                }).catch(error => {
                    reject(error);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }
}
