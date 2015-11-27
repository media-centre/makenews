"use strict";
import authorizationRoutes from "./AuthorizationRoutes.js";
import RssReaderRoutes from "./RssReaderRoutes";

export default function(app) {
    authorizationRoutes(app);
    RssReaderRoutes(app);
}
