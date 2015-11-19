/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import PouchClient from "../../db/PouchClient.js";
import StringUtil from "../../../../../common/src/util/StringUtil.js";

export default class CategoryDb {

    static fetchAllCategoryDocuments() {
        return PouchClient.fetchDocuments("category/allCategories", { "include_docs": true });
    }

    static fetchRssConfigurations(categoryId) {
        if( !StringUtil.validNonEmptyString(categoryId) ) {
            throw new Error("category id should not be empty");
        }
        return PouchClient.fetchDocuments("category/rssConfigurations", { "include_docs": true, "key": categoryId });
    }
}
