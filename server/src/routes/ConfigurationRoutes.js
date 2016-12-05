import RouteLogger from "./RouteLogger";
import SourceConfigureRoute from "./helpers/SourceConfigureRoute";

export default (app) => {
    app.get("/configuredSources", (request, response, next) => {
        RouteLogger.instance().info("ConfiguredSourcesRoutes:: /configuredSources request received. url = %s", request.url);
        new SourceConfigureRoute(request, response, next).fetchConfiguredSources();
    });
};
