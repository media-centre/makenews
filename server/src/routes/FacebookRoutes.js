"use strict";
import FacebookPostsRoute from "./helpers/FacebookPostsRoute.js";
import FacebookBatchPosts from "./helpers/FacebookBatchPosts.js";
import FacebookSetAccessTokenRoute from "./helpers/FacebookSetAccessTokenRoute.js";
import RouteLogger from "./RouteLogger";

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
};
