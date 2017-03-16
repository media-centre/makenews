import TwitterRequestTokenRoute from "./helpers/TwitterRequestTokenRoute";
import TwitterOauthCallbackRoute from "./helpers/TwitterOauthCallbackRoute";
import TwitterHandlesRoute from "./helpers/TwitterHandlesRoute";
import TwitterTokenRoute from "./helpers/TwitterTokenRoute";
import TwitterFollowingsRoute from "./helpers/TwitterFollowingsRoute";
import RouteLogger from "./RouteLogger";

export default (app) => {
    app.get("/twitter-request-token", (request, response, next) => {
        RouteLogger.instance().info("TwitterRoutes:: /twitter-request-token request received. url = %s", request.url);
        new TwitterRequestTokenRoute(request, response, next).handle();
    });

    app.get("/twitter-oauth-callback", (request, response, next) => {
        RouteLogger.instance().info("TwitterRoutes:: /twitter-oauth-callback request received. url = %s", request.url);
        new TwitterOauthCallbackRoute(request, response, next).handle();
    });

    app.get("/twitter-handles", (request, response, next) => {
        RouteLogger.instance().info("Twitter Routes:: /twitter-handles request received.");
        new TwitterHandlesRoute(request, response, next).handle();
    });

    app.get("/twitter-token", (request, response, next) => {
        RouteLogger.instance().info("TwitterRoutes:: /twitter-token request received. url = %s", request.url);
        new TwitterTokenRoute(request, response, next).handle();
    });

    app.get("/twitter-followings", (request, response, next) => {
        RouteLogger.instance().info(`TwitterRoutes:: /twitter-followings request received. url = ${request.url}`);
        new TwitterFollowingsRoute(request, response, next).process();
    });
};
