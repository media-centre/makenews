import WebURLSFeedRoute from "./helpers/WebURLSFeedRoute";
import RouteLogger from "./RouteLogger";

export default (app) => {
    app.get("/add-url", (request, response, next) => {
        RouteLogger.instance().info("WebURLsRoutes:: /add-url request received. url = %s", request.url);
        new WebURLSFeedRoute(request, response, next).handle();
    });
};
