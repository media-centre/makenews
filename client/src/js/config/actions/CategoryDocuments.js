"use strict";
import StringUtil from "../../../../../common/src/util/StringUtil.js";

export const STATUS_VALID = "valid", STATUS_INVALID = "invalid";
export class CategoryDocument {
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

    static getNewRssDocumnet(categoryId, url, status, feedItems) {
        if(StringUtil.isEmptyString(categoryId) || StringUtil.isEmptyString(url)) {
            throw new Error("category id or url can not be empty");
        }
        let rssDoc = {
            "docType": "source",
            "sourceType": "rss",
            "url": url,
            "categoryIds": [categoryId],
            "status": status
        };
        if(status === STATUS_VALID) {
            rssDoc.feedItems = feedItems;
        }
        return rssDoc;
    }
}
