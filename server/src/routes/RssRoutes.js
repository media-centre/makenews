"use strict";
import RssURLsRoute from "./helpers/RssURLsRoute.js";
import RssFeedsRoute from "./helpers/RssFeedsRoute.js";
import RssBatchFeedsRoute from "./helpers/RssBatchFeedsRoute.js";
import RouteLogger from "./RouteLogger";

export default (app) => {
    app.get("/rss-feeds", (request, response, next) => {
        RouteLogger.instance().info("RssRoutes:: /rss-feeds request received. url = %s", request.url);
        new RssFeedsRoute(request, response, next).handle();
    });

    app.post("/fetch-all-rss", (request, response, next) => {
        RouteLogger.instance().info("RssRoutes:: /fetch-all-rss request received. url = %s", request.url);
        new RssBatchFeedsRoute(request, response, next).handle();
    });
    app.post("/fetch-all-urls", (request, response, next) => {
        RouteLogger.instance().info("RssRoutes:: /fetch-all-urls request received. url = %s", request.url);
        new RssBatchFeedsRoute(request, response, next).handle();
        new RssURLsRoute(request, response, next).handle();
        //create a new RssURLRoute for fetchallURLs
    });
};
