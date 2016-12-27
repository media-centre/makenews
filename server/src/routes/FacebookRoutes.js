import FacebookPostsRoute from "./helpers/FacebookPostsRoute";
import FacebookBatchPosts from "./helpers/FacebookBatchPosts";
import FacebookAccessTokenRoute from "./helpers/FacebookAccessTokenRoute";
import RouteLogger from "./RouteLogger";
import FacebookSourceRoute from "./helpers/FacebookSourceRoute";

export default (app) => {
    app.get("/facebook-posts", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook-posts request received. url = %s", request.url);
        new FacebookPostsRoute(request, response, next).handle();
    });

    app.post("/facebook-set-token", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook-set-token request received. url = %s", request.url);
        new FacebookAccessTokenRoute(request, response, next).handle();
    });

    app.post("/facebook-batch-posts", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook-batch-posts request received. url = %s", request.url);
        new FacebookBatchPosts(request, response, next).handle();
    });

    app.post("/facebook-sources", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook-sources request received. url = %s", request.url);
        new FacebookSourceRoute(request, response, next).searchSources();
    });


    app.post("/facebook-token-expire-time", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook-token-expire-time request received. url = %s", request.url);
        new FacebookAccessTokenRoute(request, response, next).getExpiredTime();
    });
};

