"use strict";
import TwitterFeedsRoute from "./helpers/TwitterFeedsRoute.js";
import TwitterBatchFeedsRoute from "./helpers/TwitterBatchFeedsRoute.js";
import TwitterRequestTokenRoute from "./helpers/TwitterRequestTokenRoute.js";
import TwitterOauthCallbackRoute from "./helpers/TwitterOauthCallbackRoute.js";

export default (app) => {
    app.get("/twitter-feeds", (request, response, next) => {
        new TwitterFeedsRoute(request, response, next).handle();
    });
    app.post("/twitter-batch-feeds", (request, response, next) => {
        new TwitterBatchFeedsRoute(request, response, next).handle();
    });
    app.get("/twitter-request-token", (request, response, next) => {
        new TwitterRequestTokenRoute(request, response, next).handle();
    });
    app.get("/twitter-oauth-callback", (request, response, next) => {
        new TwitterOauthCallbackRoute(request, response, next).handle();
    });
    
};
