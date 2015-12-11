"use strict";
import authorizationRoutes from "./AuthorizationRoutes.js";
import rssReaderRoutes from "./RssReaderRoutes";
import twitterReaderRoutes from "./TwitterReaderRoutes";
import facebookReaderRoutes from "./FacebookRoutes.js";

export default function(app) {
    authorizationRoutes(app);
    rssReaderRoutes(app);
    twitterReaderRoutes(app);
    facebookReaderRoutes(app);
}
