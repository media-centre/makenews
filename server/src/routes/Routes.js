"use strict";
import authorizationRoutes from "./AuthorizationRoutes.js";
import rssReaderRoutes from "./RssReaderRoutes";
import facebookReaderRoutes from "./FacebookRoutes.js";
import twitterReaderRoutes from "./TwitterReaderRoutes";

export default function(app) {
    authorizationRoutes(app);
    rssReaderRoutes(app);
    facebookReaderRoutes(app);
    twitterReaderRoutes(app);
}
