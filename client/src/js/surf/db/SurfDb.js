/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import PouchClient from "../../db/PouchClient.js";

export default class SurfDb {
    static fetchAllFeedsAndCategoriesWithSource() {
        return PouchClient.fetchLinkedDocuments("category/allFeedsAndCategoriesWithSource", { "include_docs": true });
    }
}
