import FetchAllConfiguredFeeds from "./helpers/FetchAllConfiguredFeedsRoute";
import BookmarkRoute from "./helpers/BookmarkRoute";
import BookmarkedFeedsRoute from "./helpers/BookmarkedFeedsRoute";
import RouteLogger from "./RouteLogger";

export default (app) => {
    app.post("/get-feeds", (request, response) => {
        RouteLogger.instance().info("fetchAllConfiguredFeedsRoute:: /get-feeds-from-all-sources request received. url = %s", request.url);
        new FetchAllConfiguredFeeds(request, response).fetchFeeds();
    });

    app.post("/bookmark", (request, response) => {
        RouteLogger.instance().info("bookmarkRoute:: /bookmark request received. url = %s", request.url);
        new BookmarkRoute(request, response).bookmarkFeed();
    });

    app.get("/bookmarked-feeds", (request, response) => {
        RouteLogger.instance().info("bookmarkedFeedsRoute:: /bookmarked-feeds request received. url = %s", request.url);
        new BookmarkedFeedsRoute(request, response).getFeeds();
    });
};
