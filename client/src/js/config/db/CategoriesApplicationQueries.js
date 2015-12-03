/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import CategoryDb from "./CategoryDb.js";
import { CategoryDocument } from "../actions/CategoryDocuments.js";
import StringUtil from "../../../../../common/src/util/StringUtil.js";


export default class CategoriesApplicationQueries {

    static fetchAllCategories() {
        return new Promise((resolve, reject) => {
            CategoryDb.fetchAllCategoryDocuments().then((categoryDocs) => {
                let categories = categoryDocs.sort((a, b)=> { return a.createdTime - b.createdTime; }).map((category) => {
                    return { "_id": category._id, "name": category.name };
                });
                resolve(categories);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static fetchSourceUrlsObj(categoryId) {
        return new Promise((resolve, reject) => {
            if(StringUtil.isEmptyString(categoryId)) {
                reject("category id can not be empty");
            }
            CategoryDb.fetchSourceConfigurationsByCategoryId(categoryId).then(rssConfigurations => {
                let sourceUrls = {};
                rssConfigurations.forEach((rssConfiguration) => {
                    if (!sourceUrls[rssConfiguration.sourceType]) {
                        sourceUrls[rssConfiguration.sourceType] = [];
                    }
                    sourceUrls[rssConfiguration.sourceType].push({ "_id": rssConfiguration._id, "url": rssConfiguration.url, "status": rssConfiguration.status  });
                });
                resolve(sourceUrls);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static addRssUrlConfiguration(categoryId, url, status) {
        let rssConfigDocument = CategoryDocument.getNewRssDocumnet(categoryId, url, status);
        return CategoryDb.createOrUpdateSource(rssConfigDocument);
    }
}
