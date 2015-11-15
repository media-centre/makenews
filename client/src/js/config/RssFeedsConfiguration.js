"use strict";
import DbSession from "../db/DbSession.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import Category from "./Category.js";

export default class RssFeedsConfiguration {
    static updateRssFeeds(document, rssFeedDetails) {
        document.rssFeeds[rssFeedDetails] = true;
        return new Promise((resolve, reject) => {
            Category.saveDocument(document).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }
    static addRssFeed(categoryId, rssFeedDetails) {
        return new Promise((resolve, reject) => {
            Category.fetchDocumentByCategoryId(categoryId).then(document => {
                RssFeedsConfiguration.updateRssFeeds(document, rssFeedDetails).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(response);
                });
            }).catch(function(error) {
                if(error.status === HttpResponseHandler.codes.NOT_FOUND) {
                    let document = Category.newCategoryDocument(categoryId);
                    RssFeedsConfiguration.updateRssFeeds(document, rssFeedDetails).then(response => {
                        resolve(response);
                    }).catch(error => {
                        reject(response);
                    });
                }

            });
        });
    }
}