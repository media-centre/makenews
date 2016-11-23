"use strict";
import authorizationRoutes from "./AuthorizationRoutes.js";
import rssReaderRoutes from "./RssRoutes";
import facebookReaderRoutes from "./FacebookRoutes.js";
import twitterReaderRoutes from "./TwitterRoutes";
import fetchAllFeedsRoutes from "../fetchAllFeeds/FetchFeedsFromAllSourcesRoutes.js";
import webURLsRoutes from "./WebURLsRoutes.js";

export default function(app) {
    authorizationRoutes(app);
    rssReaderRoutes(app);
    facebookReaderRoutes(app);
    twitterReaderRoutes(app);
    fetchAllFeedsRoutes(app);
    webURLsRoutes(app)
}
