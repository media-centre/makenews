"use strict";
import TwitterFeedsRoute from "./helpers/TwitterFeedsRoute.js";
import TwitterBatchFeedsRoute from "./helpers/TwitterBatchFeedsRoute.js";

export default (app) => {
    app.get("/twitter-feeds", (request, response, next) => {
        new TwitterFeedsRoute(request, response, next).handle();
    });
    app.post("/twitter-batch-feeds", (request, response, next) => {
        new TwitterBatchFeedsRoute(request, response, next).handle();
    });
    app.get("/twitter-request-token", (request, response) => {
        new TwitterRouterHelper(request, response).requestToken();
    });
    app.get("/twitter-oauth-callback", (request, response) => {
        new TwitterRouterHelper(request, response).twitterAuthenticateCallback();
    });
    
};
