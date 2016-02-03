"use strict";
import RssFeedsRoute from "./helpers/RssFeedsRoute.js";
import RssBatchFeedsRoute from "./helpers/RssBatchFeedsRoute.js";

export default (app) => {
    app.get("/rss-feeds", (request, response, next) => {
        new RssFeedsRoute(request, response, next).feedsForUrl();
    });

    app.post("/fetch-all-rss", (request, response, next) => {
        new RssBatchFeedsRoute(request, response, next).feedsForAllUrls();
    });
};
