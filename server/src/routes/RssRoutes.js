"use strict";
import RssRoute from "./helpers/RssRoute.js";

export default (app) => {
    app.get("/rss-feeds", (request, response, next) => {
        new RssRoute(request, response, next).feedsForUrl();
    });

    app.post("/fetch-all-rss", (request, response, next) => {
        new RssRoute(request, response, next).feedsForAllUrls();
    });
};
