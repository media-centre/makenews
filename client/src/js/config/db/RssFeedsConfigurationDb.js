"use strict";
import HttpResponseHandler from "../../../../../common/src/HttpResponseHandler.js";
import CategoryDb from "./CategoryDb.js";

export default class RssFeedsConfigurationDb {
    static updateRssFeeds(document, rssFeedDetails) {
        //document.rssFeeds[rssFeedDetails] = true;
        //return new Promise((resolve, reject) => {
        //    CategoryDb.saveDocument(document).then(response => {
        //        resolve(response);
        //    }).catch(error => {
        //        reject(error);
        //    });
        //});
    }
    static addRssFeed(categoryName, rssFeedDetails) {
        //return new Promise((resolve, reject) => {
        //    CategoryDb.fetchDocumentByCategoryName(categoryName).then(document => {
        //        RssFeedsConfigurationDb.updateRssFeeds(document, rssFeedDetails).then((updateResponse) => {
        //            resolve(updateResponse);
        //        }).catch((updateError) => {
        //            reject(updateError);
        //        });
        //    }).catch(function(error) {
        //        if(error.status === HttpResponseHandler.codes.NOT_FOUND) {
        //            let document = CategoryDb.newCategoryDocumentByName(categoryName);
        //            RssFeedsConfigurationDb.updateRssFeeds(document, rssFeedDetails).then((updateResponse) => {
        //                resolve(updateResponse);
        //            }).catch((updateError) => {
        //                reject(updateError);
        //            });
        //        }
        //
        //    });
        //});
    }
}
