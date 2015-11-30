"use strict";
import RssReaderHelper from "./helpers/RssReaderHelper.js";

export default (app) => {
    app.get("/rss-feeds", (request, response) => {
        new RssReaderHelper(request, response).feedsForUrl();
    });
};
