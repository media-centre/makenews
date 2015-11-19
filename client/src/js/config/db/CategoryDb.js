/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import PouchClient from "../../db/PouchClient.js";

export default class CategoryDb {

    static fetchAllCategoryDocuments() {
        return PouchClient.fetchDocuments("category/allCategories", { "include_docs": true });
    }
}
