import RouteLogger from "./RouteLogger";
import SourceConfigureRoute from "./helpers/SourceConfigureRoute";
import ConfigureFacebookPageRoute from "./helpers/facebook/ConfigureFacebookPageRoute";

export default (app) => {
    app.get("/configure-sources", (request, response, next) => {
        RouteLogger.instance().info("ConfiguredSourcesRoutes:: /configure-sources request received. url = %s", request.url);
        new SourceConfigureRoute(request, response, next).fetchConfiguredSources();
    });

    app.put("/configure-sources", (request, response, next) => {
        RouteLogger.instance().info("ConfiguredSourcesRoutes:: /configure-sources PUT request received. url = %s", request.url);
        new SourceConfigureRoute(request, response, next).addConfiguredSource();
    });

    app.put("/configure-facebook-page", (request, response, next) => {
        RouteLogger.instance().info("ConfiguredSourcesRoutes:: /configure-facebook-page PUT request received. url = %s", request.url);
        new ConfigureFacebookPageRoute(request, response, next).process();
    });
};
