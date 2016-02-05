/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import CategoryDb from "./CategoryDb.js";
import { CategoryDocument } from "../actions/CategoryDocuments.js";
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

    static fetchSortedSourceUrlsObj(categoryId) {
        return new Promise((resolve, reject) => {
            if(StringUtil.isEmptyString(categoryId)) {
                reject("category id can not be empty");
            }
            CategoryDb.fetchSourceConfigurationsByCategoryId(categoryId).then(rssConfigurations => {
                let sourceUrls = {};
                rssConfigurations.forEach((sourceConfiguration) => {
                    if (!sourceUrls[sourceConfiguration.sourceType]) {
                        sourceUrls[sourceConfiguration.sourceType] = [];
                    }
                    sourceUrls[sourceConfiguration.sourceType].push(sourceConfiguration);
                });
                this._sortSourceUrls(sourceUrls.rss);
                this._sortSourceUrls(sourceUrls.facebook);
                this._sortSourceUrls(sourceUrls.twitter);
                resolve(sourceUrls);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static _sortSourceUrls(sources) {
        if(!sources) {
            return;
        }
        sources.sort((source1, source2) => {
            let lowerUrl1 = source1.url.toLowerCase();
            let lowerUrl2 = source2.url.toLowerCase();
            if(lowerUrl1 === lowerUrl2) {
                return 0;
            }
            if(lowerUrl1 < lowerUrl2) {
                return -1; //eslint-disable-line
            }
            if(lowerUrl1 > lowerUrl2) {
                return 1;
            }
        });
    }
}
