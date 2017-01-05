import TwitterFeedsRoute from "./helpers/TwitterFeedsRoute";
import TwitterBatchFeedsRoute from "./helpers/TwitterBatchFeedsRoute";
import TwitterRequestTokenRoute from "./helpers/TwitterRequestTokenRoute";
import TwitterOauthCallbackRoute from "./helpers/TwitterOauthCallbackRoute";
import TwitterTokenRoute from "./helpers/TwitterTokenRoute";
import TwitterFollowersRoute from "./helpers/TwitterFollowersRoute";
import RouteLogger from "./RouteLogger";

export default (app) => {
    app.get("/twitter-feeds", (request, response, next) => {
        RouteLogger.instance().info("TwitterRoutes:: /twitter-feeds request received. url = %s", request.url);
        new TwitterFeedsRoute(request, response, next).handle();
    });
    app.post("/twitter-batch-feeds", (request, response, next) => {
        RouteLogger.instance().info("TwitterRoutes:: /twitter-batch-feeds request received. url = %s", request.url);
        new TwitterBatchFeedsRoute(request, response, next).handle();
    });
    app.get("/twitter-request-token", (request, response, next) => {
        RouteLogger.instance().info("TwitterRoutes:: /twitter-request-token request received. url = %s", request.url);
        new TwitterRequestTokenRoute(request, response, next).handle();
    });
    app.get("/twitter-oauth-callback", (request, response, next) => {
        RouteLogger.instance().info("TwitterRoutes:: /twitter-oauth-callback request received. url = %s", request.url);
        new TwitterOauthCallbackRoute(request, response, next).handle();
    });

    app.get("/twitter-token", (request, response, next) => {
        RouteLogger.instance().info("TwitterRoutes:: /twitter-token request received. url = %s", request.url);
        new TwitterTokenRoute(request, response, next).handle();
    });

    app.get("/twitter-followers", (request, response, next) => {
        RouteLogger.instance().info("Twitter Routes:: /twitter-sources request received. url = %s", request.url);
        new TwitterFollowersRoute(request, response, next).handle();
    });
};
