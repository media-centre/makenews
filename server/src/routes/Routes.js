"use strict";
import authorizationRoutes from "./AuthorizationRoutes.js";
import rssReaderRoutes from "./RssReaderRoutes";

export default function(app) {
    authorizationRoutes(app);
    rssReaderRoutes(app);
}
