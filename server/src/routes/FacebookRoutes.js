import FacebookPostsRoute from "./helpers/FacebookPostsRoute";
import FacebookBatchPosts from "./helpers/FacebookBatchPosts";
import FacebookSetAccessTokenRoute from "./helpers/FacebookSetAccessTokenRoute";
import RouteLogger from "./RouteLogger";
import FacebookSourceRoute from "./helpers/FacebookSourceRoute";
import FacebookTokenDocumentRoute from "./helpers/FacebookTokenDocumentRoute";

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

    app.post("/facebook-sources", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook-sources request received. url = %s", request.url);
        new FacebookSourceRoute(request, response, next).searchSources();
    });


    app.get("/facebook-token-expire-time", (request, response, next) => {
        RouteLogger.instance().info("FacebookRoutes:: /facebook-token-expire-time request received. url = %s", request.url);
        new FacebookTokenDocumentRoute(request, response, next).getExpiredTime();
    });
};

