"use strict";
import RssRouteHelper from "./helpers/RssRouteHelper.js";

export default (app) => {
    app.get("/rss-feeds", (request, response) => {
        new RssRouteHelper(request, response).feedsForUrl();
    });
};
