/* eslint no-underscore-dangle:0, no-unused-vars:0, max-nested-callbacks:0, no-inline-comments:0, no-warning-comments:0 */


import PouchClient from "../../db/PouchClient";
import StringUtil from "../../../../../common/src/util/StringUtil";

export default class SourceDb {
    static fetchSourceConfigurationsByCategoryId(categoryId) {
        if(StringUtil.isEmptyString(categoryId)) {
            return new Promise((resolve, reject) => {
                reject("category id should not be empty");
            });
        }
        return PouchClient.fetchDocuments("category/sourceConfigurations", { "include_docs": true, "key": categoryId });
    }

    static fetchSourceConfigurationByUrl(url) {
        if(StringUtil.isEmptyString(url)) {
            return new Promise((resolve, reject) => {
                reject("url should not be empty");
            });
        }
        return PouchClient.fetchDocuments("category/allSourcesByUrl", { "include_docs": true, "key": url });
    }

    static fetchSourceConfigurationBySourceType(type) {
        return PouchClient.fetchDocuments("category/allSourcesBySourceType", { "include_docs": true, "key": type });
    }

    static fetchSortedSourceUrlsObj(categoryId) {
        return new Promise((resolve, reject) => {
            if(StringUtil.isEmptyString(categoryId)) {
                reject("category id can not be empty");
            }
            SourceDb.fetchSourceConfigurationsByCategoryId(categoryId).then(rssConfigurations => {
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
        sources.sort((source1, source2) => {                //eslint-disable-line consistent-return
            let lowerUrl1 = source1.url.toLowerCase();
            let lowerUrl2 = source2.url.toLowerCase();
            if(lowerUrl1 === lowerUrl2) {
                return 0;                                   //eslint-disable-line no-magic-numbers
            }
            if(lowerUrl1 < lowerUrl2) {
                return -1; //eslint-disable-line
            }
            if(lowerUrl1 > lowerUrl2) {
                return 1;                                   //eslint-disable-line no-magic-numbers
            }
        });
    }
}
