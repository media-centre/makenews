import FetchFeedsFromAllSources from "./FetchFeedsFromAllSources";
import RouteLogger from "../routes/RouteLogger";

export default (app) => {
    app.post("/fetch-feeds", (request, response) => {
        RouteLogger.instance().info(`FetchFeedsFromAllSourcesRoutes:: /fetch-feeds request received. url = ${request.url}`);
        new FetchFeedsFromAllSources(request, response).fetchFeeds();
    });
};
