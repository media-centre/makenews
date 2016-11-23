import AddURLDocumentRoute from "./helpers/AddURLDocumentRoute";
import RouteLogger from "./RouteLogger";
import SearchURLsRoute from "./helpers/SearchURLsRoute";

export default (app) => {
    app.get("/add-url", (request, response, next) => {
        RouteLogger.instance().info("WebURLsRoutes:: /add-url request received. url = %s", request.url);
        new AddURLDocumentRoute(request, response, next).handle();
    });

    app.post("/search-all-urls", (request, response, next) => {
        RouteLogger.instance().info("WebURLS:: /search-all-urls request received. url = %s", request.url);
        new SearchURLsRoute(request, response, next).handle();
    });
};
