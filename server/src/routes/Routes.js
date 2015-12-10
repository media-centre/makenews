"use strict";
import authorizationRoutes from "./AuthorizationRoutes.js";
import rssReaderRoutes from "./RssReaderRoutes";
import twitterReaderRoutes from "./TwitterReaderRoutes";

export default function(app) {
    authorizationRoutes(app);
    rssReaderRoutes(app);
    twitterReaderRoutes(app);
}
