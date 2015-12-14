"use strict";
import StringUtil from "../../../../../common/src/util/StringUtil.js";
import DateTimeUtil from "../../utils/DateTimeUtil.js";

export class CategoryDocument {
    static getNewCategoryDocument(categoryName) {
        if(StringUtil.isEmptyString(categoryName)) {
            throw new Error("category name can not be empty");
        }

        return {
            "docType": "category",
            "name": categoryName,
            "createdTime": DateTimeUtil.getCreatedTime()
        };
    }

    static getNewDocument(categoryId, title, url, status) {
        if(StringUtil.isEmptyString(categoryId) || StringUtil.isEmptyString(url)) {
            throw new Error("category id or url can not be empty");
        }
        let rssDoc = {
            "docType": "source",
            "sourceType": title,
            "url": url,
            "categoryIds": [categoryId],
            "status": status
        };
        return rssDoc;
    }
}
