/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import CategoryDb from "./CategoryDb.js";
import StringUtil from "../../../../../common/src/util/StringUtil.js";
import TwitterDb from "../../twitter/TwitterDb.js";

export default class CategoriesApplicationQueries {
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
}
