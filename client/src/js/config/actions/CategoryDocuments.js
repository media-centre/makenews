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
}
