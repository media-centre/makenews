/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import PouchClient from "../../db/PouchClient.js";

export default class SurfDb {
    static fetchAllSourcesWithCategories() {
        return PouchClient.fetchDocuments("category/allSourcesWithCategories", { "include_docs": true });
    }
}
