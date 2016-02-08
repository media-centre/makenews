"use strict";
import FetchFeedsFromAllSources from "./FetchFeedsFromAllSources.js";
import RouteLogger from "../routes/RouteLogger";

export default (app) => {
    app.post("/fetch-all-feeds-from-all-sources", (request, response) => {
        RouteLogger.instance().info("FetchFeedsFromAllSourcesRoutes:: /fetch-all-feeds-from-all-sources request received. url = %s", request.url);
        new FetchFeedsFromAllSources(request, response).fetchFeeds();
    });
};
