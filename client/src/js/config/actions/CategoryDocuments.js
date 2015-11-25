"use strict";
import StringUtil from "../../../../../common/src/util/StringUtil.js";

export default class CategoryDocument {
    static getNewCategoryDocument(categoryName) {
        if(StringUtil.isEmptyString(categoryName)) {
            throw new Error("category name can not be empty");
        }

        return {
            "docType": "category",
            "name": categoryName,
            "createdTime": CategoryDocument._getCreatedTime()
        };
    }

    static _getCreatedTime() {
        return new Date().getTime();
    }

    static getNewRssDocumnet(categoryId, url) {
        if(StringUtil.isEmptyString(categoryId) || StringUtil.isEmptyString(url)) {
            throw new Error("category id or url can not be empty");
        }
        return {
            "docType": "source",
            "sourceType": "rss",
            "url": url,
            "categoryIds": [categoryId]
        };
    }


}
