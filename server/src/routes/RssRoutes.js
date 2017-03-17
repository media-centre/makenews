//import RssBatchFeedsRoute from "./helpers/RssBatchFeedsRoute";
import RouteLogger from "./RouteLogger";
import SearchURLsRoute from "./helpers/SearchURLsRoute";
import AddURLDocumentRoute from "./helpers/AddURLDocumentRoute";
import WebDefaultSourcesRoute from "./helpers/WebDefaultSourcesRoute";

export default (app) => {

    app.post("/add-url", (request, response, next) => {
        RouteLogger.instance().info("WebURLsRoutes:: /add-url request received. url = %s", request.url);
        new AddURLDocumentRoute(request, response, next).handle();
    });

    app.get("/web-sources", (request, response, next) => {
        RouteLogger.instance().info(`WebURLS:: /search-all-urls request received. url = ${request.url}`);
        new SearchURLsRoute(request, response, next).handle();
    });

    app.get("/web-default-sources", (request, response, next) => {
        RouteLogger.instance().info(`WebURLS:: /web-default-sources request received. url = ${request.url}`);
        new WebDefaultSourcesRoute(request, response, next).process();
    });
};
