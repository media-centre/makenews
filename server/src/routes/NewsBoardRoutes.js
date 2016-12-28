import FetchAllConfiguredFeeds from "./helpers/FetchAllConfiguredFeedsRoute";
import RouteLogger from "./RouteLogger";

export default (app) => {
    app.post("/get-feeds", (request, response) => {
        RouteLogger.instance().info("fetchAllConfiguredFeedsRoute:: /get-feeds-from-all-sources request received. url = %s", request.url);
        new FetchAllConfiguredFeeds(request, response).fetchFeeds();
    });
};
