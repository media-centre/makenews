"use strict";
import DbSession from "../db/DbSession.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import Category from "./Category.js";

export default class RssFeedsConfiguration {
    static updateRssFeeds(document, rssFeedDetails) {
        document.rssFeeds[rssFeedDetails] = true;
        Category.saveDocument(document);
    }
    static addRssFeed(categoryName, rssFeedDetails) {
        DbSession.instance().get(Category.getId(categoryName)).then(document => {
            RssFeedsConfiguration.updateRssFeeds(document, rssFeedDetails);

        }).catch(function(error) {
            if(error.status === HttpResponseHandler.codes.NOT_FOUND) {
                let document = Category.newCategoryDocument(categoryName);
                RssFeedsConfiguration.updateRssFeeds(document, rssFeedDetails);
            }

        });
    }

}