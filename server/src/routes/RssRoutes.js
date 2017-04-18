import RouteLogger from "./RouteLogger";
import SearchURLsRoute from "./helpers/SearchURLsRoute";
import AddURLDocumentRoute from "./helpers/AddURLDocumentRoute";

export default (app) => {

    app.post("/add-url", (request, response, next) => {
        RouteLogger.instance().info("WebURLsRoutes:: /add-url request received. url = %s", request.url);
        new AddURLDocumentRoute(request, response, next).handle();
    });

    app.get("/web-sources", (request, response, next) => {
        RouteLogger.instance().info(`WebURLS:: /search-all-urls request received. url = ${request.url}`);
        new SearchURLsRoute(request, response, next).process();
    });
};
