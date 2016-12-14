import RssFeedsRoute from "./helpers/RssFeedsRoute";
import RssBatchFeedsRoute from "./helpers/RssBatchFeedsRoute";
import RouteLogger from "./RouteLogger";
import SearchURLsRoute from "./helpers/SearchURLsRoute";
import AddURLDocumentRoute from "./helpers/AddURLDocumentRoute";

export default (app) => {
    app.get("/rss-feeds", (request, response, next) => {
        RouteLogger.instance().info("RssRoutes:: /rss-feeds request received. url = %s", request.url);
        new RssFeedsRoute(request, response, next).handle();
    });

    app.post("/fetch-all-rss", (request, response, next) => {
        RouteLogger.instance().info("RssRoutes:: /fetch-all-rss request received. url = %s", request.url);
        new RssBatchFeedsRoute(request, response, next).handle();
    });
    app.post("/add-url", (request, response, next) => {
        RouteLogger.instance().info("WebURLsRoutes:: /add-url request received. url = %s", request.url);
        new AddURLDocumentRoute(request, response, next).handle();
    });

    app.get("/search-all-urls", (request, response, next) => {
        RouteLogger.instance().info("WebURLS:: /search-all-urls request received. url = %s", request.url);
        new SearchURLsRoute(request, response, next).handle();
    });
};
