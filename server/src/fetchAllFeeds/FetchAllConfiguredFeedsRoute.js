import FetchAllConfiguredFeeds from "./FetchAllConfiguredFeeds";
import RouteLogger from "../routes/RouteLogger";

export default (app) => {
    app.post("/fetch-all-feeds", (request, response) => {
        RouteLogger.instance().info("fetchAllConfiguredFeedsRoute:: /fetch-all-feeds-from-all-sources request received. url = %s", request.url);
        new FetchAllConfiguredFeeds(request, response).fetchFeeds();
    });
};
