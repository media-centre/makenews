import FacebookPostsRoute from "./helpers/FacebookPostsRoute";
import FacebookBatchPosts from "./helpers/FacebookBatchPosts";
import FacebookSetAccessTokenRoute from "./helpers/FacebookSetAccessTokenRoute";
import RouteLogger from "./RouteLogger";
import FacebookSourceRoute from "./helpers/FacebookSourceRoute";
import FacebookConfigureRoute from "./helpers/FacebookConfigureRoute";
import FacebookAddConfigureRoute from "./helpers/FacebookAddConfigureRoute";

export default (app) => {
    app.get("/facebook-posts", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook-posts request received. url = %s", request.url);
        new FacebookPostsRoute(request, response, next).handle();
    });

    app.post("/facebook-set-token", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook-set-token request received. url = %s", request.url);
        new FacebookSetAccessTokenRoute(request, response, next).handle();
    });

    app.post("/facebook-batch-posts", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook-batch-posts request received. url = %s", request.url);
        new FacebookBatchPosts(request, response, next).handle();
    });

    app.get("/facebook-sources", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook-sources request received. url = %s", request.url);
        new FacebookSourceRoute(request, response, next).searchSources();
    });

    app.get("/facebook/configured/", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook/configured/ request received. url = %s", request.url);
        new FacebookConfigureRoute(request, response, next).fetchConfiguredSources();
    });
    
    app.put("/facebook/configuredSource/pages", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook/configuredSource request received. url = %s", request.url);
        new FacebookAddConfigureRoute(request, response, next).addConfiguredSource("fb-page");
    });
    
    app.put("/facebook/configuredSource/profiles", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook/configuredSource request received. url = %s", request.url);
        new FacebookAddConfigureRoute(request, response, next).addConfiguredSource("fb-profile");
    });
    
    app.put("/facebook/configuredSource/groups", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook/configuredSource request received. url = %s", request.url);
        new FacebookAddConfigureRoute(request, response, next).addConfiguredSource("fb-group");
    });
};
